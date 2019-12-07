'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

var moment = require('moment');

exports.index = function (req, res) {
    var replacements1 = {
        consigneeId: req.body.consigneeName,
        consignorId: req.body.consignorName,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        branchId: req.body.branchId,
        isHO: req.body.isHO
    };

    var p = new Promise((resolve, reject) => {
        Sequelize.query('EXEC GetFailedConsignmentHandling :branchId, :isHO', { replacements: replacements1 })
            .then(result => {
                return resolve(result);
            })
            .catch(err => {
                return reject(err);
            });
    });

    p.then(rec => {
        res.send(rec[0]);
    });

};

exports.getRebooking = (req, res) => {

    var replacements = req.body;

    var p = new Promise((resolve, reject) => {
        Sequelize.query('EXEC Trans_ReBookingConsignment :branchId, :isHO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT}).then(result => {
            console.log(result);
            return resolve(result);
        })
        .catch(err => {
            return reject(err);
        });
    });

    p.then(rec => {
        res.send(rec);
    });

}

exports.getVendorRate = function (req, res) {
    console.log(req.body);
    var replacements1 = req.body;
    var p = new Promise((resolve, reject) => {
        Sequelize.query('EXEC Trans_getRTOByVendorAndWeight :vendorName, :wt',{replacements: replacements1, type: Sequelize.QueryTypes.SELECT}).then(result => {
            return resolve(result);
        }).catch(err => {    
            return reject(err);
        });
    });

    p.then(rec => {
        res.send(rec[0]);
    });
};

exports.getConsignmentResendStatus = function (req, res) {
    console.log(req.params);
    var replacements = req.params;
    console.log(replacements);
    var p = new Promise((resolve, reject) => {
        Sequelize.query('EXEC Trans_isFailedConsignmentResended :cnNO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT}).then(result => {
            return resolve(result);
        }).catch(err => {    
            return reject(err);
        });
    });

    p.then(rec => {
        res.send(rec[0]);
    });
};