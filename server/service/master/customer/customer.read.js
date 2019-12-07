'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);
    
    Sequelize
        .query('EXEC Master_GetCustomerDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };
};

exports.indexById = function (req, res) {
    console.log();
    var replacements1 = {
    id: req.params.id
    };
    Sequelize
    .query('EXEC Master_GetCustomerDetailsById :id',
    { replacements: replacements1 })
    .then(queryReturn);
    
    function queryReturn(recs) {
    res.send(recs[0][0]);
    };  
};

exports.types = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC Get_CustomerTypes')
        .then(queryReturn);

    function queryReturn(recs) {
        console.log('types of customers');
        console.log(recs);
        res.send(recs[0]);
    };
};


exports.listByType = function (req, res) {
    console.log(req.body);
    var replacements = { type: req.params.type};

    Sequelize
        .query('EXEC Master_GetCustomerDetailsByType :type',{replacements:replacements})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };
};