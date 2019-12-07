'use strict'

var Sequelize = require('../../config/sequelize').getConnection();

exports.indexDatewise = function (req, res) {
    console.log(req.body);
    let roleId = req.body.roleId;
    let value = roleId.includes("9");
    let replacement1 = {
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        branchId: req.body.branchId,
        value: value
    }
    Sequelize
        .query('EXEC GetDatewiseDistribution :fromDate, :toDate,:branchId,:value',
            { replacements: replacement1, type: Sequelize.QueryTypes.SELECT })
        .then(queryReturn);
    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    }
}

exports.indexBranchwise = function (req, res) {
    console.log(req.body);
    let roleId = req.body.roleId;
    let value = roleId.includes("9");
    let replacement1 = {
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        branchId: req.body.branchId,
        value: value
    }
    Sequelize
        .query('EXEC GetBranchwiseDistribution :fromDate, :toDate, :branchId,:value', { replacements: replacement1, type: Sequelize.QueryTypes.SELECT })
        .then(queryReturn);
    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    }
}

exports.indexDate = function (req, res) {
    console.log(req.body);
    let roleId = req.body.roleId;
    let value = roleId.includes("9");
    let replacement1 = {
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        branchId: req.body.branchId,
        value: value
    }
    Sequelize
        .query('EXEC GetByDate :fromDate, :toDate,:branchId,:value',
            { replacements: replacement1, type: Sequelize.QueryTypes.SELECT })
        .then(queryReturn);
    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    }
}

exports.mawb = function (req, res) {
    console.log(req.body);
    let roleId = req.body.roleId;
    let value = roleId.includes("9");
    let replacement1 = {
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        branchId: req.body.branchId,
        value: value
    }
    Sequelize
        .query('EXEC GetMAWBAmount :fromDate, :toDate,:branchId,:value',
            { replacements: replacement1, type: Sequelize.QueryTypes.SELECT })
        .then(queryReturn);
    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    }

}

exports.openingClosingReport = function (req, res) {
    console.log(req.body);
    let roleId = req.body.roleId;
    // let value = roleId.includes("9");
    let replacements = {
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        branchId: req.body.branchId
        // value: value
    }
    Sequelize
        .query('EXEC Trans_OpeningClosingReport :fromDate, :toDate',
            { replacements: replacements, type: Sequelize.QueryTypes.SELECT })
        .then(queryReturn);
    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    }

}