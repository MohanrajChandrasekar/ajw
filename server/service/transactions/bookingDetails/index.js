'use strict';
var express = require('express');
var router = express.Router();

var read = require('./read.booking');
var create = require('./create.booking');
var update = require('./delete.booking');
let edit = require('./edit.booking');

// router.get('/booked/:branchId', read.bookedDetails);
router.post('/booked', read.bookedDetails);
router.get('/:id', read.bookingByID);
router.get('/details/:id', read.bookingDetailsByID);
router.get('/detailsForReport/:id', read.bookingDetailsByIDForReport);
router.get('/bydetail/:id', read.bookingDetailsByDetailID);
router.get('/peices/:secHawnNo', read.getPcsListByHawnNo);
router.get('/specialPcsList/:secHawnNo', read.getPcsListSpclBookingByHawnNo);
router.get('/pcsExist/:id', read.getPcsExistCount);
router.get('/validation/:id', read.getPcsValidations);
router.get('/isCNNO/:cnNo', read.isCnNO);
router.get('/isDeliveryFailedCNNO/:cnNo', read.isDeliveryFailedCNNO);
router.get('/consignee/:pincodeId', read.getConsigneeByPin);

router.post('/insertbooking', create.booking);
router.post('/checkCNNO', read.checkCNNO);
router.get('/loginId/:loginId', read.loginId);
router.post('/insertdetails', create.consignment);
router.post('/delete', update.deleteByID);
router.post('/deleteDetails', update.deleteDetailsByID);
router.post('/updatebooking', edit.updateBooking);
router.post('/updatedetails', edit.updateBookingDetail);
router.post('/detailByDate', read.getDetailsByDate);
router.post('/getSpecialConsignees', read.getSpecialConsignees);

module.exports = router;