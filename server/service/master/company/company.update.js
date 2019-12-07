'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function(req, res){
    console.log(req.body);

    var replacements1 = req.body;

    Sequelize
        .query('EXEC Master_UpdateCompanyDetails :id, :companyName, :companyAddress1, :companyAddress2, :companyCity, :companyPhone,:companyFax,:companyEmail,:companyWeb,:companyPan,:companyStNo,:updatedBy',
            { replacements: replacements1})
        .then(queryReturn);

        function queryReturn(recs) {
            var id = recs[0][0].id;
            if (id == -1) {
                var returnVal = {
                    statusBool: -1,
                    statusText: 'Name Already Exists'
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
    

