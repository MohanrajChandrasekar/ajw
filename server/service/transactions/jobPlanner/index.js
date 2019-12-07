'use strict';
var express = require('express');
var router = express.Router();

var read = require('./planner.read');
var create = require('./planner.create');

router.get('/:secRunNo',read.index);
router.get('/runlist/:secRunNo',read.unUsedRunList);
router.get('/landedWts/:secHawnNo', read.getLandedWtByHAWN);
router.get('/allboxPcs/:secHawnNo', read.getBoxPcsByHAWN);

router.post('/insert', create.index);

module.exports = router;