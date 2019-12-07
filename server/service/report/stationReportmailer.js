var transporter = require('../../config/nodemailer').emailer;

exports.sendEmailReport = (req, res) =>{
var replacements = req;
URL = "www.ajwex.com";
var resetFlag = false;
if(replacements.reset){
  resetFlag = replacements.reset;
}
var messageBody = '';
messageBody = "<html><body>";
messageBody = messageBody + "<p>";
messageBody = messageBody + "<b>STATION ARRIVAL BREAKUP REPORT</b>";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
messageBody = messageBody + "Hi,";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<span>You will find the invoice attachment below.</span>";
messageBody = messageBody + "<br />";
messageBody = messageBody + "<br />";
messageBody = messageBody + "Regards, ";
messageBody = messageBody + "<br />";
messageBody = messageBody + "AJW Operations";
messageBody = messageBody + "<br />";
messageBody = messageBody + "</p>";
messageBody = messageBody + "</body></html>";

 var mailOptions = {
        to: 'mohanraj@cutechgroup.com',
        subject: 'STATION ARRIVAL REPORT',
        body: messageBody,
        html: messageBody,
        bcc: '',
        frmId: 'ajw.autoemailer@gmail.com',
        attachments: [{
            filename: 'STATION ARRIVAL',     
            path: ml.filePath,                        
            contentType: 'application/pdf'
      }]

    }
    
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}