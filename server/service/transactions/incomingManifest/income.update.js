'use strict'
var event = require('../eventLogger');
var Sequelize = require('../../../config/sequelize').getConnection();
var _ = require('underscore');

exports.index = async function(req, res){
    event.logsEvent(req.body,'UPDATE - Master_UpdateIncomeDetail');
    var replacements = req.body;
    
    let queryResult = Sequelize.query('EXEC Master_UpdateIncomeDetail :id, :secBranch, :secMawbno, :secManifestDate, :secDepartureDate, :secManifestArrDt, :updatedBy',
            { replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(queryResult.err){
        console.log(queryResult.err);
    }else{
            var i = 0;
            var categoryList = replacements.secDeliveryCat;
            categoryList.forEach(element => {
                let tempReplaces = {
                    incomeId: replacements.id,
                    categoryId: element
                };
                let dbCategory = Sequelize.query('EXEC Trans_updateByCategoryIdAndIncomeId :incomeId, :categoryId',{replacements: tempReplaces, type: Sequelize.QueryTypes.SELECT});
                if(dbCategory.err){
                    console.log(dbCategory.err);
                }else{
                    if(categoryList.length - 1 == i){
                            res.send(JSON.stringify('Successfully Updated.'));
                    }
                    i = i + 1;
                }
        }); 
    }
};

exports.byRowID = function(req, res){
    event.logsEvent(req.body,'UPDATE - Master_UpdateIncomeDetailList');

    var replacements1 = req.body;
    console.log(req.body);

    Sequelize
        .query('EXEC Master_UpdateIncomeDetailList :id, :secHAWB, :secShipper, :secPieces, :secWeight, :secWeightKG, :secPickup, :secFrank, :secDeliveryCat, :updatedBy',
        {replacements: replacements1})
        .then(resultReturn);

        function resultReturn(recs){
            console.log(recs);
            res.send(JSON.stringify('Updated Successfully!'));
        }            
}

exports.LandedPcs = (req, res) => {
    event.logsEvent(req.body,'UPDATE - Trans_UpdateLandedPcs');

    let replacements = req.body;

    Sequelize
    .query('EXEC Trans_UpdateLandedPcs :id, :incomeID, :secLandedPcs, :secLandedWtKGs, :secLandedWtLBs',
    {replacements: replacements})
    .then(resultReturn);

    function resultReturn(recs){
        console.log(recs);
        res.send(JSON.stringify('Updated Successfully!'));
    }            
}

exports.secMawbno = function(req, res){
    var replacements1 = req.body;

    Sequelize
        .query('EXEC Trans_GetDetailsByMAWBNo :secMawbno, :secRunno',{replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs[0]);
        res.send(recs[0]);
    };
}

exports.secMawbnoForGroupedReport = function(req, res){
    var replacements1 = req.body;

    Sequelize
        .query('EXEC Trans_GetDetailsByMAWBNoForGroupedReport :secMawbno,:secRunno',{replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs[0]);
        res.send(recs[0]);
    };
}

exports.reportDataByMAWB = function(req, res){
    var replacements1 = req.body;
    Sequelize
        .query('EXEC Trans_ReportByMAWBNo :secMawbno, :secRunno',{replacements: replacements1,type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        }).catch(err => {
            console.log(err);
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}