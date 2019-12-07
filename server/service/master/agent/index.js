'use strict'
var express = require('express');
var router = express.Router();

var read = require('./agent.read');
var create = require('./agent.create');
var update = require('./agent.update');
var edit = require('./agent.delete');

// var read = ()

router.get('/', read.index);
router.get('/:id', read.indexById);
router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;