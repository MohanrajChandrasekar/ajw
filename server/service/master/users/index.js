'use strict';
var express = require('express');
var router = express.Router();

var read = require('./user.read');
var create = require('./user.create');
var update = require('./user.update');
var edit = require('./user.delete');
var updateLock = require('./updateUserLock');
var resetPassword=require('./resetPassword');
var loginHistory = require('./loginHistory');

var userAtuh = require('./auth');
var updatePassword = require('./changepassword');

router.post('/login', userAtuh.validUser);
router.post('/updatepassword', updatePassword.index);
router.post('/loginHistory',loginHistory.create);

router.get('/', read.index);
router.get('/:id', read.indexById);
router.get('/byLoginId/:LoginId',read.indexByLoginId)

router.post('/insert', create.index);
router.post('/delete', edit.index);
router.post('/update', update.index);
router.post('/updateLock', updateLock.index);
router.post('/resetPassword',resetPassword.index);

module.exports = router;