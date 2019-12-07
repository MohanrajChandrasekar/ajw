'use strict'
var express = require('express');
var router = express.Router();

var read = require('./mode.read');
var create = require('./mode.create');
var update = require('./mode.update');
var edit = require('./mode.delete');

// var read = ()

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;