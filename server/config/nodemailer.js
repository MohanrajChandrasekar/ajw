var config = require('../config/environment');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: 'ajw.autoemailer@gmail.com',
      pass: 'ajw@1234'
    },
    tls: {
      rejectUnauthorized: false
    }
});

exports.emailer = transporter;   