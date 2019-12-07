'use strict';
var express = require('express');
var router = express.Router();

var read = require('./issue.read');
var create = require('./issue.create');
var update = require('./issue.update');
var edit = require('./issue.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);

router.get('/magazine/:magazine', read.magazine);

router.post('/Insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;