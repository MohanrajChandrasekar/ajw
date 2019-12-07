'use strict';
var express = require('express');
var router = express.Router();

var svrRead = require('./email.send.service');
 
router.post('/sendEmail', svrRead.sendMail); 

module.exports = router;