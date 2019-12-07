'use strict';
var express = require('express');
var router = express.Router();

var read = require('./read.booking');
var create = require('./create.booking');
var edit = require('./update.booking');
var delet = require('./delete.booking');

router.get('/:id', read.index);
router.get('/cnno/:id', read.getCNNObyID);
router.get('/specialDetails/:id', read.getSpecialBookDetailsByID);
router.get('/hawnList/:secRunno', read.getSpecialBookHawnList);
router.get('/detailsByID/:id', read.getSpecialBookDetailsByDetailID);

router.post('/insert', create.index);
router.post('/detailInsert', create.detailed);
router.post('/edit', edit.updateBookingDetail);
router.post('/delete', delet.index);
router.post('/infoDelete', delet.bookingInfo);
router.post('/isSpecialBookedMForCNNO', read.isSpecialBookingMF_isCNNO);

module.exports = router;