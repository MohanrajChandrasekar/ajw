'use strict';
var express = require('express');
var router = express.Router();

var read = require('./read.misroute');
var create = require('./create.misroute');
var update = require('./update.misroute');
let edit = require('./delete.misroute');

router.post('/insert', create.index);
router.post('/edit', update.index);
router.post('/delete', edit.index);
router.post('/report', read.reportByMAWB);

router.get('/', read.index);
router.get('/:id', read.indexByID)

module.exports = router;