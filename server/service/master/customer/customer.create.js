'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    var replacements1 = req.body;

    Sequelize
        .query('EXEC Master_InsertCustomerDetail :code,:name,:type,:ent,:address1,:address2,:city,:pin,:phone,:fax,:email,:contact,:contractNo,:contractDate,:renewalDate,:expiryDate,:createdBy',
            { replacements: replacements1 })
        .then(queryReturn);
        
    function queryReturn(recs) {
        var id = recs[0][0].id;
        if (id == -1) {
            var returnVal = {
                statusBool: -1,
                statusText: 'Code Already Exists'
            };
            res.send(returnVal);
        }
        else {
            var returnVal = {
                statusBool: 1,
                statusText: 'Saved Successfully'
            };
            res.send(returnVal);
        }
    };
};


