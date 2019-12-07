'use strict'
var express = require('express');
var router = express.Router();

var read = require('./branch.read');
var create = require('./branch.create');
var update = require('./branch.update');
var edit = require('./branch.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;