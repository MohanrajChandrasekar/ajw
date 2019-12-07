'use strict';
var express = require('express');
var router = express.Router();

var create = require('./create.delv');

router.post('addDelivery', create.addDelivery);

module.exports = router;