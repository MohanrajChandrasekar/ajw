'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    var replacements1 = req.body;

    Sequelize
        .query('EXEC Master_InsertCodeGenDetail :branchId,:modeId,:codeType, :startNo, :endNo,:createdBy',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        var existsrecsData = recs[0];
        console.log(existsrecsData);
        var existsData=existsrecsData[0].existsData;
        if (existsData == -1 && existsData!==undefined) {
            var returnVal = {
                statusBool: -1,
                statusText: 'code Already Exists'
            };
            res.send(returnVal);
        }
        else {
            var returnVal = {
                statusBool: 1,
                statusText: 'Successfully Added'
            };
            res.send(returnVal);
        }
    };  
    
};

    

