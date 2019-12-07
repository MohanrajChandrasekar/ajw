'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();
var event = require('../eventLogger');
var promise = require('promise');

exports.updateOutgoingPacketManifest = function (req, res) {
    event.logsEvent(req.body, 'UPDATE - Trans_GetIDForOutgoingPacketManifest');
    console.log(req.body);
    let replacements = req.body;
    Sequelize
        .query('EXEC Trans_GetIDForOutgoingPacketManifest', { type: Sequelize.QueryTypes.SELECT })
        .then(getQueryRtrn)

    function getQueryRtrn(recs) {
        console.log(recs[0]['']);
        let iterations = 0;

        for (let i in replacements) {
            replacements[i].refOutMFdate = null;
            replacements[i].refOutMFTime = null;
            Sequelize
                .query('EXEC  Trans_UpdateOutgoingPacketManifestByMfId  :id, :refOutMfID, :refOutDestOffcId, :refOutMFdate, :refOutMFTime, :refOutRemarks, :refOutColoaderID, :refOutColoaderRate, :refOutAddStatus, :createdBy', { replacements: replacements[i], type: Sequelize.QueryTypes.SELECT })
                .then(queryReturn);

            function queryReturn(recs) {
                if (iterations == replacements.length - 1) {
                    res.send(recs);
                }
                iterations++;
            }
        }
    }
}