'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

// console.log(Sequelize);

exports.index = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC Master_GetColoaderDetails')
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
        .query('EXEC Master_GetColoaderDetailByID :id',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };
};

exports.getRateByID = function (req, res) {
    var replacements = {id: req.params.id};
    Sequelize
    .query('EXEC Trans_getColoaderRateByID :id',{replacements: replacements,type: Sequelize.QueryTypes.SELECT})
    .then( result => {
        let records = {status:200, data:result};
        res.send(JSON.stringify(records));
    })
    .catch(err => {
        console.log(err);
        let records = {status:500, data:err};
        res.send(JSON.stringify(records));
    });
};