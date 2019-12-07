'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var eventLogger = require('../eventLogger');

exports.index = (req, res) => {
    eventLogger.logsEvent(req.body, 'DELETE - Trans_DeleteSpecialBookedDetailByDetailID');
    
    var replacements = req.body;
    Sequelize
        .query('EXEC Trans_DeleteSpecialBookedDetailByDetailID :id', 
        {replacements: replacements, type: Sequelize.QueryTypes.SELECT}).then( result => {
            let records = {status:200, data:result, message:'Deleted Successfully!'};
            res.send(JSON.stringify(records));
        }).catch( err => {
            let records = {status:500, data:err, message:'Error Saving!'};
            res.send(JSON.stringify(records));
        });
}

exports.bookingInfo = (req, res) => {
    eventLogger.logsEvent(req.body, 'DELETE - Trans_DeleteSpclBookingInfo');
    
    var replacements = req.body;
    Sequelize
        .query('EXEC Trans_DeleteSpclBookingInfo :id', 
        {replacements: replacements, type: Sequelize.QueryTypes.SELECT}).then( result => {
            let records = {status:200, data:result, message:'Deleted Successfully!'};
            res.send(JSON.stringify(records));
        }).catch( err => {
            let records = {status:500, data:err, message:'Error Saving!'};
            res.send(JSON.stringify(records));
        });
}

