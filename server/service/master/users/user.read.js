'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

// console.log(Sequelize);

exports.index = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC GetUsers')
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
        .query('EXEC GetUserById :id',
            { replacements: replacements1 })
            
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };

};

exports.indexByLoginId = function (req, res) {
    console.log();
    var replacements1 = {
        LoginId: req.params.LoginId
    };
    Sequelize
        .query('EXEC  GetUserRoles :LoginId',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        console.log('inside master user..');
        res.send(recs[0]);
    };

};

