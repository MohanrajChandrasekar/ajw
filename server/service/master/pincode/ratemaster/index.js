'use strict'
var express = require('express');
var router = express.Router();

var read = require('./ratemaster.read');
var create = require('./ratemaster.create');
var update = require('./ratemaster.update');
var edit = require('./ratemaster.delete');

router.get('/', read.index);
router.get('/postal/code', read.rateMaster);
router.get('/:id', read.indexById);
router.get('/byRateType/:rateType', read.getByRateTypes);
router.get('/BDRatesPostal/:postalType', read.getBD_PostalsRates);
// router.get('/pinRate/:pincode', read.rateByPincode);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);
router.post('/pinRate', read.rateByPincode);
router.post('/getpostalRates', read.getVendorChargeWithArgs);

module.exports = router;