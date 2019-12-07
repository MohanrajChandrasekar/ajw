'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.address = function (req, res) {
    console.log(req.body);

    var replacements1 = req.body;
    replacements1.createdBy = "admin";
    Sequelize
        .query('EXEC Trans_ChangeAddress :id,:name, :city, :zipCode, :address, :magazine, :contactNumber, :type, :createdBy, :docID',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        let ids=  recs[0][0][""];
        var replacements2 = {
            consigneeId : ids,
            cnNO : replacements1.cnNO
        }
        res.send(JSON.stringify(recs[0]));
        Sequelize
            .query('EXEC Trans_UpdateAddress :consigneeId,:cnNO',
                { replacements: replacements2 })
            .then(returnResult);
    };

    function returnResult(recs) {
        // res.send(JSON.stringify('Updated Successfully'));
    }
};


exports.rebooking = function (req, res) {
    console.log(req.body);
    var replacements1 =  req.body;
    let len = replacements1.length;
    for(var i=0;i<len;i++){
        Sequelize
        .query('EXEC Trans_AllowRebooking :cnNO,:rebookingFlag',{replacements: replacements1[i]})
        .then(queryReturn);
        function queryReturn(recs) {
            console.log('index: ' + i);
            if(i == len){
                console.log(recs);
                res.send(JSON.stringify("Updated Successfully!"));
            }
        };
    }
};

exports.addRebooking = (req, res) => {
    console.log(req.body);
    var replacements = req.body;
    Sequelize
        .query('EXEC Trans_rebookingCNNO :id, :vendorName, :deliveryMFId, :rate, :rtoCharge',{replacements: replacements})
        .then(queryReturn);
    function queryReturn(recs){
        console.log(recs);
        res.send(recs);
    }
}