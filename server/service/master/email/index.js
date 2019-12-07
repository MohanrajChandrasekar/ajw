 
'use strict';
var express = require('express');
var router = express.Router();

var read = require('./email.read');
var create = require('./email.create');
var update = require('./email.update');
var edit = require('./email.delete');



router.get('/', read.index);
router.get('/:id', read.indexById);

router.post('/insert', create.index);
router.post('/delete',edit.index);
router.post('/update', update.index);



module.exports = router;