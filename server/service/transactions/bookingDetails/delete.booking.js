'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.deleteByID = function(req, res){
    event.logsEvent(req.body,'DELETE - Trans_DeleteBookingInfo');

    let replacements = {
        id: req.body.id
    }
    
    Sequelize
        .query('EXEC Trans_DeleteBookingInfo :id',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.deleteDetailsByID = function(req, res){
    event.logsEvent(req.body,'DELETE - Trans_DeleteBookedDetailByID');

    let replacements = req.body;
    
    Sequelize
        .query('EXEC Trans_DeleteBookedDetailByID :id',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

