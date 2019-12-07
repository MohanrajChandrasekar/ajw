'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();

exports.outgoingByMfId = function(req, res){
    let replacements = { refOutMfID: req.params.refOutMfID }
    Sequelize
        .query('EXEC Trans_GetOutgoingPacketManifestDetailsByMfId :refOutMfID',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);
    function queryReturn(recs){
        res.send(recs);
    }
}

exports.bookedDetailsBycnNO = function(req, res){
    let replacements = { cnNO: req.params.cnNO }
    Sequelize
        .query('EXEC Trans_getBookedDetailsBycnnoForOutgoingPacketManifest :cnNO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        res.send(recs);
    }
}

exports.outgoingDetails = function(req, res){ //Get Agent Delivery Details
    var replacements = req.body;
    Sequelize
        .query('EXEC Trans_getOutgoingPacketManifestDetails :branchId, :isHO',{ replacements: replacements,type: Sequelize.QueryTypes.SELECT })
        .then(queryReturn);
    function queryReturn(recs){
        res.send(recs);
    }
}

exports.getOutgoingListByMfDate = function(req, res){
    let replacements = req.body;
    Sequelize
        .query('EXEC Trans_GetOutgoingPacketManifestByDate :frmDate, :toDate, :branchId, :isHO',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);
    function queryReturn(recs){
        res.send(recs);
    }
}

exports.getOutPackagedByBranch = (req, res) => {
    let replacements = {branchID: req.params.branchId}
    Sequelize
        .query('EXEC Trans_getIncomingFromBranchOutpackaged :branchID',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}

exports.getListOfOutPackingByBranchID = (req, res) => {
    let replacements = req.body
    Sequelize
        .query('EXEC Trans_GetOutPackingByBranchID :branchId, :createdBranchId, :secRunno',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then( result => {
            let records = {status:200, data:result};
            res.send(JSON.stringify(records));
        })
        .catch(err => {
            let records = {status:500, data:err};
            res.send(JSON.stringify(records));
        });
}


exports.getPostalPackages = async function(req, res){
    let replacements = {
        branchId: req.params.branchId
    };

    let results = await Sequelize.query('EXEC PostalOutpackagesByBranchId :branchId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(results.err){
        let response = {statusBool: 500, message: results.err};
        res.send(response); 
    }else{
        let response = {statusBool: 200, data: results};
        res.send(response); 
    }
}

exports.checkDuplicateMFID = async function(req, res){
    let replacements = {
        outMFID: req.params.outMFID
    };

    let results = await Sequelize.query('EXEC isDuplicateOutMFID :outMFID',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(results.err){
        let response = {statusBool: 500, message: results.err};
        res.send(response); 
    }else{
        let obj = { isExists : results[0][''] };   
        let response = {statusBool: 200, data: obj};
        res.send(response); 
    }
}

exports.generateOutMFID = async function(req, res){
    let replacements = {
        refOutMFID: 0
    };

    let results = await Sequelize.query('EXEC Trans_genOutMFID',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(results.err){
        let response = {statusBool: 500, message: results.err};
        res.send(response); 
    }else{
        let response = {statusBool: 200, data: results};
        res.send(response); 
    }
}


exports.checkForOutScanByCNNO = async function(req, res){
    let replacements = { cnNO: req.params.cnNO };
    let result = await Sequelize.query('EXEC Trans_OutScanningCheckCNNO :cnNO', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(result.err){
        let response = {statusBool: 500, message: result.err};
        res.send(response); 
    } else {
        let status = result[0]['result'];
        if(status){
            let mainResult = await Sequelize.query('select * from ajw_bookingDetails where cnNO = :cnNO and isActive = 1', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
            if(mainResult.err){
                let response = {statusBool: 500, message: mainResult.err};
                res.send(response); 
            }else{
                // console.log(mainResult);
                let response = {statusBool: 200, mainResult, flag: true };
                res.send(response); 
            }
        }else{
            let response = {statusBool: 200, message: 'Invalid Consignment!', flag: false};
            res.send(response); 
        }
    }
}

exports.outgoingDetailsForInScanning = function(req, res){ //Get Agent Delivery Details
    var replacements = req.body;
    Sequelize
        .query('EXEC Trans_getInscannableOutPackages :branchId, :isHO',{ replacements: replacements,type: Sequelize.QueryTypes.SELECT })
        .then(queryReturn);
    function queryReturn(recs){
        res.send(recs);
    }
}

exports.outScannableVedorWise = async function(req, res){ //Get Agent Delivery Details
    var replacements = req.body;
    try{
        let queryResults = await Sequelize.query('EXEC Trans_GetOutPackingByVendor :branchId, :secRunno',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.outPackagedReportData = async function(req, res){ //Get Outpacked Report Data
    var replacements = req.body;
    try{
        let queryResults = await Sequelize.query('EXEC Report_OutPackageManifest :branchId, :isVendor, :fromDate, :toDate',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}

exports.outPackagedDetailed_XLSL_Report = async function(req, res){ //Get Outpacked Report Data
    var replacements = req.body;
    try{
        let queryResults = await Sequelize.query('EXEC Report_OutPackedDetailedResult :isVendor, :branchId, :fromDate, :toDate, :branchName, :postalCode',{ replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        var returnRes = { status: 200, queryResults };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }
}