'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');


exports.updateDeleteAgntDlvr = function(req, res){
    event.logsEvent(req.body,'DELETE - Trans_DeleteAgntDelvByMfId');

    console.log(req.body);
    let replacements = req.body;
    
    Sequelize
        .query('EXEC Trans_DeleteAgntDelvByMfId :refAgntDelvMFID',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn)

    function queryReturn(recs){
        res.send(recs);
        console.log(recs);
    }
}