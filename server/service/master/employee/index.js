 
'use strict';
var express = require('express');
var router = express.Router();

var read = require('./emp.read');
var create = require('./emp.create');
var update = require('./emp.update');
var edit = require('./emp.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);
router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;