 
'use strict';
var express = require('express');
var router = express.Router();

var read = require('./shipper.read');
//var update = require('./office.update');
var create = require('./shipper.create');
var update = require('./shipper.update');
var edit = require('./shipper.delete');



router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);



module.exports = router;