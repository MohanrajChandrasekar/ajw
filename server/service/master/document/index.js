'use strict'

var express = require('express');
var router = express.Router();

var read = require('./document.read');
var create = require('./document.insert');
var update = require('./document.update');
var edit = require('./document.delete');

// var read = ()

router.get('/document', read.indexDocument);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete', edit.index);
router.post('/update', update.index);

module.exports = router;