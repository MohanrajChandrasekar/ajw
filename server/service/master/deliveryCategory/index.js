 
'use strict';
var express = require('express');
var router = express.Router();

var read = require('./deliveryCategory.read');
var create = require('./deliveryCategory.create');
var update = require('./deliveryCategory.update');
var edit = require('./deliveryCategory.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);
router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;