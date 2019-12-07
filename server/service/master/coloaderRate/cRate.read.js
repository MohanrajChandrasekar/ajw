'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

// console.log(Sequelize);

exports.index = async function (req, res) {

    try {
        let result = await Sequelize.query('EXEC Master_GetColoaderRateDetails',{type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, result };
        res.send(returnRes);
    } catch (err) {
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }

};


exports.coloaderForOutscan = async function (req, res) {

    try {
        let result = await Sequelize.query('EXEC Get_Coloaders',{type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, result };
        res.send(returnRes);
    } catch (err) {
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }

};

exports.indexById = function (req, res) {
    console.log();
    var replacements1 = {
        id: req.params.id
    };
    Sequelize
        .query('EXEC Master_GetColoaderRateDetailByID :id',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };
};

exports.getRateByBranches = (req, res) => {
    var replacements = req.body;
    var originHint = [...replacements.originBranch];
    console.log(originHint);
    replacements.originBranch = originHint[0];
    Sequelize
        .query('EXEC Master_getColoaderRate :city, :originBranch',
            { replacements: replacements,type: Sequelize.QueryTypes.SELECT})
            .then( result => {
                let records = {status:200, data:result};
                res.send(JSON.stringify(records));
            }).catch(err => {
                let records = {status:500, data:err};
                res.send(JSON.stringify(records));
            });
}