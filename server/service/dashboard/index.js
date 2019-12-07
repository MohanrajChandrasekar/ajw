'use strict';
var express = require('express');
var router = express.Router();
var read = require('./dashboard.read');

router.post('/datewise', read.indexDatewise);
router.post('/branchwise',read.indexBranchwise);
router.post('/bydate',read.indexDate);
router.post('/mawb',read.mawb);

router.post('/openingClosingReport',read.openingClosingReport);

module.exports = router; 
