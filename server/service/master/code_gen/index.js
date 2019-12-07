'use strict';
var express = require('express');
var router = express.Router();

var read = require('./code_gen.read');
var create = require('./code_gen.create');
var update = require('./code_gen.update');
var edit = require('./code_gen.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/lastNumber', update.lastNumber);
router.post('/Insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);
router.post('/checkstart', read.checkstart);

module.exports = router;