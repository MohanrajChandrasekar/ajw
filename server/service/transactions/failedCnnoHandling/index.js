'use strict'
var express = require('express');
var router = express.Router();

var read = require('./handling.read');
var update = require('./handling.update');

router.post('/', read.index);

router.post('/update',update.address);
router.post('/rebooking',update.rebooking);
router.post('/getRebookingList',read.getRebooking);
router.post('/addRebooking', update.addRebooking);
router.post('/getVendorRate', read.getVendorRate);
router.get('/getCNNOResendStatus/:cnNO', read.getConsignmentResendStatus);

module.exports = router;