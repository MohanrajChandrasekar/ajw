 
'use strict';
var express = require('express');
var router = express.Router();

var read = require('./currency.read');
var create = require('./currency.create');
var update = require('./currency.update');
var edit = require('./currency.delete');



router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);



module.exports = router;