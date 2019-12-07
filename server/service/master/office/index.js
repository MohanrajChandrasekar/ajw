 
'use strict';
var express = require('express');
var router = express.Router();

var read = require('./office.read');
var create = require('./office.create');
var update = require('./office.update');
var edit = require('./office.delete');

router.get('/', read.index);
router.get('/:id', read.indexById);
router.get('/types/:type', read.officeListByType);

router.post('/Insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);
router.post('/type', read.types);

module.exports = router;