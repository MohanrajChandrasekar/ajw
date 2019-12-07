'use strict';

var Sequelize = require('../../../config/sequelize').getConnection(); 

exports.index = function (req, res) {
    console.log(req.body);

   var replacements =  req.body;

    Sequelize      
        .query('EXEC Master_InsertColoaderRateDetail :coloaderID, :modeID, :originID, :destinationID, :ratePerKG, :createdBy',
        { replacements: replacements})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(JSON.stringify("Saved Successfully!"));
    }; 
};