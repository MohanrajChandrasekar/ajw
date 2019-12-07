'use strict';
var emailer = require('../../config/nodemailer').emailer;
var Sequelize = require('../../config/sequelize').getConnection();

exports.sendMail = function (req, resultData) {

    var gEmailDoc = [];
    if (req.body !== undefined && req.body !== null) {
        gEmailDoc = req.body;
    } else {
        gEmailDoc = req;
    }


    parseAndSendemail(0);


    function convertEmail(emailID) {
        //if environment is not production the send email to temp mailbox - mailinator
        /*if (process.env.NODE_ENV !== 'production') {
            return (emailID.substring(0, emailID.indexOf("@") + 1)) + 'mailinator.com';
        } else {*/
        return emailID;
        /*}*/
    }


    function parseAndSendemail(i) {
        console.log(gEmailDoc[i]);
        gEmailDoc[i].to = convertEmail('' + gEmailDoc[i].to);
        gEmailDoc[i].cc = convertEmail('' + gEmailDoc[i].cc);
        gEmailDoc[i].bcc = convertEmail('' + gEmailDoc[i].bcc);

        try {
            Sequelize
                .query('EXEC GetOptionsValue :OptionCode', { replacements: { OptionCode: 'FromEmailId' } })
                .then(queryReturnOptions);
        } catch (ex) {
            console.log(ex);
        }

        function queryReturnOptions(recsOpt) {
            try {
                var mailFromRes = recsOpt[0][0];
                var mailFrom;
                if (mailFromRes === undefined || mailFromRes === null || mailFromRes.OptionValue === undefined || mailFromRes.OptionValue === null || mailFromRes.OptionValue === '') {
                    if (process.env.NODE_ENV === 'spdev' || process.env.NODE_ENV === 'spqa' || process.env.NODE_ENV === 'spprod') {
                        mailFrom = 'ajw.autoemailer@gmail.com';
                    } else {
                        mailFrom = 'ajw.autoemailer@gmail.com';
                    }
                } else {
                    mailFrom = mailFromRes.OptionValue;
                }
            } catch (ex) {
                console.log(ex);
            }

            var mailOptions = {
                from: mailFrom,//'espsection@spgroup.com.sg', // sender address
                to: gEmailDoc[i].to,
                cc: gEmailDoc[i].cc,
                bcc: gEmailDoc[i].bcc,
                subject: gEmailDoc[i].subject,
                html: gEmailDoc[i].body,
                attachments: gEmailDoc[i].attachment
            };
 

            var j = 0;
            sendEmail();

            function sendEmail() {
                if (process.env.NODE_ENV === 'development') {
                    try {
                        emailer[j].sendMail(mailOptions, emailSendResponse)
                    } catch (ex) {
                        resultData(true);
                    }
                } else {
                    resultData(true);
                }
            }

            function emailSendResponse(error, info) {
                if (error) {
                    console.log(error);
                    /*console.log("*******ERROR**********");
                    console.log(error);
                    console.log(mailOptions.to);*/
                    if ((emailer.length - 1) === j) {
                        try{
                            //logger.info('Cannot send email through all configured emails');
                            i = i + 1;
                            if (i >= gEmailDoc.length) {
                                console.log("******* :" + i);
                                resultData(false);
                                return;
                            }
                            parseAndSendemail(i);
                            return;
                        }catch(ex){
                            resultData(false);
                        }
                    }
                    //logger.info('Changing sender email');
                    j = j + 1;
                    sendEmail();
                    return;
                }
                var attachmentPaths = '';
                try{
                    mailOptions.attachments.forEach(function (row, index) {
                        attachmentPaths += row.path + ',';
                    });
                    
                }catch(ex){
                }

                Sequelize
                    .query('EXEC LogEmail_Create ' +
                        ':Remarks, :EmailFrom, :EmailTo, :CC, :BCC, :Subject, :Body, :SentDateTime, :AttachmentPath, :SentModule', {
                            replacements: {
                                Remarks: gEmailDoc[i].remarks,
                                EmailFrom: mailOptions.from,
                                EmailTo: mailOptions.to,
                                CC: mailOptions.cc,
                                BCC: mailOptions.bcc,
                                Subject: mailOptions.subject,
                                Body: mailOptions.html,
                                SentDateTime: moment().format("YYYY-MM-DDTHH:mm:ss"),
                                AttachmentPath: attachmentPaths,
                                SentModule: gEmailDoc[i].sentModule
                            }
                        })
                    .then(queryReturn);


                function queryReturn(recs) {
                    if ((gEmailDoc.length - 1) === i) {
                        resultData(true);
                        return;
                    } else {
                        i = i + 1;
                        parseAndSendemail(i);
                    }

                }
            }


        }
    }

};