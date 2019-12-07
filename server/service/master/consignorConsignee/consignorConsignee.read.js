'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.indexConsignee = function (req, res) {
    console.log(req.body);

    var replacements = req.body;

    Sequelize
        .query('EXEC Master_GetConsigneeDetails :MagazineId, :DocId',{ replacements: replacements })
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
        .query('EXEC Master_GetConsignorConsigneeDetailById :id',
            {replacements : replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };

};

exports.indexConsignor = function (req, res) {
    Sequelize
        .query('EXEC Master_GetConsignorDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };
};

exports.getConsignee = (req, res) => {
    Sequelize
        .query('EXEC Master_GetListOfConsigneeDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs[0]);
        res.send(recs[0]);
    };
}

exports.index = function (req, res) {
    Sequelize
        .query('EXEC Master_GetConsigneeDetail')
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };
}

exports.consignorByMagazineDoc = function (req, res) {
    Sequelize
        .query('EXEC Master_GetConsignorByDocAndMagazine')
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };
};

