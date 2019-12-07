'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function(req, res){
    console.log(req.body);

    var replacements1 = req.body;

    Sequelize
        .query('EXEC Master_InsertPincodeDetails :ajwType, :ajwCode, :ajwPin, :ajwCity, :ajwArea, :ajwRateType, :createdBy',
            { replacements: replacements1})
        .then(queryReturn);

        function queryReturn(recs) {
            var id = recs[0][0].id;
            if (id == -1) {
                var returnVal = {
                    statusBool: -1,
                    statusText: 'Pincode and Postal Type Already Exists'
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

