'use strict'

var sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);
   
    var replacements1 = req.body;
    sequelize
         .query('EXEC Delete_specialConsignees :id, :updatedBy',
             { replacements: replacements1 })
             .then(queryReturn);
    
        
    function queryReturn(recs) {
        res.send(JSON.stringify('Successfully Deleted!'));
    };
};             