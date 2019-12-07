'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

// console.log(Sequelize);

exports.index = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC Master_GetOfficeDetail',{type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    };

};

exports.indexById = function (req, res) {
    console.log();
    var replacements1 = {
        id: req.params.id
    };
    Sequelize
        .query('EXEC Master_GetOfficeDetailById :id',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };

};

exports.types = function (req, res) {
    Sequelize
        .query('EXEC Master_GetOfficeTypes')
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs[0]);
        res.send(recs[0]);
    };
};

exports.officeListByType = (req, res) => {
    var replacements = {type: req.params.type};
    Sequelize
        .query('EXEC Master_GetOfficeDetailByType :type',{replacements: replacements})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs[0]);
        res.send(recs[0]);
    };
}
