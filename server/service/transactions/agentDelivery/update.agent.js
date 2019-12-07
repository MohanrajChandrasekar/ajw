'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');
var sql = require('mssql');

exports.updateAgentDelivery = function (req, res) {
    event.logsEvent(req.body, 'UPDATE - Trans_GetIDForAgentDelivery');

    let replacements = req.body;

    Sequelize
        .query('EXEC Trans_GetIDForAgentDelivery', { type: Sequelize.QueryTypes.SELECT })
        .then(getQueryRtrn)

    function getQueryRtrn(recs) {
        console.log(recs[0]['']);
        let iterations = 0;

        for (let i in replacements) {
            replacements[i].refAgntMFDate = null;
            replacements[i].refAgntMFTime = null;

            Sequelize
                .query('EXEC Trans_UpdateAgentDeliveryManifestByMfId :id, :refAgntDelvMFID, :refAgntBookingTypeID, :refAgntFrnsCode, :refAgntMFDate, :refAgntMFTime, :refAgntRemarks, :refAgntDestBranchID, :refOutForDelivery, :createdBy', { replacements: replacements[i], type: Sequelize.QueryTypes.SELECT })
                .then(queryReturn);

            function queryReturn(recs) {
                if (iterations == replacements.length - 1) {
                    res.send(recs);
                    console.log(recs);
                }
                iterations++;
            }
        }
    }
}

// Add POD Details..
exports.addPOD = function(req, res){
    console.log(req.body);
    event.logsEvent(req.body, 'INSERT - Trans_InsertDeliveryDetails');

    let replacements = req.body;
    let iterations = 0;

    for(let i in replacements){
    let placements = {
        cnNO: replacements[i].CNNO,
        delStatus: replacements[i].STATUS,
        reason: replacements[i].REASON,
        delSign: replacements[i].SIGN, 
        delTime: replacements[i].TIME, 
        delDate: replacements[i].DATE, 
        delCode: replacements[i].CODE
    } 
    Sequelize
        .query('EXEC Trans_InsertDeliveryDetails :cnNO, :delStatus, :reason, :delSign, :delTime, :delDate, :delCode',{replacements: placements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

        function queryReturn(recs){
            if(iterations == replacements.length - 1){
                res.send(recs);
                console.log(recs);
            }
            iterations++;
        }
    }
}

// Check & Add POD
exports.checkAndUpdatePOD = function(req, res) {
    // event.logsEvent(req.body, 'CHECK AND ADD - Trans_isBookedCNNO,Trans_checkPODDetailsByCNNO');
    var replacements = req.body;
    
    Sequelize.query('Select max(podUploadRefID) + 1 as podRefID from ajw_agentDelvMF where isActive = 1', {type: Sequelize.QueryTypes.SELECT}).
    then(process);
    async function process(recrds) {
        let podRefID = recrds[0]['podRefID'] == null ? 1 : recrds[0]['podRefID'];
        for(let i = 0; i < replacements.length; i++) {
            replacements[i]['podRefID'] = podRefID;
                try { debugger
                    let resultQuery = await Sequelize.query('EXEC Trans_checkPODDetailsByCNNO :cnNo, :delStatus, :reason, :delSign, :delDate, :delTime, :delCode, :createdBy, :podRefID',{replacements: replacements[i], type: Sequelize.QueryTypes.SELECT});
                    let status = resultQuery[0]['stat'];
                    if (status >= 2) {
                        replacements[i]['isUpdated'] = 1;
                        replacements[i]['updatedState'] = status;
                        replacements[i]['error'] = null;
                    } else {
                        replacements[i]['isUpdated'] = 0;
                        replacements[i]['updatedState'] = status;
                        replacements[i]['error'] = 'Wrong Consignment No';
                    }
                    if(i == replacements.length - 1){
                        let replaces = {
                            podRefID: replacements[i]['podRefID'],
                            value: JSON.stringify(replacements)
                        }
                        try{
                            let result = await Sequelize.query('EXEC Save_podHistory :podRefID, :value',{replacements: replaces, type: Sequelize.QueryTypes.SELECT});
                            let reply = { status: 200, msg: 'Uploaded Successfully!', result };
                            res.send(reply);
                        } catch (err) {
                            console.log(err);
                            let reply = { status: 500, msg: 'Error while saving history!'};
                            res.send(reply);
                        }
                    }
                } catch(err) {
                    console.log(err);
                    replacements[i]['isUpdated'] = 0;
                    replacements[i]['error'] = err;
                }
        }
    }
}

exports.updateScannedByCNNO = async (req, res) => {
    var replacements = req.body;

    try{
        let queryResults = await Sequelize.query('EXEC Trans_setIsScannedByCNNO :cnNO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        console.log(queryResults);
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.autoUpdateInScanAndAgentDelvMF_ONLY_EXPRESS_SPCLCNNO = async () => {

    try{
        let result = await Sequelize.query('EXEC Trans_autoUpdateInScanAndAgentDelvMF_ONLY_EXPRESS_SPCLCNNO');
        console.log(result);
    } catch(err) {
        console.log(err);
        let errInfo = JSON.stringify(err);
        let errStored = await Sequelize.query('INSERT INTO autoProg_ErrLog(err) VALUES(errInfo);');
        console.log(errStored);
    }
}

exports.changeVendorBeforeDelivery = async (req, res) => {
    var replacements = req.body;

    try{
        let queryResults = await Sequelize.query('EXEC Trans_changeVendor :cnno, :fromVendor, :toVendor, :userName, :rate',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        console.log(queryResults);
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.autoUpdateInScanAndAgentDelvMF_POSTAL_ONLY = async () => {

    try{
        let result = await Sequelize.query('EXEC Trans_autoUpdateInScanAndAgentDelvMF_POSTAL_ONLY');
        console.log(result);
    } catch(err) {
        console.log(err);
        let errInfo = JSON.stringify(err);
        let errStored = await Sequelize.query('INSERT INTO autoProg_ErrLog(err) VALUES(errInfo);');
        console.log(errStored);
    }
}