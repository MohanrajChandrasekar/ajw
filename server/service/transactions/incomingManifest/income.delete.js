'use strict'
var event = require('../eventLogger');
var Sequelize = require('../../../config/sequelize').getConnection();

exports.deleteIncoming = function(req, res){
    event.logsEvent(req.body,'DELETE - Master_DeleteIncomingDetails');

    var replacements1 = req.body;

    Sequelize
        .query('EXEC Master_DeleteIncomingDetails :id',
            { replacements: replacements1})
        .then(queryReturn);

        function queryReturn(recs){
            console.log(recs);
                res.send(JSON.stringify('Successfully deleted.'));
        };
};

exports.deleteIncomeDetail = function(req, res){
    event.logsEvent(req.body,'DELETE - Master_DeleteIncomingDetailList');

    var replacements1 = req.body;

    Sequelize
        .query('EXEC Master_DeleteIncomingDetailList :id',
            { replacements: replacements1})
        .then(queryReturn);

        function queryReturn(recs){
            console.log(recs);
                res.send(JSON.stringify('Successfully deleted.'));
        };
}

exports.deleteCategorybyIncomeIDAndCategoryID = async function(req, res){
    var replacements = req.body;
    let queryResults = Sequelize.query('EXEC Trans_deleteByCategoryIdAndIncomeId :categoryId, :incomeId',{ replacements: replacements});
    if(queryResults.err){
        console.log(queryResults.err);
    }else{
        console.log(queryResults);
        res.send(JSON.stringify('Successfully deleted.'));
    }
}

exports.deleteAllCategoryByIncomeID = async function(req, res){
    var replacements = { incomeId: req.params.incomeId };
    let queryResults = Sequelize.query('EXEC Trans_deleteAllCategoryByIncomeId :incomeId',{ replacements: replacements});
    if(queryResults.err){
        console.log(queryResults.err);
    }else{
        console.log(queryResults);
        res.send(JSON.stringify('Successfully deleted.'));
    }
}

