'use strict'

var express = require('express');
var router = express.Router();

var read = require('./magazine.read');
var create = require('./magazine.insert');
var update = require('./magazine.update');
var edit = require('./magazine.delete');

// var read = ()

router.get('/magazine', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete', edit.index);
router.post('/update', update.index);

module.exports = router;