'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

// console.log(Sequelize);

exports.index = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC Master_GetShipperDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        // console.log(recs[0]);
        res.send(recs[0]);
    };

};

exports.indexById = function (req, res) {
    console.log();
    var replacements1 = {
        id: req.params.id
    };
    Sequelize
        .query('EXEC Master_GetShipperDetailByID :id',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };

};