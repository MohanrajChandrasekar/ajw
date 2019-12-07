'use strict';
var express = require('express');
var router = express.Router();

var read = require('./read.outgoing');
var update = require('./update.outgoing');
var edit = require('./delete.outgoing');

router.get('/outgoingPacketManifestByMfId/:refOutMfID', read.outgoingByMfId);
router.get('/bycnnoForOutgoing/:cnNO', read.bookedDetailsBycnNO);
router.get('/isDuplicateOutMFID/:outMFID', read.checkDuplicateMFID);
// router.get('/outgoingList/:branchId', read.outgoingDetails);
router.post('/outgoingList', read.outgoingDetails);
router.get('/branchedOutpackages/:branchId', read.getOutPackagedByBranch);
router.get('/getpostalpackages/:branchId', read.getPostalPackages);
router.get('/genOutMFID', read.generateOutMFID);

router.post('/updateForOutgoing', update.updateOutgoingPacketManifest);
router.post('/byDateRange', read.getOutgoingListByMfDate);
router.post('/deleteOutgoing', edit.deleteOutgoing);
router.post('/OutListBranchWise', read.getListOfOutPackingByBranchID);
router.get('/outscanCheckByCNNO/:cnNO', read.checkForOutScanByCNNO);
router.post('/getInScannableOutPCK', read.outgoingDetailsForInScanning);
router.post('/getOutScannableByVendors', read.outScannableVedorWise);
router.post('/getOutPackagedReportData', read.outPackagedReportData);
router.post('/getOutPackagedDetailedReport', read.outPackagedDetailed_XLSL_Report);

module.exports = router;