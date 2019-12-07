'use strict'
var express = require('express');
var router = express.Router();

var read = require('./read.expense');
var create = require('./create.expense');
var update = require('./edit.expense');
var edit = require('./delete.expense');

router.get('/', read.index);
router.get('/:id', read.indexById);
router.get('/check/:id', read.check);
router.get('/manifestWeight/:mawbNo', read.manifestWeightByMAWB);
router.get('/expenseBillReport/:mawbNo', read.expenseBillReportByMAWB);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);
router.post('/vendorwise', update.vendorwise);
router.post('/coloaderwise', update.coloaderwise);


module.exports = router;