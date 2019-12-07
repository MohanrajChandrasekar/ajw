'use strict';
var Sequelize = require('../../config/sequelize').getConnection();

exports.logsEvent = function(json, key){
    
    let replacements = {jsonReq: JSON.stringify(json), key: key};

    Sequelize
        .query('EXEC Trans_InsertEventLogs :jsonReq, :key',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs){
        console.log(recs);
    }
}