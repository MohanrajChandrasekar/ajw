'use strict'
var express = require('express');
var router = express.Router();

var read = require('./zone.read');
var create = require('./zone.create');
var update = require('./zone.update');
var edit = require('./zone.delete');

// var read = ()

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/Insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;