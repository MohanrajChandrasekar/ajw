"use strict";

var promise = require("bluebird");
var mongoose = promise.promisifyAll(require("mongoose"));

var config = require('../config/environment');

mongoose.connect(config.mongoDB.url, config.mongoDB.options);

var commonField = {
    remarks: String,
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now },
    createdBy: String,
    updatedBy: String,
    updatedDate: Date
};
exports.mongoose = mongoose;
exports.commonField = commonField;

// To Store the mongodb schema history
var mongoose2 = require('mongoose'),
    mongooseHistory = require('mongoose-history');

var historyDBCon = mongoose2.createConnection(config.mongoDB.auditURL);
var historyOptions = { historyConnection: historyDBCon };

exports.mongooseHistory = mongooseHistory;
exports.historyOptions = historyOptions;

//File storage configuration
var mongo = require('mongodb');
var Grid = require('gridfs-stream');

var db = new mongo.Db(config.mongoDB.file.dbName, new mongo.Server(config.mongoDB.file.host, config.mongoDB.file.port));


exports.fileDB = db;
