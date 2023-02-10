const nodemailer = require("nodemailer");

const sendEmail = async ({ from, subject, to, replyTo, body }) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    name: process.env.EMAIL_HOST,
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, //use tls
    auth: {
      user: from || process.env.EMAIL_USERNAME, //Email/ noreply or other,//must match with from in mail options else= sent to spam
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const htmlBody = `

  <body style="margin:0;padding:0;"> 
        <table
          role="presentation"
          style="width:100%;background-color: #f5f8fa; font-size: 16px; line-height: 24px;font-family: Helvetica,Arial,sans-serif; "
        >
        <tr><td colspan="3" style="height:45px;"></td> </tr>
          <tr>
            <td >            
              
            </td>
             <td style="padding:30px 30px; width: 40%; min-width: 350px; background-color: white;">
             ${body}              
            </td>
             <td>           
              
            </td>
          </tr>
          <tr style="font-size: 12px; color:#65735b;">
            <td></td>
            <td align="center"style=" padding-top:30px; width: 40%; ">
              
              <p>
                <span><a href="about" style="color: #65735b;">Unsubscribe</a></span> |
                <span><a href="about" style="color: #65735b;">About us</a></span> | 
                <span><a href="about" style="color: #65735b;">Contact support</a></span>  
                
              </p>
              <p>
                Email us: support@clientlance.com, WhatsApp: 0799295587
              </p>
              <p  id="date">
                 <script> 
                  document.getElementById("date").innerHTML = ${
                    "@" + new Date().getFullYear() + " " + "Mui"
                  }
                 </script>
              </p>
            </td>
            <td></td> 
          </tr>
          <tr><td colspan="3" style="height:45px;"></td> </tr>
        </table>
      </body>
`;

  const mailOptions = {
    from: `"MUI" <${from || process.env.EMAIL_USERNAME}>`, // sender address
    to: !Array.isArray(to) && to, // comma separated string if many/or array for multiple users//all emails visible to each
    bcc: Array.isArray(to) && to, //comma separated string/ array/ to many//can't see others' emails
    subject: subject, // Subject line
    replyTo: replyTo || "", //if replyTo is set use it else '' //replyTo omitted//reply to will be sender
    html: htmlBody, // html email/body
    // attachments: [
    //   // {   filename: 'text2.txt'//optional// filename & content type will be derived from path
    //       path: '/path/to/file.txt'
    //   },{path: '/another file'}
    // ]
  };

  try {
    // verify connection configuration fist
    await transporter.verify();

    console.log("Server is ready to take our message");

    const response = await transporter.sendMail(mailOptions);

    transporter.close();

    console.log("Email sent successfully: ", response);

    return { status: "sent!" };
  } catch (error) {
    console.error("Error: ", error);//console.error logs error, same as .log
    return null;
  }
};

module.exports = sendEmail;
