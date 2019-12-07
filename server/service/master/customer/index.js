'use strict';
var express = require('express');
var router = express.Router();

var read = require('./customer.read');
var create = require('./customer.create');
var update = require('./customer.update');
var remove = require('./customer.delete');

router.get('/', read.index);
router.get('/list/:type', read.listByType);
router.get('/:id',read.indexById);

router.post('/create',create.index);
router.post('/update',update.index);
router.post('/remove',remove.index);
router.post('/types', read.types);

module.exports = router;