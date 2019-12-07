'user strict'
var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    
    var replacements1 = {
        secRunNo: req.params.secRunNo
    };

    Sequelize
        .query('EXEC Trans_GetMenifestDetailsByRunNo :secRunNo',{replacements: replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs)
        res.send(recs);
    };
};

exports.unUsedRunList = (req, res) =>{
    var replacements1 = {secRunNo: req.params.secRunNo};
    Sequelize
        .query('EXEC Trans_GetNoUsedRunNoHAWNList :secRunNo',{replacements: replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs)
        res.send(recs);
    };
}

exports.getLandedWtByHAWN = (req, res) =>{
    var replacements = {secHawnNo: req.params.secHawnNo};
    
        Sequelize
        .query('EXEC Trans_GetLanedWeightByHAWN :secHawnNo',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

        function queryReturn(recs) {
            console.log(recs)
            res.send(recs);
        };
    
}

exports.getBoxPcsByHAWN = (req, res) =>{
    console.log(req.params);
    var replacements = {secHawnNo: req.params.secHawnNo};
    Sequelize
        .query('EXEC Tran_getBoxPcsByHAWN :secHawnNo',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs)
        res.send(recs);
    };
}