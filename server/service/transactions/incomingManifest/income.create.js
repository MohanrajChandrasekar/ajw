'use strict'
var event = require('../eventLogger');
var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function(req, res){
    event.logsEvent(req.body,'ADD - Master_InsertIncomeDetail');

    var replacements = req.body;
    
    Sequelize
        .query('EXEC Master_InsertIncomeDetail  :secBranch,  :secMawbno, :secManifestDate, :secDepartureDate, :secManifestArrDt, :createdBy',
            { replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(onSuccess);

        function onSuccess(recrd){
            var i = 0;
            var categoryList = replacements.secDeliveryCat;
            replacements.secDeliveryCat.forEach(element => {
                let tempReplaces = {
                    incomeID: recrd[0][""],
                    deliveryCategoryID: element
                };
                Sequelize.query('EXEC insertDeliveryCatOfRunNumber :incomeID, :deliveryCategoryID', {replacements: tempReplaces, type: Sequelize.QueryTypes.SELECT })
                .then(onSaveSuccess);

                function onSaveSuccess(records){
                    if(categoryList.length - 1 == i){
                        Sequelize.query('EXEC Master_GetMaxIncomeID').then(getResults);

                        function getResults(recs){
                            res.send(recs[0][0]);
                        }
                    }
                    i = i + 1;
                }
            });            
        };
};

exports.addLoadInfo = function(req, res){
    event.logsEvent(req.body,'ADD - Master_InsertIncomeDetailList');

    var replacements1 = req.body;
    
    Sequelize
        .query('EXEC Master_InsertIncomeDetailList :incomeID, :secHAWB, :secShipper, :secPieces, :secWeight, :secWeightKG, :secPickup, :secFrank, :secDeliveryCat, :createdBy',
        {replacements: replacements1})
        .then(resultReturn);

        function resultReturn(recs){
            res.send(JSON.stringify("Successfully Added."));
        }
};

