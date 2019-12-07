'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();

exports.bookedDetails = function(req, res){
    
    Sequelize
        .query('EXEC Trans_getBookedDetails',{ type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.bookedDetailsByID = function(req, res){
    let replacements = {id: req.params.id}
    
    Sequelize
        .query('EXEC Trans_getBookedDetailsByID :id',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.bookedDetailsBycnNO1 = function(req, res){
    let replacements = {cnNO: req.params.cnNO}

    Sequelize
        .query('EXEC Trans_getBookedDetailsBycnNO :cnNO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.bookedDetailsByCNNO = function(req, res){
    let replacements = req.body;
    Sequelize
        .query('EXEC Trans_getBookedDetailsBycnNOForAgent :branchId, :postalCode, :refOutMFID, :isHO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);
    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.bookedDetailsByMfID = function(req, res){
    let replacements = {mfId: req.params.mfId}

    Sequelize
        .query('EXEC Trans_getBookedDetailsByMfID :mfId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getBookedAgentListByMfID = function(req, res){
    let replacements = {mfId: req.params.mfId}

    Sequelize
        .query('EXEC Trans_getBookedDetailsByMfID :mfId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getBookedAgentListByMfDate = function(req, res){
    let replacements = req.body;
    Sequelize
        .query('EXEC Trans_getAgentDelvDetailsByDate :frmDate, :toDate, :isHO, :branchId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);
    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getPODList = function(req, res){ //Get Agent Delivery Details 
    Sequelize
        .query('EXEC Trans_GetPODs',{ type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getPODbyCNNO = function(req, res){
    console.log(req.body);
    let replacements = {cnNO: req.params.CNNO}
    Sequelize
        .query('EXEC Trans_getBookedNotInPODbycnNO :cnNO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getVendorsList = (req, res) => {
    let replacements = req.body;
    Sequelize
        .query('EXEC Trans_GetVendorsOFOutGoingPackages :branchId, :refOutMFID',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            console.log(err);
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}

exports.getOutMFList = (req, res) => {
    let replacements = req.body;
    Sequelize
        .query('EXEC Trans_GetOutMFList :branchId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            console.log(result);
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            console.log(err);
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}

exports.getAgentDeliverablesBranch = (req, res) => {
    let replacements = {branchId: req.params.branchId}
    Sequelize
        .query('EXEC Trans_getAgentDeliverablesBranch :branchId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}

exports.agentDelvDetails = async (req, res) => { //Get Agent Delivery Details
    var replacements = req.body;
    try{
        let result = await Sequelize.query('EXEC Trans_GetAgentPackagesByBranchID :branchId, :isHO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, data: result };
        res.send(JSON.stringify(returnRes));
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(JSON.stringify(returnRes));
    }
}

exports.getInscanConsigments = async (req, res) => {
    var replacements = req.body;
    
    try{
        let queryResults = await Sequelize.query('EXEC Trans_getInscannableCnnoByBranchAndOutMF :branchId, :postalCode, :refOutMFID, :isHO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        // console.log(queryResults);
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getInscannedCNNOs = async (req, res) => {
    var replacements = req.body;
    
    try{
        let queryResults = await Sequelize.query('EXEC Trans_getInscannedConsignments :refOutMFID',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        // console.log(queryResults);
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}


exports.getInscannableConsignsByBranchID = async (req, res) => {
    var replacements = req.body;
    console.log(replacements);
    try{
        let queryResults = await Sequelize.query('EXEC Trans_ListUnScannadBranchWiseConsignments :branchId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getDeliverableConsignments = async (req, res) => {
    var replacements = req.body;
    try{
        let queryResults = await Sequelize.query('EXEC Trans_GetListDeliverableConsignments :branchId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getAgentDeliveryMFID = async (req, res) => {
    var replacements = req.body;
    try{
        let queryResults = await Sequelize.query('EXEC Trans_deliveryMFID',{type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getVendorsForDeliverables = async (req, res) => {
    var replacements = req.body;
    try{
        let queryResults = await Sequelize.query('EXEC Trans_branchedDeliverableVendors :branchId',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getConsginmentListForDeliveryByBranchID = async (req, res) => {
    var replacements = req.body;
    try{
        let queryResults = await Sequelize.query('EXEC Trans_GetConsignmentsByBranchAndVendor :branchId, :postalCode',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getVendorChangedConsignments = async (req, res) => {
    var replacements = req.body;
    try{
        let queryResults = await Sequelize.query('EXEC Trans_getVendorChangedConsignments :branchId',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getBranchedVendorDistributions = async (req, res) => {
    var replacements = req.body;
    try {
        let queryResults = await Sequelize.query('EXEC Trans_DeliveryVendorReportByBranch :fromDate, :toDate, :branchId',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    } catch(err) {
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getVendorDistributedDetails = async (req, res) => {
    var replacements = req.body;
    try {
        let queryResults = await Sequelize.query('EXEC Trans_GetDetailedVendorReportByVendorName :fromDate, :toDate, :branchId, :postalCode',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    } catch(err) {
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getListOfPODs = async (req, res) => {
    try {
        let queryResults = await Sequelize.query('EXEC Trans_getUploadsPOD',{ type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    } catch(err) {
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getPODsDetailedData = async (req, res) => {
    var replacements = req.body;
    try {
        let queryResults = await Sequelize.query('EXEC Trans_getAllPODsByRefID :podUploadRefID',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    } catch(err) {
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.isGoForDelivery = async (req, res) => {
    var replacements = req.body;
    try {
        let queryResults = await Sequelize.query('EXEC Trans_isBookedCNNO :cnNo',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    } catch(err) {
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.podHistoryByID = async (req, res) => {
    var replacements = req.body;
    try {
        let queryResults = await Sequelize.query('EXEC Get_podHistory :podRefID',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var jsonResult = JSON.parse(queryResults[0]['value']);
        for (let i = 0 ; i < jsonResult.length; i++) {
            if (jsonResult[i]['updatedState'] < 4 || jsonResult[i]['isUpdated'] == 0) {
                let result = await Sequelize.query('EXEC Get_podStatusByConsignment :cnNo', { replacements: jsonResult[i], type: Sequelize.QueryTypes.SELECT});
                if (result[0]['cnNO'] == 0) {
                    jsonResult[i]['Consignment'] = 0;
                } else {
                    jsonResult[i]['refOutAddStatus'] = result[0]['refOutAddStatus'];
                    jsonResult[i]['isInScanned'] = result[0]['isInScanned'];
                    jsonResult[i]['refOutForDelivery'] = result[0]['refOutForDelivery'];
                    jsonResult[i]['Consignment'] = 1;
                }
            }
            if (i == jsonResult.length - 1) {
                let json = JSON.stringify(jsonResult);
                var returnRes = { status: 200, json };
                res.send(returnRes);
            }
        }
    } catch(err) {
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.getSinglePODsList = async (req, res) => {
    var replacements = req.body;
    try {
        let queryResults = await Sequelize.query('EXEC Trans_SinglePODsList :branchId, :isHO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(error){
        console.log(error);
        var returnRes = { status: 500, error };
        res.send(returnRes);
    }
}



