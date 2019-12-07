'use strict';

var Sequelize = require('../../../config/sequelize').getConnection(); 

exports.index = function (req, res) {
    console.log(req.body);

   var replacements1 =  req.body;

    Sequelize
        .query('EXEC Master_DeleteColoaderRateDetail :id',
        { replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(JSON.stringify("Deleted Successfully!"));
    }; 
};