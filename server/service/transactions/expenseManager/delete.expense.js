'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');

exports.index = async function (req, res) {
    console.log(req.body);
    event.logsEvent(req.body,'DELETE - DeleteExpenseBill');
    var replacements = req.body;

    try {
       var response = await Sequelize.query('EXEC DeleteExpenseBill :id,:updatedBy',{ replacements: replacements});
       console.log(response);
        var returnRes = { status: 200, response };
        res.send(returnRes);
    }catch(err){
        console.log(err);
        var returnRes = { status: 500, err };
        res.send(returnRes); 
    }

};
