'use strict'

var Sequelize = require('../../config/sequelize').getConnection();
const fs = require('fs');
var dateTime = require('node-datetime');

exports.index = function(req, res){
    console.log(req.body);
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    
    var log = "\n Logged at:" + formatted +  ", URL:" + req.body.url + ",\n Error Message: " + req.body.error + "\n <<================================ END ==============================>> \n";
    fs.appendFile('log/log.txt', log, function (err) {
        if (err) {
            // append failed
            res.send(JSON.stringify('Write to log failed!'));
        } else {
            // done
            res.send(JSON.stringify('Logged Successfully!'));
        }
    });
};

exports.logOutLogger = async (req, res) => {
    const replacements = req.body;
    try{
        const result = await Sequelize.query('EXEC Update_UserLogout :userName', {replacements: replacements});
        const params = {status: 200, msg: 'Successfully Logged Out!'};
        res.send(params);
    } catch (err) {
        const params = {status: 500, err};
        res.send(params);
    }
};  