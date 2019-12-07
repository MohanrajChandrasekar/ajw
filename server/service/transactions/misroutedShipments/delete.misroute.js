'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.index = function(req, res){
    event.logsEvent(req.body,'ADD - Trans_DeleteMisroutedShipment');
    let replacements = req.body;

    Sequelize
        .query('EXEC Trans_DeleteMisroutedShipment :id, :updatedBy',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(JSON.stringify("Deleted Successfully!"));
    }
}