/* 'use strict';
var express = require('express');
var router = express.Router();

var controller = require('./office.controller');

router.get('/byName/:officeName', controller.indexByName);
router.get('/byName/index/:officeName', controller.index);

router.post('/create', controller.create);
router.get('/getAllOptions', controller.index);
router.post('/delete', controller.delete);
router.post('/update', controller.update);



module.exports = router; */