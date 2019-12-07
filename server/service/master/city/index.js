'use strict';
var express = require('express');
var router = express.Router();

var read = require('./city.read');
var create = require('./city.create');
var update = require('./city.update');
var edit = require('./city.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/Insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;