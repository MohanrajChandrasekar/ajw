'use strict';
var express = require('express');
var router = express.Router();

var create = require('./specialConsignee.create');
var read = require('./specialConsignee.read');
var update = require('./specialConsignee.update');
var delet = require('./specialConsignee.delete');


router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/Insert', create.index);
router.post('/update', update.index);
router.post('/delete', delet.index);

module.exports = router;
