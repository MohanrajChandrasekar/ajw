'use strict';
var express = require('express');
var router = express.Router();

var read = require('./role.read');
var create = require('./role.create');
var update = require('./role.update');
var edit = require('./role.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;