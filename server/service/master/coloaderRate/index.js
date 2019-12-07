 
'use strict';
var express = require('express');
var router = express.Router();

var read = require('./cRate.read');
var create = require('./cRate.create');
var update = require('./cRate.update');
var edit = require('./cRate.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);
router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);
router.post('/rateByBranche', read.getRateByBranches);
router.post('/coloaders', read.coloaderForOutscan);

module.exports = router;