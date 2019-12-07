'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = (req, res) =>{
    let replacements1 ={id: req.params.id};
    Sequelize
        .query('EXEC Trans_GetSpecialBookingInfoByID :id',
        {replacements: replacements1,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            console.log(result);
            let records = {status:200, data:result, message:'Saved Successfully!'};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            let records = {status:500, data:err, message:'Error Saving!'};
            res.send(JSON.stringify(records));
        });
}

exports.getCNNObyID = (req, res) =>{
    let replacements1 ={id: req.params.id};
    Sequelize
        .query('EXEC Trans_GetCnNOByBookingID :id',
        {replacements: replacements1,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            console.log(result);
            let records = {status:200, data:result };
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}

exports.getSpecialBookDetailsByID = (req, res) =>{
    let replacements1 ={id: req.params.id};
    Sequelize
        .query('EXEC Trans_GetSpecialBookDetailsByID :id',
        {replacements: replacements1,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            console.log(result);
            let records = {status:200, data:result };
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            console.log(err);
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}

exports.getSpecialBookHawnList = (req, res) => {
    let replacements1 ={secRunNo: req.params.secRunno};
    Sequelize
        .query('EXEC Trans_getSpcielHawnList :secRunNo',
        {replacements: replacements1,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            console.log(result);
            let records = {status:200, data:result };
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            console.log(err);
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
} 

exports.getSpecialBookDetailsByDetailID = (req, res) =>{
    let replacements1 ={id: req.params.id};
    Sequelize
        .query('EXEC Trans_GetSpecialBookDetailsByDetailID :id',
        {replacements: replacements1,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            console.log(result);
            let records = {status:200, data:result };
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            console.log(err);
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}

exports.isSpecialBookingMF_isCNNO = function(req, res){    
    let replacements = req.body
    Sequelize
        .query('EXEC Trans_IsSpecialMF_IsBookedCNNO :cnNo',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

