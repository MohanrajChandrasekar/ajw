'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.updateBookingDetail = function(req, res){
    event.logsEvent(req.body,'UPDATE - Trans_UpdateSpecialBookDetails');

    let replacements = req.body;
    
    Sequelize
        .query('EXEC Trans_UpdateSpecialBookDetails :id, :cnNO, :refNo, :boxPcsId, :pcsWt, :pincodeId, :modeId, :docType, :consigneeID, :consignorID, :magazineId, :invoiceNo, :issueNo, :estimatedAmount, :noOfPcs, :pcsWtKgs, :toPay, :postalCode, :ifPostal,:cityId',
        {replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result, message:'Saved Successfully!'};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            let records = {status:500, data:err, message:'Error Saving!'};
            res.send(JSON.stringify(records));
        });
}