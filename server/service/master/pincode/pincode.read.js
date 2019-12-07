'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    Sequelize
        .query('EXEC Master_GetPincodeDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };
};

exports.indexById = function(req, res) {
    var replacements1 = {id: req.params.id};
    Sequelize
        .query('EXEC Master_GetPincodeDetailByID :id',{replacements : replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };
};

exports.indexByPincode = function(req, res) {
    var replacements1 = req.body;
    Sequelize
        .query('EXEC Master_GetPincodeDetailByPincode :pincode',
            {replacements : replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };
};

exports.pinList = function(req, res) {
    var replacements = req.body;
    Sequelize
        .query('EXEC Master_GetPincodeServiceList',{replacements: replacements,type: Sequelize.QueryTypes.SELECT}).then( result => {
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        }).catch(err => {
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
};

exports.pincodeListByCity = function(req, res) {
    var replacements = req.body;
    Sequelize
        .query('EXEC Trans_GetPincodeListByCity :city',{replacements: replacements,type: Sequelize.QueryTypes.SELECT}).then( result => {
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        }).catch(err => {
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
};


