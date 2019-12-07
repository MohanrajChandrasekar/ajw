'use strict'

var Sequelize = require('../../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    var replacements1 = req.body;

    Sequelize
        .query('EXEC Master_UpdatePincodeRateMasterDetails :id, :vendorName, :postalCode, :city, :state, :category, :mode, :wtFrom, :wtTo, :rate, :returnCharge, :customerType, :updatedBy',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        var id = recs[0][0].id;
        if (id == -1) {
            var returnVal = {
                statusBool: -1,
                statusText: 'Vendor Name and Pincode Already Exists for this Weight'
            };
            res.send(returnVal);
        }
        else {
            var returnVal = {
                statusBool: 1,
                statusText: 'Updated Successfully'
            };
            res.send(returnVal);
        }
    };
};

