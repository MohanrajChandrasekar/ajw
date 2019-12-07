/* 'use strict';
var svrOption = require('../../service/office');
var log = require('winston');

exports.indexByName = function (req, res) {
    
    var params = {};
    if (req.params.officeName !== undefined) {
        params.officeName = req.params.officeName;
    }
    svrOption.read.getOfficebyName(params, function (result) {
        res.json(result);
    }); 
};

// exports.index = function (req, res) {
//     var params = {};
//     if (req.params.optionName !== undefined) {
//         params.optionName = req.params.optionName;
//     }
//     svrOption.read.getRecordbyName(params, function (result) {
//         res.json(result);
//     });
// };

exports.index = function (req, res) {
    var office = {};
    svrOffice.read.getRecord(office, function (result) {
        res.json(result);
    });
};

exports.create = function (req, res) {
    svrOffice.create.createRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.json(result);
    }
};

exports.delete = function (req, res) {
    svrOffice.delete.deleteRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.send(result);
    }
};

exports.update = function (req, res) {
    svrOffice.update.updateRecord(req.body, processResult);
    function processResult(result) {
        res.status(result.statusHttp);
        res.send(result);
	}	
};



//exports.updateByName = function (req, res) {
//    var params = {};
//    if (req.params.optionName !== undefined) {
//        params.optionName = req.params.optionName;
//    }
//    svrOption.update.updateRecordbyName(params, function (result) {
//        res.json(result);
//    });
//};
 */