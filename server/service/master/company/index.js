'use strict'
var express = require('express');
var router = express.Router();

var read = require('./company.read');
var create = require('./company.create');
var update = require('./company.update');
var edit = require('./company.delete');

// var read = ()

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;