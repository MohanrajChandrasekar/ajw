'use strict';

var Sequelize = require('../../../config/sequelize').getConnection(); 

exports.index = function (req, res) {
    console.log(req.body);

   var replacements1 =  req.body;

    Sequelize
        .query('EXEC Master_UpdateColoaderRateDetail :id, :coloaderID, :modeID, :originID, :destinationID, :ratePerKG, :updatedBy',
        { replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(JSON.stringify("Updated Successfully!"));
    }; 
};