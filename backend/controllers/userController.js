const User = require("../models/userModel");
const fs = require("fs");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const { removeImage } = require("../utils/cloudnary");

const { Buffer } = require("node:buffer");

/*-----------------------------------------------------------
 * GET USER
 ------------------------------------------------------------*/
// @desc Get user
// @route GET /user
// @access Private
const getUser = async (req, res) => {
  // Get current user details
  const { user } = req;
  // If no users
  if (!user) {
    return res
      .status(400)
      .json({ message: "Something isn't right. Please contact support" });
  }

  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    profileUrl: user.profileUrl,
    phoneNumber: user.phoneNumber,
    newEmail: user.newEmail,
  });
};

/*-----------------------------------------------------------
 * REGISTER
 ------------------------------------------------------------*/

// @desc  new user
// @route POST /api/user/register
// @access Public
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  // Confirm data
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username || email
  //collation strength 2 makes username or email sent by user case insensitive i.e it should
  //match both lowercase and uppercase to ensure no same email is added in diff cases
  const duplicate = await User.findOne({ email })

    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Account already exists. Please log in" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  //gen verify token & hash it
  const verifyToken = crypto.randomBytes(10).toString("hex");
  const verifyEmailToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  //send verify token
  const emailOptions = {
    subject: "Please verify your email",
    to: email,
    body: `
                <p>Hi ${username}, </p>
                <p>Welcome to clientlance.io</p>
                <p>Please click the button below to confirm your email address:</p>             
                <a href ='${process.env.VERIFY_EMAIL_URL}/${verifyToken}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 15px 0px; padding: 5px 15px; text-transform: capitalize; border-color: #3498db;'>Confirm your email</a>  
                 
                <p>Thanks!</p>
                 <p>Clientlance team</p>
                             
                `,
  };

  const response = sendEmail(emailOptions);

  if (!response) {
    return res.status(400).json({ message: "Check details and try again" });
  }

  ///save user
  const userObject = {
    username,
    password: hashedPwd,
    email,
    verifyEmailToken,
  };

  const user = new User(userObject); //or use .create(obj)
  // Create and store new user
  const created = await user.save();

  if (!created) {
    return res.status(400).json({ message: "Check details and try again" });
  }

  //create a token that will be sent back as cookie//for resending email
  const resendEmailToken = jwt.sign(
    { id: created._id, email },
    process.env.RESEND_EMAIL_TOKEN_SECRET,
    { expiresIn: "15m" } //expires in 15 min
  );

  // Create secure cookie with user id in token
  res.cookie("resend", resendEmailToken, {
    httpOnly: false, //readable for displaying email
    secure: true,
    sameSite: "None", //
    maxAge: 15 * 60 * 1000, //expire in 15 min
  });

  res.status(201).json({ message: "Registered successfully" });
};

/*-----------------------------------------------------------
 * RESEND EMAIL
 ------------------------------------------------------------*/
// @desc resend email token
// @route POST /user/resend/token
// @access Public
const resendVerifyEmail = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.resend) {
    return res.status(401).json({ message: "Email could not be sent" });
  }

  const resendEmailToken = cookies.resend;

  jwt.verify(
    resendEmailToken,
    process.env.RESEND_EMAIL_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Email could not be sent" });
      }

      const foundUser = await User.findById(decoded.id).exec();

      if (!foundUser) {
        return res.status(400).json({ message: "Email could not be sent" });
      }
      //now resend email with new verify token
      //gen verify token
      const verifyToken = crypto.randomBytes(10).toString("hex");
      const verifyEmailToken = crypto
        .createHash("sha256")
        .update(verifyToken)
        .digest("hex");

      //resend email
      const emailOptions = {
        subject: "Please verify your email",
        to: foundUser.email,
        body: `
                <p>Hi ${foundUser.username}, </p>
                <p>Welcome to clientlance.io</p>
                <p>Please click the button below to confirm your email address:</p>             
                <a href ='${process.env.VERIFY_EMAIL_URL}/${verifyToken}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 15px 0px; padding: 5px 15px; text-transform: capitalize; border-color: #3498db;'>Confirm your email</a>  
                 
                <p>Thanks!</p>
                 <p>Clientlance team</p>
                             
                `,
      };

      const response = sendEmail(emailOptions);

      if (!response) {
        return res.status(400).json({ message: "Check details and try again" });
      }

      //update verify token
      foundUser.verifyEmailToken = verifyEmailToken;
      await foundUser.save();

      res.json({ message: "Email sent" });
    }
  );
};

/*-----------------------------------------------------------
 * UPDATE/PATCH
 ------------------------------------------------------------*/
//ALLOW USERS TO CHANGE EMAIL BUT DON'T USE EMAIL AS UNIQUE IDENTIFY IN OTHER COLLECTION//USE user: object id //the can populate
//so you will only need to update email in user collection only//id remains the same
// @desc Update user
// @route PATCH api/user/:id
// @access Private
const updateUser = async (req, res) => {
  const { username, email, phoneNumber, password, newPassword } = req.body;

  const profileUrl = req.file?.path;
  const publicId = req.file?.filename;

  const { id } = req.params;

  //check if id is a valid ObjectId//ObjectIds is constructed only from 24 hex character strings
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    await removeImage(publicId);
    return res.status(400).json({ message: "User not found" });
  }

  // Does the user exist to update//exists since we are already here
  const user = await User.findById(id).exec();

  if (!user) {
    await removeImage(publicId);
    return res.status(400).json({ message: "User not found" });
  }

  if(!password){
    return res.status(400).json({ message: "Password is required" });
  }

  

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    await removeImage(publicId);
    return res.status(400).json({ message: "Wrong password" });
  }

  // update user
  if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
  if (username) user.username = username;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  //upload and store public id
  if (profileUrl) user.profileUrl = profileUrl;
  //email changed
  if (email && user.email !== email) {
    //gen verify token & hash it
    const verifyToken = crypto.randomBytes(10).toString("hex");
    const verifyEmailToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    // Check for duplicate email//case insensitive
    const duplicate = await User.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    // Allow only updates to the original user
    if (duplicate) {
      await removeImage(publicId);
      return res.status(409).json({ message: "Duplicate email" });
    }

    //update new email and token
    user.newEmail = email;
    user.verifyEmailToken = verifyEmailToken;

    //send un hashed token
    const emailOptions = {
      subject: "Please verify your email",
      to: email,
      body: `
                <p>Hi ${user.username}, </p>
                <p>Complete changing your email address by confirming it below:</p> 
                <a href ='${process.env.VERIFY_EMAIL_URL}/${verifyToken}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 15px 0px; padding: 5px 15px; text-transform: capitalize; border-color: #3498db;'>Confirm your email</a> 
                <p>If you didn't initiate this request, please disregard this email</p>
                <p>Thanks!</p>
                <p>Clientlance team</p>
                             
                `,
    };
    const response = sendEmail(emailOptions);
    if (!response) {
      await removeImage(publicId);
      return res.status(400).json({
        message: "Account could not be updated. Please try again",
      });
    }
  }

  const updatedUser = await user.save();

  if (!updatedUser) {
    await removeImage(publicId);
    return res.status(400).json({
      message: "Account could not be updated. Please try again",
    });
  }

  //res =  updated user details
  return res.json({
    id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    profileUrl: updatedUser.profileUrl,
    phoneNumber: updatedUser.phoneNumber,
    newEmail: updatedUser.newEmail,
  });
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.params;

  //check if id is a valid ObjectId//ObjectIds is constructed only from 24 hex character strings
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "User not found" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  await user.deleteOne();

  //clear refresh token cookie
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  res.status(204).json({ message: "Account deactivated" }); //on frontend, success = clear state and redirect to home
};

module.exports = {
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  resendVerifyEmail,
};
