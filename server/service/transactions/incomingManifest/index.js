'use strict';
var express = require('express');
var router = express.Router();

var read = require('./income.read');
var create = require('./income.create');
var update = require('./income.update');
var edit = require('./income.delete');
var box = require('./box.update');

router.get('/', read.index);
router.get('/:id',read.indexById);
router.get('/income/:id',read.incomeLoadById);
router.get('/getBoxDetails/:id', read.boxDetailsByID);
router.get('/getBoxDetailByBoxID/:id', read.BoxDetailsByBoxID);
router.get('/isRunNo/:runNo', read.getRunNo);
router.get('/isHawnNo/:hawnNo', read.isHawnNo);
router.get('/getCategoryLost/:incomeId', read.getDeliveryCategoryByIncomeID);
// router.get('/branch/:branchID', read.incomeByBranchID);
router.get('/runList/:branchID', read.getRunListByBranchID);
router.get('/deleteAllCategoryByIncomeId/:incomeId', edit.deleteAllCategoryByIncomeID);
router.get('/getDeliveryCategoryByRunNO/:runNo', read.getCategoryByRunNO);
router.get('/getStationArrivalByRun/:runNo', read.getStationArrivalReportByRun);

router.post('/secMawbno', update.secMawbno);
router.post('/secMawbnoForGroupedReport', update.secMawbnoForGroupedReport);
router.post('/branch',read.incomeByBranchID)
router.post('/insert', create.index);
router.post('/deleteMfst',edit.deleteIncoming);
router.post('/deleteMfstList',edit.deleteIncomeDetail);
router.post('/update', update.index);
router.post('/load', create.addLoadInfo);
router.post('/editRowMfst',update.byRowID);
router.post('/boxUpdate', box.boxUpdate);
router.post('/boxInsert', box.boxInsert);
router.post('/boxDelete', box.boxDelete);
// router.post('/updateByRunNo', update.updateByRunNo);
router.post('/landedPcs', update.LandedPcs);
router.post('/boxupdateAll', box.boxUpdateAll);
router.post('/reportByMAWB', update.reportDataByMAWB);
router.post('/weightReport', read.weightReportByHAWB);
router.post('/checkMAWB', read.checkHAWBNo);
router.post('/deleteByCategoryIdAndIncomeId', edit.deleteCategorybyIncomeIDAndCategoryID);

module.exports = router;