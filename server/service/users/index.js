'use strict';
var express = require('express');
var router = express.Router();

var read = require('./read.users');

router.post('/rolesByUser',read.isUserCanEditFailurePOD);

module.exports = router; 