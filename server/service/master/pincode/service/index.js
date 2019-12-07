'use strict'
var express = require('express');
var router = express.Router();

var read = require('./service.read');
var create = require('./service.create');
var update = require('./service.update');
var edit = require('./service.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);
router.get('/pincodes/:ajwCity', read.getPincodesByCityCode);
router.get('/city/:pincode', read.getCityByPincode);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);

module.exports = router;