'use strict'

var Sequelize = require('../../../config/sequelize').getConnection(); 
var event = require('../eventLogger');

exports.deleteOutgoing = function (req, res) {
    event.logsEvent(req.body,'DELETE - Trans_DeleteOutgoingPacketManifestByMfId');
    console.log(req.body);
    var replacements1 =  req.body;

    Sequelize
        .query('EXEC Trans_DeleteOutgoingPacketManifestByMfId :refOutMfID',
        { replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        // res.send(recs[0]);
        res.send(JSON.stringify('Successfully Deleted!'));
    }; 
};