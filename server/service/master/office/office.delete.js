'use strict';

var Sequelize = require('../../../config/sequelize').getConnection(); 

exports.index = function (req, res) {
    console.log(req.body);
    var replacements1 =  req.body;
    var officeDeleteInfo = {
        id: replacements1.id,
        updatedBy:replacements1.updatedBy
        }

    Sequelize
        .query('EXEC Master_DeleteOfficeDetail :id,:updatedBy',
        { replacements: officeDeleteInfo})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    }; 
};