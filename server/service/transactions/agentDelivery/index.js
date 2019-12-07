'use strict';
var express = require('express');
var router = express.Router();

var read = require('./read.agent');
var edit = require('./update.agent');
var delet = require('./delete.agent');

router.get('/booked', read.bookedDetails);
router.get('/bookedbyID/:id', read.bookedDetailsByID);
router.get('/bycnno/:cnNO', read.bookedDetailsBycnNO1);
router.post('/BYCNNO', read.bookedDetailsByCNNO);
// router.get('/agentDlvr/:branchId', read.agentDelvDetails);
router.post('/agentDlvr', read.agentDelvDetails);
router.get('/detailsByMfId/:mfId', read.bookedDetailsByMfID);
router.get('/agentDevilerListByMfID/:mfId', read.getBookedAgentListByMfID);
router.get('/podList',read.getPODList);
router.get('/getPODbyCNNO/:CNNO',read.getPODbyCNNO);
router.get('/agentDeliverablesBranch/:branchId', read.getAgentDeliverablesBranch);
router.get('/listOfPods', read.getListOfPODs);


router.post('/deleteByMfId', delet.updateDeleteAgntDlvr);
router.post('/update', edit.updateAgentDelivery);
router.post('/byDateRange', read.getBookedAgentListByMfDate);
router.post('/addPOD', edit.checkAndUpdatePOD);
router.post('/vendorsList', read.getVendorsList);
router.post('/outPackageMFList', read.getOutMFList);
router.post('/getInscanData', read.getInscanConsigments);
router.post('/updateInscanned', edit.updateScannedByCNNO);
router.post('/scannedCNNOs', read.getInscannedCNNOs);
router.post('/scannableConsignmentsByBranch', read.getInscannableConsignsByBranchID);
router.post('/delierableConsignmentsByBranch', read.getDeliverableConsignments);
router.post('/getDelvMFID', read.getAgentDeliveryMFID);
router.post('/getVendorsForDeliverables', read.getVendorsForDeliverables);
router.post('/getConsignmentsForDelivery', read.getConsginmentListForDeliveryByBranchID);
router.post('/getChangedVendorConsignments', read.getVendorChangedConsignments);
router.post('/changeVendorBeforeDelivery', edit.changeVendorBeforeDelivery);
router.post('/getVendorDistributedList', read.getBranchedVendorDistributions);
router.post('/getDistributedDetailsByVendor', read.getVendorDistributedDetails);
router.post('/getPODsDetailedList', read.getPODsDetailedData);
router.post('/isGoForDelivery', read.isGoForDelivery);
router.post('/getPODHistory', read.podHistoryByID);
router.post('/getListOfNotUpdatedPODs',read.getSinglePODsList);

module.exports = router;