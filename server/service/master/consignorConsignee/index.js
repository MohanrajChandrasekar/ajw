'use strict'

var express = require('express');
var router = express.Router();

var read = require('./consignorConsignee.read');
var create = require('./consignorConsignee.create');

router.get('/consignor', read.indexConsignor);
router.get('/consignee', read.index);
router.get('/consignee/:magazine', read.indexConsignee);
router.get('/:id', read.indexById);

router.post('/getConsignee', read.getConsignee);
router.post('/consignee', read.indexConsignee);
router.post('/insert', create.index);
router.post('/getConsignor', read.consignorByMagazineDoc);

module.exports = router;