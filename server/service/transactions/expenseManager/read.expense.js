'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = async function(req, res) {
    console.log(req.body);

    try{
        var response = await Sequelize.query('EXEC GetExpenseBills',{type: Sequelize.QueryTypes.SELECT});
        console.log(response);
        var returnRes = { status: 200, response };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
      
}

exports.indexById = async function(req, res) {
    console.log(req.body);
    var replacements = { id: req.params.id};

    try{
        var response = await Sequelize.query('EXEC GetExpenseBillByID :id',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        console.log(response);
        var returnRes = { status: 200, response };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }

}

exports.check = function(req, res) {
    console.log(req.body);
    var replacements1 = {id: req.params.id};
    var p = new Promise((resolve, reject) => {
    Sequelize.query('EXEC Trans_isMawbno :id',{replacements : replacements1,type: Sequelize.QueryTypes.SELECT}).then(result=>{
            return resolve(result);
        }).catch(err =>{
            return reject(err);
        });    
    })
    p.then(rec =>{
        let count = rec[0];
        res.send(count);
    });
      
}

exports.manifestWeightByMAWB = async function(req, res) {
    console.log(req.body);
    let replacements = { mawbNo : req.params.mawbNo };

    try{
        var response = await Sequelize.query('EXEC Trans_ManifestWeightByMAWB :mawbNo',{replacements: replacements ,type: Sequelize.QueryTypes.SELECT});
        console.log(response);
        var returnRes = { status: 200, response };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
      
}

exports.expenseBillReportByMAWB = async function(req, res) {
    console.log(req.body);
    let replacements = { mawbNo : req.params.mawbNo };

    try{
        var response = await Sequelize.query('EXEC Trans_expenseBillByMAWB :mawbNo',{replacements: replacements ,type: Sequelize.QueryTypes.SELECT});
        console.log(response);
        var returnRes = { status: 200, response };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
      
}