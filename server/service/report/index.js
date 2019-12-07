'use strict';

var express = require('express');
var router = express.Router();

var mawbNo = require('./mawbNo.create');
var outgoing = require('./outgoing.create');
var detailedBooking = require('./detailedBooking.create');
var specialCustomerDetailedBooking = require('./specialCustomerDetailedBooking.create');
var agent = require('./agent.create');
var tracking = require('./tracking.create');
var MawNoGroupedReport = require('./MawNoGroupedReport.create');
var vendorwise = require('./vendorwise.create');
var coloaderwise = require('./coloaderwise.create');
var weightBreakUp = require('./weightBreakupByHAWN.create');
var vendorBreakup = require('./vendorBreakup');
var deliveryBreakup = require('./delivery.breakup');
var stationArrival = require('./stationReport');
var stationReportMailer = require('./stationReportmailer');
var expenseReport = require('./expensebyMAWBNo');
var boxReport = require('./box.read');

router.post('/outgoing', outgoing.outgoing);
router.post('/agent', agent.agent);
router.post('/detailedBooking', detailedBooking.detailedBooking);
router.post('/tracking', tracking.tracking);
router.post('/MawNo', mawbNo.MawNo);
router.post('/MawNoGroupedReport', MawNoGroupedReport.MawNoGroupedReport);
router.post('/specialCustomerDetailedBooking', specialCustomerDetailedBooking.specialCustomerDetailedBooking);
router.post('/vendorwise', vendorwise.vendorwise);
router.post('/coloaderwise', coloaderwise.coloaderwise);
router.post('/weightBreakup', weightBreakUp.weightBreakupByHawnNo);
router.post('/vendorBreakup', vendorBreakup.index);
router.post('/deliveryBreakup', deliveryBreakup.index);
router.post('/vendorBreakupByRuns', vendorBreakup.indexBetweenRunNumbers);
router.post('/stationReportByRun', stationArrival.stationArrivalReportByRun);
router.post('/sendStationReport', stationReportMailer.sendEmailReport);
router.post('/expenseBillReport', expenseReport.expenseDetailsByMAWB);
router.post('/getBoxReport', boxReport.getBoxDetails);

module.exports = router;
