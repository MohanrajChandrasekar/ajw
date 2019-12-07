'use strict'
var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.addDelivery = function(req, res){
    console.log(req.body);
    event.logsEvent(req.body,'CREATE - Trans_InsertDeliveryDetails');

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
        delCode: replacements[i].CODE,
        podCreatedBy: replacements[i].podCreatedBy
    } 
    Sequelize
        .query('EXEC Trans_InsertDeliveryDetails :cnNO, :delStatus, :reason, :delSign, :delTime, :delDate, :delCode, :podCreatedBy',{replacements: placements, type: Sequelize.QueryTypes.SELECT})
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