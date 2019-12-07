'use strict'

var Sequelize = require('../../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC Master_GetPincodeRateMasterDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };

};

exports.indexById = function(req, res) {
    console.log(req.body);
    
    var replacements1 = {
        id: req.params.id
    };
    Sequelize
        .query('EXEC Master_GetPincodeRateMasterDetailById :id',
            {replacements : replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };

};

exports.rateMaster = function (req, res) {
    
    Sequelize
        .query('EXEC Master_GetRateMasterCode')
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };
};

exports.getBD_PostalsRates = function(req, res){
    var replacements1 = {postalType: req.params.postalType};
    Sequelize
        .query('EXEC Trans_getBookPostalRates :postalType', {replacements : replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    };
};

exports.getByRateTypes = function(req, res) {    
    var replacements1 = {rateType: req.params.rateType};
    Sequelize
        .query('EXEC Trans_getPostalRatesByRateType :rateType',{replacements : replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs);
    };
};

exports.rateByPincode = (req, res) => {
    var replacements = req.body;
    Sequelize
        .query('EXEC GetRateByPincode :pincode',{replacements: replacements,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}

exports.getVendorChargeWithArgs= (req, res) => {
    var replacements = req.body;
    Sequelize
        .query('EXEC Master_getPostalVendorRates :pincode',{replacements: replacements,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        }).catch(err => {
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}


