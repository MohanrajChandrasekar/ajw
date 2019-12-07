'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.index = function(req, res){
    event.logsEvent(req.body,'ADD - Trans_InsertJobPlannerBox');
    let replacements = req.body;

    Sequelize
        .query('EXEC Trans_InsertJobPlannerBox :boxID, :boxPieces, :pcsWT, :status',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send("Added Successfully!");
    }
}
