'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.index = async function (req, res) {
    console.log(req.body);
    var replacements = req.body;
    event.logsEvent(req.body,'CREATE - InsertExpenseBill');

    try{
        var response = await Sequelize.query('EXEC InsertExpenseBill :mawbNo, :customsDA, :ifChargesAO, :mfWeight, :chargesAAI, :chargesAO, :customsDuty, :commisionDD, :chargesUnitechCHA, :paletesReceived, :chargesPacking, :noOfPaletes, :chargesDelivery, :chargesService, :chargesAddedService, :chargesOthers, :chargesOthers1236, :chargesFreight, :chargesTotal, :currency, :createdBy',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
        console.log(response);
        var returnRes = { status: 200, response };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes);
    }

};
