'use strict'
var eventLogger = require('../eventLogger');
var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = (req, res) =>{
    eventLogger.logsEvent(req.body, 'INSERT - Trans_InsertSpecialBooking');
    let replacements1 = req.body;
        
    Sequelize
        .query('EXEC Trans_InsertSpecialBooking :custType, :consigneeCode, :refMF, :mfDate, :mfTime, :bookingType, :cartonWT, :customerId, :secRunno, :secMawbno, :secHAWB, :secDeliveryCat, :secLandedWtKGs, :domesticRef, :isSpecialCustomer, :specialBookingMF, :createdBranchId',
        {replacements: replacements1,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result, message:'Saved Successfully!'};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            console.log(err);
            let records = {status:500, data:err, message:'Error Saving!'};
            res.send(JSON.stringify(records));
        });
}

exports.detailed = (req, res) => {
    eventLogger.logsEvent(req.body, 'INSERT - Trans_InsertSpecialBookingDetails');
    let replacements1 = req.body;
        console.log(req.body);
    Sequelize
        .query('EXEC Trans_InsertSpecialBookingDetails :bookingID, :bookingDetailID, :cnNO, :refNo, :boxPcsId, :pcsWt, :pincodeId, :modeId, :docType, :consigneeID, :consignorID, :magazineId, :invoiceNo, :issueNo, :estimatedAmount, :noOfPcs, :pcsWtKgs, :toPay, :postalCode, :ifPostal,:cityId',
        {replacements: replacements1,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result, message:'Saved Successfully!'};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            console.log(err);
            let records = {status:500, data:err, message:'Error Saving!'};
            res.send(JSON.stringify(records));
        });
}