'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    
    Sequelize
        .query('EXEC Master_GetIncomingDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        // console.log(recs[0]);
        res.send(recs[0]);
    };

};

exports.indexById = function(req, res) {
    var replacements1 = {
        id: req.params.id
    };

    var secDetails = new Array();

    Sequelize
        .query('EXEC Master_GetIncomingDetailsByID :id',{replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs[0]);
        secDetails = recs[0];
        // secDetails.push('Detail')
        Sequelize
        .query('EXEC Master_GetIncomingDetailListByID :id',
            {replacements : replacements1})
        .then(resultReturn);

        function resultReturn(recs) {
            console.log(recs);
            secDetails.push(recs[0]);

            res.send(secDetails);
            console.log(recs[0][0]);
        };
    };
};

exports.incomeLoadById = function(req, res) {
    
    var replacements1 = {
        id: req.params.id
    };

    var secDetails = new Array();

    Sequelize
        .query('EXEC Master_GetIncomingDetail_Sec_ByID :id',{replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };
};