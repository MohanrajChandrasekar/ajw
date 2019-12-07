'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    
    Sequelize
        .query('EXEC Master_GetIncomingDetails', { type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    };

};

exports.indexById = function(req, res) {
    
    var replacements1 = {
        id: req.params.id
    };

    var secDetails = new Array();

    Sequelize
        .query('EXEC Master_GetIncomingDetailsByID :id',{replacements: replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        secDetails = recs;
        // secDetails.push('Detail')
        Sequelize
        .query('EXEC Master_GetIncomingDetailListByID :id',
            {replacements : replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(resultReturn);

        function resultReturn(recs) {
            console.log(recs);
            secDetails.push(recs);

            res.send(secDetails);
            console.log(recs[0]);
        };
    };
};

exports.incomeLoadById = function(req, res) {
    
    var replacements1 = {
        id: req.params.id
    };

    Sequelize
        .query('EXEC Master_GetIncomingDetail_Sec_ByID :id',{replacements: replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs[0]);
        res.send(recs[0]);
    };
};

exports.boxDetailsByID = function(req, res) {
    
    var replacements1 = {
        mfstID: req.params.id
    };

    Sequelize
        .query('EXEC Trans_GetBoxDetailByID :mfstID',{replacements: replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    };
}

exports.BoxDetailsByBoxID = function(req, res){
    
    var replacements1 = {
        id: req.params.id
    }
    // Trans_GetBoxDetailByBoxID
    Sequelize
        .query('EXEC Trans_GetBoxDetailByBoxID :id',{replacements: replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    };

}

exports.getRunNo = function(req, res) {
    var replacements1 = {
        id: req.params.runNo
    };

    Sequelize
        .query('EXEC Trans_isRunNoIncoming :id',{replacements: replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        res.send(recs[0]);
    };
}


exports.isHawnNo = function(req, res){
    var replacements2 = {
        secHawnNo: req.params.hawnNo
    };

    Sequelize
        .query('EXEC Trans_isHawnNoIncoming :secHawnNo',{replacements: replacements2, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        res.send(recs[0]);
    };
}

exports.incomeByBranchID = function (req, res) {
    console.log(req.body);
    // var replacements = {branchID : req.params.branchID};
    var replacements = req.body;
    Sequelize
        .query('EXEC Trans_GetIncomingDetailsByBranchID :branchId, :isHO', { replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);
    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    };
};

exports.getRunListByBranchID = (req, res) => {
    console.log(req);
    var replacements = {branchID : req.params.branchID};
    Sequelize
        .query('EXEC Trans_GetIncomingRunListByBranchID :branchID', { replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    };
} 

exports.weightReportByHAWB = function(req, res){
    
    getListOfHAWBs(req, function(result){
        let records = {status:200, data:result};
        res.send(JSON.stringify(records));
    });
}

async function getListOfHAWBs(req, res) {
    var replacements = req.body;
    let listOfHAWBs = await Sequelize.query('EXEC Trans_GetHAWNbyMAWB :secMawbno, :secRunno',{replacements: replacements,type: Sequelize.QueryTypes.SELECT});
    if (listOfHAWBs.err) {
        console.log(err);
    } else {
        for (let i=0; i<listOfHAWBs.length; i++) {
            listOfHAWBs[i]['isExpress'] = listOfHAWBs[i]['deliveryCategory'] == 'Express' ? true : false;
            let response1 = await Sequelize.query('EXEC Trans_weightBreakupReportByRun :id',{replacements: listOfHAWBs[i],type: Sequelize.QueryTypes.SELECT})
            if (response1.err){
                console.log(response1.err);
            } else {
                listOfHAWBs[i]['breakUpReports'] = response1;
                if(i == listOfHAWBs.length -1)  {
                    res(listOfHAWBs);
                }  
            }
        }
    }
} 

exports.checkHAWBNo = async function(req, res) {

    var replacements = req.body;

    let result = await Sequelize.query('EXEC Trans_CheckDeuplicateMAWB :mawbNo', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(result.err){
        console.log(err);
    }else{
        console.log(result);
        let records = {status:200, data:result};
        res.send(JSON.stringify(records));
    }
} 

exports.getDeliveryCategoryByIncomeID = async function(req, res){
    var replacements = { incomeId: req.params.incomeId };
    let response = await Sequelize.query('EXEC Trans_getdeliveryCatByIncomeID :incomeId', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(response.err){
        console.log(response.err);
        let result = { statusBool: 500, data: response };
        res.send(result);
    }else{
        let result = { statusBool: 200, data: response };
        res.send(result);
    }
}

exports.getCategoryByRunNO = async function(req, res){
    var replacements = { runNo: req.params.runNo };
    let response = await Sequelize.query('EXEC Trans_getDeliveryCategoryByRunNo :runNo', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(response.err){
        console.log(response.err);
        let result = { statusBool: 500, data: response };
        res.send(result);
    }else{
        let result = { statusBool: 200, data: response };
        res.send(result);
    }
}

exports.getStationArrivalReportByRun = async function(req, res) {
    var replacements = { runNo : req.params.runNo };
    try{
        let queryResults = await Sequelize.query('EXEC Report_stationArrivalBreakup :runNo', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        let result = { statusBool: 200, data: queryResults };
        res.send(result);
    }catch(e){
        console.log(e);
        let result = { statusBool: 500, data: e };
        res.send(result);
    }
}