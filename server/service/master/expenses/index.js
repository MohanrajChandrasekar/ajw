'use strict'
var express = require('express');
var router = express.Router();

var read = require('./expenses.read');
var create = require('./expenses.create');
var update = require('./expenses.update');
var edit = require('./expenses.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;