'use strict'

var sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    var replacements1 = req.body;
    
    sequelize
        .query('EXEC InsertspecialConsignees :consigneeName, :consigneeAddress, :pincode, :createdBy',
            { replacements: replacements1 })
        .then(queryReturn);
   
    function queryReturn(recs) {
        var result = { statusBool: 200, message: 'Saved Successfully!' };
        res.send(result);
    };
};
    

    