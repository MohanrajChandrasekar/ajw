'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    var replacements1 = req.body;
    replacements1.createdBy = "admin";
    Sequelize
        .query('EXEC Master_InsertConsignorConsigneeDetail :name, :city, :zipCode, :address, :magazine, :contactNumber, :type, :createdBy, :docID, :isSpecialCustomer',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        // res.send(recs[0]);
        res.send(JSON.stringify('Successfully Added!'));
    };
};

