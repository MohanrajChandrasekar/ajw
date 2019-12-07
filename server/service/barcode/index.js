'use strict'
var express = require('express');
var router = express.Router();

var read = require('./barcode.read');

router.get('/:cnNO', read.index);

// var Barc = require('barcode-generator'),barc = new Barc(),fs = require('fs');

// var buf = barc.code128('1234', 300, 200);
// fs.writeFile(__dirname + '/example.png', buf, function(){
//     console.log('wrote it');
// });
// exports.Graphics = Graphics;

module.exports = router;
