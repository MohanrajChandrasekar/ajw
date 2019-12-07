'use strict';

var Sequelize = require('../../../config/sequelize').getConnection(); 

exports.index = function (req, res) {
    console.log(req.body);

   var replacements1 =  req.body;

    Sequelize
        .query('EXEC DeleteUser :id, :isActive',
        { replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        
        // res.send(recs[0]);
        res.send(JSON.stringify("Deleted Successfully!"));
    }; 
};