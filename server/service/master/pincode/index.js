'use strict'
var express = require('express');
var router = express.Router();

var read = require('./pincode.read');
var create = require('./pincode.create');
var update = require('./pincode.update');
var edit = require('./pincode.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete', edit.index);
router.post('/update', update.index);
router.post('/pinList', read.pinList);
router.post('/byCity', read.pincodeListByCity);

module.exports = router;