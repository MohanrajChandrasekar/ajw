'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();

exports.tracking = function(req, res){
    
    let replacements = {cnNO: req.params.cnNO}
    Sequelize
        .query('EXEC Trans_GetConsignmentTrackingByCnno :cnNO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.trackByPosibility = async function(req, res) {
    let replacements = req.body;
    let results = await Sequelize.query('Exec Trans_ConsignmentTracking :fromDate, :toDate', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    try {
        let queryReturn = { status: 200, results };
        res.send(queryReturn);
    } catch(err) {
        console.log(err);
        let queryReturn = { status: 500, err };
        res.send(queryReturn);
    }
}

exports.trackProdcutionByUser = async function(req, res) {
    let replacements = req.body;
    // let results = await Sequelize.query('Exec Trans_ProductionByUser :fromDate, :toDate', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    let results = await Sequelize.query('Exec Trans_ProductionByUserChanged :fromDate, :toDate', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    try {
        let queryReturn = { status: 200, results };
        res.send(queryReturn);
    } catch(err) {
        console.log(err);
        let queryReturn = { status: 500, err };
        res.send(queryReturn);
    }
}

exports.coloaderReport = async function(req, res) {
    let replacements = req.body;
    let results = await Sequelize.query('Exec Trans_ColoaderReport :fromDate, :toDate', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    try {
        let queryReturn = { status: 200, results };
        res.send(queryReturn);
    } catch(err) {
        console.log(err);
        let queryReturn = { status: 500, err };
        res.send(queryReturn);
    }
}

exports.postalTariff = async function(req, res) {
    let replacements = req.body;
    let results = await Sequelize.query('Exec Trans_PostalTariff :fromDate, :toDate', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    try {
        let queryReturn = { status: 200, results };
        res.send(queryReturn);
    } catch(err) {
        console.log(err);
        let queryReturn = { status: 500, err };
        res.send(queryReturn);
    }
}

exports.coloaderBreakupByColoaderID = async function(req, res) {
    let replacements = req.body;
    let results = await Sequelize.query('Exec Report_ColoaderDetailed :fromDate, :toDate, :refOutColoaderID', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    try {
        let queryReturn = { status: 200, results };
        res.send(queryReturn);
    } catch(err) {
        console.log(err);
        let queryReturn = { status: 500, err };
        res.send(queryReturn);
    }
}
