import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Intro from "../components/Intro";
import Layout from "../components/Layout";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import styled from "@emotion/styled";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import { BootstrapInput, Item } from "../styles";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DashLayout from "../components/DashLayout";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import { useDispatch, useSelector } from "react-redux";

import { selectCurrentToken, setCredentials } from "../features/auth/authSlice";
import { BASE_URL } from "../constants/axiosConstants";
import axios from "axios";
import { EMAIL_REGEX, PWD_REGEX } from "../constants/authConstants";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PwdDialog from "../components/PwdDialog";
import useAxiosAPI from "../hooks/useAxiosAPI";

//custom tab panel
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

//custom tab
const MyTab = styled(Tab)(() => ({
  textTransform: "none",
  padding: 0,
  marginRight: 40,
  minWidth: 0,
  alignItems: "start",
}));

//https://priyal-babel.medium.com/upload-and-delete-images-with-a-react-app-using-cloudinary-api-32565d11d760
//https://cloudinary.com/documentation/node_quickstart
//  if (pics.type === "image/jpeg" || pics.type === "image/png") {
//    const data = new FormData();
//    data.append("file", e.target.files/[0]);//fileObject //or formData with file = [{file: "file}] for multiple
//    data.append("upload_preset", "notezipper");
//    data.append("cloud_name", "piyushproj");
//    fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
//      method: "post",
//      body: data,
//    })
//      .then((res) => res.json())
//      .then((data) => {
//        setPic(data.url.toString());
//        console.log(pic);
//      })
//      .catch((err) => {
//        console.log(err);
//      });
//  } else {
//    return setPicMessage("Please Select an Image");
//  }

const MEGA_BYTES_PER_BYTE = 1e6;
const convertBytesToMB = (bytes) => Math.round(bytes / MEGA_BYTES_PER_BYTE);

//settings component
const Settings = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const axiosAPI = useAxiosAPI();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [password, setPassword] = useState();
  /**----------------------------
 * BILLING/SUBSCRIPTIONS
 --------------------------------*/

  const [value, setValue] = React.useState("female");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  //pricing plans
  const [alignment, setAlignment] = React.useState("left");

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  /**----------------------------
 * ACCOUNT TAB
 --------------------------------*/

  const [deleteAc, setDeleteAc] = useState(true);

  const token = useSelector(selectCurrentToken);

  const [pwdCaption, setPwdCaption] = useState(false);

  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);
  //dialog
  const [openD, setOpenD] = React.useState(false);
  const handleOpenD = () => {
    setOpenD(true);
  };
  const handleCloseD = () => {
    setOpenD(false);
  };
  //end of dialog

  const [user, setUser] = useState({});

  const [message, setMessage] = useState(null);

  const [selectedPic, setSelectedPic] = useState();

  const [profileUrl, setProfileUrl] = useState();

  const [picError, setPicError] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //new pwd handler
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  //confirm password handler
  const handleConfirmShowPass = () => setShowConfirmPass((show) => !show);
  const handleMouseDownConfirmPass = (event) => {
    event.preventDefault();
  };

  //a/c hook
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset,
  } = useForm();
  //pwd hook
  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    formState: { errors: pwdErrors, isValid: isValidP },
    watch: pwdWatch,
    reset: resetPwd,
  } = useForm();

 

  //set defaults
  useEffect(() => {
    reset({ ...user });
  }, [user]);

  useEffect(() => {
    if (!selectedPic) return;
    //option 1
    const objectUrl = URL.createObjectURL(selectedPic); //url rep a file object given
    setProfileUrl(objectUrl);
    //option 2
    // const reader = new FileReader();//get image path from file data/object with file info
    // reader.readAsDataURL(selectedPic);
    // reader.onloadend = () => {
    //   setProfileUrl(reader.result); //reader.result= data: URL representing the file's data as a base64 encoded string.
    //   console.log(reader.result); //output: data:image/jpeg;base64, /..very long string of characters
    // }

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPic]);

  // console.log(profileUrl);

  
  ///submit account form
  const onSubmitAccount = async (inputs, e) => {
    const formData = new FormData();
    formData.append("profilePic", selectedPic);

    formData.append("password", password);

    Object.keys(inputs).forEach((field, i) => {
      formData.append(field, inputs[field]);
    });

    try {
      setMessage("loading...");
      const { data: userData } = await axiosAPI.patch(
        `/api/users/${user.id}`,
        formData
      );
      if (!userData.email) throw new Error("Update failed. Please try again");
      setMessage("Saved");
      setUser(userData);
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  };

  //console.log(password);

  //submit pwd form
  const onSubmitPwd = async (inputs, e) => {
    try {
      setMessage("loading...");
      const { data: response } = await axiosAPI.patch(`/api/users/${user.id}`, {
        password,
        newPassword: inputs.newPassword,
      });
      setMessage("Saved");
      resetPwd({ newPassword: "", confirmPassword: "" }); //resets password field
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  };

  //handle file change/set error
  const handlePicChange = (e) => {
    const fileType = ["image/jpeg", "image/png", "image/gif"];
    setPicError();

    if (convertBytesToMB(e.target?.files[0]?.size || 0) > 5) {
      setPicError("File must be less than or equal to 5mb in size");
      return;
    }
    // if (!fileType.includes(e.target?.files[0]?.type)) {
    //   setPicError("Please Select an Image");
    //   return;
    // }
    setSelectedPic(e.target?.files[0]);
  };

  const handleDeleteSubmit = (cb) => {
    return cb;
  };
  const onSubmitDelete = async () => {
    try {
      setMessage("loading...");
      const { data: response } = await axiosAPI.delete(`/api/users/${user.id}`);
      setMessage(response.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || error.toString()
      );
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        setMessage("Loading...");
        const { data } = await axiosAPI.get(`/api/users`);

        setUser(data);
        setMessage("Fetched");
      } catch (error) {
        setMessage(
          error.response?.data?.message || error.message || error.toString()
        );
        // }
      }
    };

    getUser();
  }, []);

  const [dialogProps, setDialogProps] = useState({});

  const handleDialog = (dialog) => {
    handleOpenD();
    //account dialog props
    const accountDialogProps = {
      handleSubmit,
      submitCb: onSubmitAccount,
    };

    //pwd dialog props
    const pwdDialogProps = {
      handleSubmit: handlePwdSubmit,
      submitCb: onSubmitPwd,
    };
    //delete a/c
    const deleteDialogProps = {
      handleSubmit: handleDeleteSubmit,
      submitCb: onSubmitDelete,
    };

    if (dialog === "account") setDialogProps(accountDialogProps);
    if (dialog === "pwd") setDialogProps(pwdDialogProps);
    if (dialog === "del") setDialogProps(deleteDialogProps);

    //show dialog
    handleOpenD();
  };

  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
      >
        <Alert
          variant="filled"
          severity="error"
          onClose={() => setMessage(null)}
        >
          {message}
        </Alert>
      </Snackbar>
      <PwdDialog
        open={openD}
        password={password}
        setPassword={setPassword}
        handleClose={handleCloseD}
        {...dialogProps}
      />
      <Intro>Settings</Intro>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            textColor="secondary"
            indicatorColor="secondary"
          >
            <MyTab
              label={
                <Box sx={{ display: "flex" }}>
                  <PersonOutlineOutlinedIcon />
                  <Typography pl>Account</Typography>
                </Box>
              }
              id={0}
            />
            <MyTab
              label={
                <Box sx={{ display: "flex" }}>
                  <NotificationsNoneOutlinedIcon />
                  <Typography pl>Notifications</Typography>
                </Box>
              }
              id={1}
            />
            <MyTab
              label={
                <Box sx={{ display: "flex" }}>
                  <TurnedInNotOutlinedIcon />
                  <Typography pl>Billing</Typography>
                </Box>
              }
              id={2}
            />
          </Tabs>
        </Box>

        {/* ----------------------ACCOUNT TAB -------------------------*/}

        {/* ----------------------UPDATE ACCOUNT SECTION -------------------------*/}
        <TabPanel value={tabValue} index={0}>
          <Grid2
            spacing={2}
            container
            justifyContent="space-between"
            sx={{
              flexDirection: { xs: "column", md: "row" },
              py: 2,
            }}
          >
            <Grid2 xs py={2}>
              <Box component={Paper} p={3}>
                <Typography variant="h6" gutterBottom mb={3}>
                  Account
                </Typography>
                <form>
                  <Grid2 container>
                    <Grid2>
                      <Avatar
                        alt="profile"
                        src={profileUrl || user.profileUrl}
                      />
                    </Grid2>
                    <Grid2>
                      <Typography variant="h6" gutterBottom>
                        <Button
                          color="secondary"
                          variant="outlined"
                          sx={{ mx: { md: 2 } }}
                          component="label"
                        >
                          <input
                            // {...register("file", {
                            //   validate: {
                            //     lessThan5MB: (files) =>
                            //       convertBytesToMB(files[0]?.size) < 5 ||
                            //       "File must be less than or equal to 5mb in size",
                            //     // acceptedFormats: (files) =>
                            //     //   ["image/jpeg", "image/png", "image/gif"].includes(
                            //     //     files[0]?.type
                            //     //   ) || "Only PNG, JPEG e GIF"
                            //   },
                            // })}
                            hidden
                            accept="image/*"
                            multiple
                            type="file"
                            onChange={handlePicChange}
                          />
                          Upload new photo
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => setProfileUrl(user?.profileUrl)}
                        >
                          Reset
                        </Button>
                      </Typography>
                      <Typography variant="caption" gutterBottom>
                        Recommended dimensions: 200x200, maximum file size: 5MB
                      </Typography>
                      <Typography
                        color="error.main"
                        variant="caption"
                        paragraph
                      >
                        {picError}
                      </Typography>
                    </Grid2>
                  </Grid2>

                  <FormGroup sx={{ mb: 0.5 }}>
                    <TextField
                      {...register("username", {
                        required: "Username is required",
                      })}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Username"
                      margin="dense"
                      color="secondary"
                    />
                    <Typography color="error.main" variant="caption">
                      {errors.username?.message}
                    </Typography>
                  </FormGroup>
                  <FormGroup sx={{ mb: 0.5 }}>
                    <TextField
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        // pattern: {value: PHONE_REGEX, message: ''},
                      })}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Phone number"
                      margin="dense"
                      color="secondary"
                    />
                    <Typography color="error.main" variant="caption">
                      {errors.phoneNumber?.message}
                    </Typography>
                  </FormGroup>

                  <FormGroup sx={{ mb: 0.5 }}>
                    <TextField
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: EMAIL_REGEX,
                          message: "Enter an email address",
                        },
                      })}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Email"
                      margin="dense"
                      color="secondary"
                    />
                    <Typography color="error.main" variant="caption">
                      {errors.email?.message}
                    </Typography>
                    <Typography gutterBottom paragraph>
                      <small>
                        We’ll send a link to your new email address to complete
                        the change.
                      </small>
                    </Typography>

                    {user.newEmail && (
                      <Typography gutterBottom paragraph color="success.main">
                        <small>
                          We sent a link to your email: {user.newEmail}. Click
                          the link to change email
                        </small>
                      </Typography>
                    )}
                  </FormGroup>

                  <Button
                    onClick={() => {
                      !isValid && handleSubmit(() => {})();
                      isValid && handleDialog("account");
                    }}
                    color="secondary"
                    variant="contained"
                    disableElevation
                  >
                    Save changes
                  </Button>
                </form>
              </Box>
            </Grid2>

            {/* ----------------------CHANGE PWD SECTION -------------------------*/}
            <Grid2 xs py={2}>
              <Box component={Paper} p={3}>
                <Typography variant="h6" gutterBottom mb={3}>
                  Change Password
                </Typography>

                <form>
                  {/* ----------new pass------------ */}
                  <FormGroup sx={{ mb: 0.5 }}>
                    <TextField
                      {...registerPwd("newPassword", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Enter at least 6 characters",
                        },
                        pattern: {
                          value: PWD_REGEX,
                          message: "Spaces not allowed",
                        },
                      })}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      color="secondary"
                      margin="dense"
                      label="Password"
                      type={showNewPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowNewPassword}
                              onMouseDown={handleMouseDownNewPassword}
                              edge="end"
                            >
                              {showNewPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onFocus={() => setPwdCaption(true)}
                    />
                    <Typography color="error.main" variant="caption">
                      {pwdErrors.newPassword?.message}
                    </Typography>
                    {pwdCaption && (
                      <Typography
                        variant="caption"
                        color="muted.main"
                        gutterBottom
                      >
                        At least 6 characters with no spaces
                      </Typography>
                    )}
                  </FormGroup>
                  {/* ----------confirm pass------------ */}
                  <FormGroup sx={{ mb: 0.5 }}>
                    <TextField
                      {...registerPwd("confirmPassword", {
                        required: "Password is required",
                        validate: (value) =>
                          pwdWatch("newPassword") === value ||
                          "Passwords don't match",
                      })}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      color="secondary"
                      margin="dense"
                      label="Confirm Password"
                      type={showConfirmPass ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleConfirmShowPass}
                              onMouseDown={handleMouseDownConfirmPass}
                              edge="end"
                            >
                              {showConfirmPass ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Typography color="error.main" variant="caption">
                      {pwdErrors.confirmPassword?.message}
                    </Typography>
                  </FormGroup>
                  <Button
                    onClick={() => {
                      !isValidP && handlePwdSubmit(() => {})();
                      isValidP && handleDialog("pwd");
                    }}
                    color="secondary"
                    variant="contained"
                    disableElevation
                  >
                    Change password
                  </Button>
                </form>
              </Box>
            </Grid2>
          </Grid2>

          {/* ----------------------2 FACTOR SECTION -------------------------*/}
          <Box component={Paper} p={3} mt={3}>
            <Typography variant="h6">
              Two-factor authentication (2FA)
            </Typography>
            <Typography variant="caption" gutterBottom>
              Enhanced security for your mention account
            </Typography>
            <Typography pt={2} gutterBottom>
              <Button
                color="secondary"
                variant="contained"
                disableElevation
                // onClick={handleClick}
              >
                Activate
              </Button>
            </Typography>
          </Box>

          {/* ----------------------DEL ACCOUNT SECTION -------------------------*/}
          <Box component={Paper} p={3} mt={3}>
            <Typography variant="h6">Delete account</Typography>
            <Typography variant="caption" gutterBottom>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    color="secondary"
                    checked={deleteAc}
                    onChange={() => setDeleteAc((prev) => !prev)}
                  />
                }
                label="I confirm my account deactivation"
              />
            </Typography>
            <Typography pt={2} gutterBottom>
              <Button
                color="error"
                variant="contained"
                disableElevation
                disabled={!deleteAc}
                onClick={() => handleDialog("del")}
              >
                Delete account
              </Button>
            </Typography>
          </Box>
        </TabPanel>

        {/* ---------------------OTHER TABS------------------------ */}

        <TabPanel value={tabValue} index={1}>
          <List component={Paper}>
            <Typography variant="h6" gutterBottom pt={3} px={2}>
              Email Notifications
            </Typography>
            {/* <ListSubheader>Email Notifications</ListSubheader> */}

            {[...Array(5)].map((item, i) => {
              return (
                <ListItem divider={i !== 4} dense>
                  <ListItemText primary="Your email" secondary="hello" />
                  <Switch edge="start" defaultChecked />
                </ListItem>
              );
            })}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <List component={Paper}>
            <Typography variant="h6" gutterBottom pt={3} px={2}>
              Subscription Plan
            </Typography>
            {/* <ListSubheader>Subscription Plan</ListSubheader> */}
            <ListItem>
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
              >
                <ToggleButton value="left" aria-label="left aligned">
                  Monthly
                </ToggleButton>
                <ToggleButton value="center" aria-label="centered">
                  Yearly
                </ToggleButton>
              </ToggleButtonGroup>
            </ListItem>

            {[...Array(5)].map((item, i) => {
              return (
                <ListItem divider={i !== 4} dense>
                  {/* <ListItemButton> */}
                  <ListItemIcon>
                    <RadioGroup value={value} onChange={handleChange}>
                      <FormControlLabel value={i} control={<Radio />} />
                    </RadioGroup>
                  </ListItemIcon>
                  <ListItemText
                    primary="Free"
                    secondary="Up to 2 team members"
                  />
                  <Typography variant="h6">$30</Typography>
                  {/* </ListItemButton> */}
                </ListItem>
              );
            })}
          </List>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Settings;
