'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC Master_GetCodeGenDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        // console.log(recs[0]);
        res.send(recs[0]);
    };

};

exports.indexById = function (req, res) {
    console.log("called");
    // console.log(req.body);

    var replacements1 = {
        id: req.params.id
    };
    console.log(replacements1);
    Sequelize
        .query('EXEC Master_GetCodeGenDetailById :id',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };

};


exports.checkstart = function(req, res){
    
    let replacements = req.body;
    
    Sequelize
        .query('EXEC Master_CheckStartingNumberValidation',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs[0]['cnNo']);
        res.send(recs[0]['cnNo']);
    }

}