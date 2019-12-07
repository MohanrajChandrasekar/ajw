'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.index = function(req, res){
    event.logsEvent(req.body,'ADD - Trans_UpdateMisroutedShipments');
    let replacements = req.body;

    Sequelize
        .query('EXEC Trans_UpdateMisroutedShipments :id, :customerName, :custAddress, :custCity, :custState, :custCountry, :zipcode, :pcsWtKgs, :docType, :magazineName, :issueNo, :shipperID, :noOfPcs, :updatedBy',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(JSON.stringify("Updated Successfully!"));
    }
}