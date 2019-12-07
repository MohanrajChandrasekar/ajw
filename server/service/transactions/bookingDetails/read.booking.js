'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var failurePODs = require('../../../config/constant');

exports.bookingByID = function(req, res){

    let replacements = {
        id: req.params.id
    }
    Sequelize
        .query('EXEC Trans_GetBookingInfoByID :id',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);
        
    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.bookingDetailsByID = function(req, res){
    let replacements = {
        id: req.params.id
    }
    
    Sequelize
        .query('EXEC Trans_GetBookDetailsByID :id',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.bookedDetails = function(req, res){
    // var replacements = {createdBranchId: req.params.branchId};
    var replacements = req.body;
    var promise1 = new Promise((resolve,reject) =>{
        Sequelize
            .query('EXEC Trans_GetBookingInfo :branchId, :isHO', {replacements:replacements, type: Sequelize.QueryTypes.SELECT})
            .then( recs =>{
                return resolve(recs);
            })
            .catch( err =>{
                return reject(err);
            })  
    });

    promise1.then( result =>{    
        res.send(result);
    });
}

exports.bookingDetailsByDetailID = function(req, res){
    let replacements = {id: req.params.id}
    
    Sequelize
        .query('EXEC Trans_GetBookDetailsByDetailID :id',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        let replacements1 = { cnNO: recs[0]['cnNO']};
        console.log(replacements1);
        
        Sequelize
            .query('EXEC Trans_isAddressIssueCNNO :cnNO',{replacements: replacements1, type: Sequelize.QueryTypes.SELECT})
            .then(queryConstruct);

        function queryConstruct(records){
            console.log(records);
            let flag = false;
            if(records[0] == undefined || records[0] == null){
                recs[0]['podFailedOfAddress'] = flag;
                res.send(recs);
            }else{
                let reason = records[0]['podReason'];
                let failureCases = failurePODs.podFailureCases;
                failureCases.forEach(element => {
                    if(reason.includes(element.case) == true){
                        flag = reason.includes(element.case);
                        return 0;
                    };
                });
                recs[0]['podFailedOfAddress'] = flag;
                res.send(recs);
            }
        }
    }
}

exports.getPcsListByHawnNo = function(req, res){
    let replacements = {
        secHawnNo: req.params.secHawnNo
    }
    Sequelize
        .query('EXEC Tran_getPcsList :secHawnNo',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getPcsExistCount = function(req, res){
    let replacements = {
        id: req.params.id
    }
    
    Sequelize
        .query('EXEC Tran_getPcsCount :id',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getPcsValidations = function(req, res){
    
    let replacements = {
        bookingID: req.params.id
    }
    
    Sequelize
        .query('EXEC Tran_getValidationMsg :bookingID',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getDetailsByDate = function(req, res){
    console.log(req.body);
    let replacements = req.body;
    Sequelize
        .query('EXEC Trans_GetBookingInfoByDate :frmDate, :toDate, :branchId, :isHO, :isSpecialBookings',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);
    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.isCnNO = function(req, res){
    let replacements = {cnNo: req.params.cnNo};
    Sequelize
        .query('EXEC Tran_IsCNNO :cnNo',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.checkCNNO = function(req, res){
    
    let replacements = req.body;
    
    Sequelize
        .query('EXEC Tran_CheckCnno :cnNo, :branchId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.loginId = function(req, res){
    
    let replacements = {loginId: req.params.loginId};

    Sequelize
        .query('EXEC GetPodRole :loginId',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs[0]);
        res.send(recs[0]);
    }
}


exports.isDeliveryFailedCNNO = function(req, res){
    let replacements = {cnNo: req.params.cnNo};
    Sequelize
        .query('EXEC Trans_isDeliveryFailedCNNO :cnNo',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);
    function queryReturn(recs){
        console.log(recs);
        let records = {'value' :recs[0][""]}
        res.send(records);
    }
}

exports.bookingDetailsByIDForReport = function(req, res){
    let replacements = {
        id: req.params.id
    }
    
    Sequelize
        .query('EXEC Trans_GetBookDetailsByIDForReport :id',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getPcsListSpclBookingByHawnNo = function(req, res){
    let replacements = {
        secHawnNo: req.params.secHawnNo
    }
    
    Sequelize
        .query('EXEC Tran_getPcsListSpecialBooking :secHawnNo',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}

exports.getConsigneeByPin = async function(req, res) {
    let replacements = {
        zipcode : req.params.pincodeId
    };

    let queryResults = await Sequelize.query('EXEC GetConsigneeByZipcode :zipcode', {replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(queryResults.err){
        let result = { statusBool: 500, message: queryResults.err};
        res.send(result)
    }else{
        let result = { statusBool: 200, data: queryResults };
        res.send(result);
    }
}

exports.getSpecialConsignees = async function(req, res) {

    let queryResults = await Sequelize.query('EXEC Get_specialConsignees', {type: Sequelize.QueryTypes.SELECT});
    if(queryResults.err){
        console.log(queryResults.err);
        let result = { statusBool: 500, message: queryResults.err};
        res.send(result)
    }else{
        console.log(queryResults);
        let result = { statusBool: 200, data: queryResults };
        res.send(result);
    }
}