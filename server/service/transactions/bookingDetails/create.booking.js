'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.booking = function (req, res) {
    event.logsEvent(req.body, 'ADD - Trans_InsertBookingInfo');
    let replacements = req.body;

    Sequelize
        .query('EXEC Trans_InsertBookingInfo :custType, :consigneeCode, :refMF, :mfDate, :mfTime, :bookingType, :cartonWT, :customerId, :secRunno, :secMawbno, :secHAWB, :secDeliveryCat, :secLandedWtKGs, :domesticRef, :isSpecialCustomer, :createdBranchId, :createdBy',
            { replacements: replacements, type: Sequelize.QueryTypes.SELECT })
        .then(queryReturn);

    function queryReturn(recs) {
        let result = { id: recs[0][''] };
        console.log(result);
        res.send(result);
    }
}

exports.consignment = function (req, res) {
    event.logsEvent(req.body, 'ADD - Trans_InsertBookingDetails');
    let replacements = req.body;
    console.log(replacements);
    Sequelize
        .query('EXEC Trans_InsertBookingDetails :bookingID, :cnNO, :refNo, :boxPcsId, :pcsWt, :pincodeId, :modeId, :docType, :consignorID, :magazineId, :invoiceNo, :issueNo, :estimatedAmount, :noOfPcs, :pcsWtKgs, :toPay, :postalCode, :ifPostal, :branchId, :shipperID, :coloaderID, :createdBranchId, :cityId, :consigneeName, :consigneeAddress, :consigneeCity, :bookPostalRate, :postalRateValue, :createdBy, :isSpecialConsignment, :length, :breadth, :width, :weight, :cashCustomer',
            { replacements: replacements, type: Sequelize.QueryTypes.SELECT })
        .then(result => {
            if (result[0].id == -1) {
                let records = { status: 200, data: result, message: 'Already Exist!' };
                res.send(JSON.stringify(records));
            } else {
                let records = { status: 200, data: result, message: 'Saved Successfully!' };
                res.send(JSON.stringify(records));
            }
        })
        .catch(err => {
            console.log(err);
            let records = { status: 500, data: err, message: 'Error Saving!' };
            res.send(JSON.stringify(records));
        });
}
