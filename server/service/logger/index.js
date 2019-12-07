'use strict'
var express = require('express');
var router = express.Router();

var write = require('./logger.write');

router.post('/write', write.index);
router.post('/logout', write.logOutLogger);

module.exports = router;