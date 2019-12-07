var transporter = require('../../config/nodemailer').emailer;

exports.sendEmail = (req, res) =>{
var replacements = req;
URL = "www.ajwex.com";
var resetFlag = false;
if(replacements.reset){
  resetFlag = replacements.reset;
}
var messageBody = '';
messageBody = "<html><body>";
messageBody = messageBody + "<p>";
messageBody = messageBody + "<b>PRIVATE & CONFIDENTIAL</b>";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
messageBody = messageBody + "Dear " + replacements.userName; 
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<span>Please be informed that your <b>AJW Address Finder</b> username and password has been generated. You may login using below LoginId and Password.</span>";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
if(resetFlag){
  messageBody = messageBody + "Your password reset successfully.";  
  messageBody = messageBody + "<br />";
  messageBody = messageBody + "<br />";
}
messageBody = messageBody + "LoginId   : <b>" + replacements.loginId + "</b>";
messageBody = messageBody + "<br />";
messageBody = messageBody + "Password  : <b>" + replacements.pwd + "</b>";
messageBody = messageBody + "<br />";
messageBody = messageBody + " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Password are case sensitive)";
messageBody = messageBody + "<br />";
messageBody = messageBody + "URL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <a href=" + URL + ">" + URL + "</a>";
messageBody = messageBody + "<br />";
messageBody = messageBody + "==================================================================================================================";
messageBody = messageBody + "<br />";
messageBody = messageBody + "Notes:";
messageBody = messageBody + "<br />";
messageBody = messageBody + "1.	You must keep your password confidential and that you do not grant permission to any person to use your User ID and password.";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
messageBody = messageBody + "2. The assigned password can only be used ONCE. Please change your password upon receipt of this email. The ID will be locked if you do not change your password within 14 days.";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
messageBody = messageBody + "3.	Your password must have the following characteristics:";
messageBody = messageBody + "<br />";
messageBody = messageBody + "&nbsp;&nbsp;&nbsp;a. At least Eight characters";
messageBody = messageBody + "<br />";
messageBody = messageBody + "&nbsp;&nbsp;&nbsp;b. Must satisfy the following criteria:";
messageBody = messageBody + "<br />";
messageBody = messageBody + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- at least One Uppercase char (A to Z)";
messageBody = messageBody + "<br />";
messageBody = messageBody + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- at least One Lowercase char (a to z)";
messageBody = messageBody + "<br />";
messageBody = messageBody + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- at least One Number (0 to 9)";
messageBody = messageBody + "<br />";
messageBody = messageBody + "4.	Ensure your terminal is not left unattended after you have signed on to the system.";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
messageBody = messageBody + "5. If you encounter any problem, please do not hesitate to contact Helpdesk.";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
messageBody = messageBody + "Regards, ";
messageBody = messageBody + "<br />";
messageBody = messageBody + "Security Administrator,";
messageBody = messageBody + "<br />";
messageBody = messageBody + "IT Security Operations,";
messageBody = messageBody + "<br />";
messageBody = messageBody + "Cutech Logistics Solutions Pvt Ltd,";
messageBody = messageBody + "<br />";
messageBody = messageBody + "Phone: 044 4302 3170";
messageBody = messageBody + "</p>";
messageBody = messageBody + "</body></html>";

 var mailOptions = {
        to: replacements.userEmail,
        subject: 'User Registration',
        body: messageBody,
        html: messageBody,
        bcc: '',
        frmId: 'ajw.autoemailer@gmail.com'
    }
    if(resetFlag){
      mailOptions.subject = "Password Reset";
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}