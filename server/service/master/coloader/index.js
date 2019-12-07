 
'use strict';
var express = require('express');
var router = express.Router();

var read = require('./coloader.read');
var create = require('./coloader.create');
var update = require('./coloader.update');
var edit = require('./coloader.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);
router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);
router.get('/getRate/:id', read.getRateByID);

module.exports = router;