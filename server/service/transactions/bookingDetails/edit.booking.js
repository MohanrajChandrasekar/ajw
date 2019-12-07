'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.updateBooking = function(req, res){
    event.logsEvent(req.body,'UPDATE - Trans_UpdateBookingInfo');

    let replacements = req.body;
    replacements.mfDate = null;
    replacements.mfTime = null;
    
    Sequelize
        .query('EXEC Trans_UpdateBookingInfo :id, :custType, :consigneeCode, :refMF, :mfDate, :mfTime, :bookingType, :cartonWT, :customerId, :secRunno, :secMawbno, :secHAWB, :secDeliveryCat, :secLandedWtKGs, :domesticRef, :updatedBy',
            {replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){ 
        console.log(recs);
        res.send(recs);
    }
}

exports.updateBookingDetail = async function(req, res){
    event.logsEvent(req.body,'UPDATE - Trans_UpdateBookingDetails');
    let replacements = req.body;
    console.log(replacements);
    try {
        const result = await Sequelize.query('EXEC Trans_UpdateBookingDetails :id, :bookingID, :cnNO, :refNo, :boxPcsId, :pcsWt, :pincodeId, :modeId, :docType, :consignorID, :magazineId, :invoiceNo, :issueNo, :estimatedAmount, :noOfPcs, :pcsWtKgs, :toPay, :postalCode, :postalRateValue, :ifPostal, :branchId, :shipperID, :coloaderID, :cityId, :consigneeName, :consigneeAddress, :consigneeCity, :bookPostalRate, :updatedBy, :length, :breadth, :width, :weight, :cashCustomer',{replacements: replacements,type: Sequelize.QueryTypes.SELECT});
        let records = {status:200, data:result, message:'Updated Successfully!'};
        res.send(JSON.stringify(records));
    } catch(err) {
        let records = {status:500, data:err, message:'Error Saving!'};
        res.send(JSON.stringify(records));
    }    
}