'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.index = function(req, res){
    event.logsEvent(req.body,'ADD - Trans_InsertMisroutedShipments');
    let replacements = req.body;

    Sequelize
        .query('EXEC Trans_InsertMisroutedShipments :customerName, :custAddress, :custCity, :custState, :custCountry, :zipcode, :pcsWtKgs, :docType, :magazineName, :issueNo, :shipperID, :noOfPcs, :createdBy, :bookingMF, :runNumber, :HAWBNo, :MAWBNo',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){ 
        if(recs[0].id == -1 ){
            var returnVal = { statusBool: 2, statusText: 'Error Saving!'};
            res.send(returnVal);
        }else{
            var returnVal = { statusBool: 1, statusText: 'Saved Successfully!'};
            res.send(returnVal);            
        }        
    }
}
