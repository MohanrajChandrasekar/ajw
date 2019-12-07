 
'use strict';
var express = require('express');
var router = express.Router();

var read = require('./state.read');
var create = require('./state.create');
var update = require('./state.update');
var edit = require('./state.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;