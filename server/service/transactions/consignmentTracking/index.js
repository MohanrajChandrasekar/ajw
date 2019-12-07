'use strict';
var express = require('express');
var router = express.Router();

var read = require('./read.tracking');

router.get('/:cnNO', read.tracking);
router.post('/getTrackedList', read.trackByPosibility);
router.post('/getUserProduction', read.trackProdcutionByUser);
router.post('/getColoaderReport', read.coloaderReport);
router.post('/getPostalTariff', read.postalTariff);
router.post('/getColoaderByID', read.coloaderBreakupByColoaderID);

module.exports = router;