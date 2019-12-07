'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.index = async function (req, res) {
    console.log(req.body);
    var replacements = req.body;
    event.logsEvent(req.body,'Update - UpdateExpenseBill');

    try{
        var response = await Sequelize.query('EXEC UpdateExpenseBill :id, :mawbNo, :customsDA, :ifChargesAO, :mfWeight, :chargesAAI, :chargesAO, :customsDuty, :commisionDD, :chargesUnitechCHA, :paletesReceived, :chargesPacking, :noOfPaletes, :chargesDelivery, :chargesService, :chargesAddedService, :chargesOthers, :chargesOthers1236, :chargesFreight, :chargesTotal, :currency, :updatedBy',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        console.log(response);
        var returnRes = { status: 200, response };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }

};


exports.vendorwise = function (req, res) {
    var replacements1 = req.body;
    console.log(req.body);

    var p = new Promise((resolve, reject) => {
        Sequelize.query('EXEC Report_GetVendorWise :secMawbno,:secRunno',
            { replacements: replacements1 })
            .then(result => {
                return resolve(result);
            })
            .catch(err => {
                return reject(err);
            });
    })
    p.then(recs => {
        console.log(recs[0]);
        res.send(recs[0]);
    });
};


exports.coloaderwise = function (req, res) {
    var replacements1 = req.body;
    console.log(req.body);

    var p = new Promise((resolve, reject) => {
        Sequelize.query('EXEC Report_GetColoaderWise :secMawbno,:secRunno',
            { replacements: replacements1 })
            .then(result => {
                return resolve(result);
            })
            .catch(err => {
                return reject(err);
            });
    })
    p.then(recs => {
        console.log(recs[0]);
        res.send(recs[0]);
    });
};