'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);
    var replacements1 = req.body;

    Sequelize
        .query('EXEC Master_UpdateCodeGenDetails :id, :branchId, :modeId, :codeType, :startNo, :endNo,:updatedBy',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        // res.send(recs[0]);
        res.send(JSON.stringify('Successfully Updated!'));
    };
};

var Sequelize = require('../../../config/sequelize').getConnection();

exports.lastNumber = function (req, res) {
    console.log(req.body);
    var replacements1 = req.body;

    Sequelize
        .query('EXEC Master_GetLastNumber :branchId, :modeId',
            { replacements: replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs[0]['cnNo']);
        res.send(recs[0]['cnNo']);
        // res.send(JSON.stringify('Successfully Updated!'));
    };
};