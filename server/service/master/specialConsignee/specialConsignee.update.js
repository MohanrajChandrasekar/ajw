'use strict'

var sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);
    var replacements1 = req.body;

    sequelize
         .query('EXEC Update_specialConsignees :id, :consigneeName, :consigneeAddress, :pincode, :updatedBy',
             { replacements: replacements1})
             .then(queryReturn);
         
    function queryReturn(recs) {
        var result = { statusBool: 200, message: 'updated successfully!' };
        res.send(result);
    };
};                