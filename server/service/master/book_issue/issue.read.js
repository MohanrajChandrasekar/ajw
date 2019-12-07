'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC Master_GetBookIssueDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        // console.log(recs[0]);
        res.send(recs[0]);
    };

};

exports.indexById = function(req, res) {
    console.log(req.body);
    
    var replacements1 = {
        id: req.params.id
    };
    Sequelize
        .query('EXEC Master_GetBookIssueDetailByID :id',
            {replacements : replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };

};

exports.magazine = function(req, res) {
    console.log(req.body);
    
    var replacements1 = {
        magazine: req.params.magazine
    };
    Sequelize
        .query('EXEC Master_GetBookIssueDetailByMagazine :magazine',
            {replacements : replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };

};