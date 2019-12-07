'use strict'
var express = require('express');
var router = express.Router();

var read = require('./navigationList.read');


router.get('/', read.index);
router.get('/:LoginId', read.indexById);

module.exports = router;