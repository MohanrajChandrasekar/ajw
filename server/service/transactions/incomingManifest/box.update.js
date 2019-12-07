'use strict'
var event = require('../eventLogger');
var Sequelize = require('../../../config/sequelize').getConnection();

exports.boxInsert = function (req, res) {
    event.logsEvent(req.body, 'ADD - Trans_InsertBoxDetail');

    var replacements1 = req.body;
    replacements1.sumWeight = 0;
    replacements1.sumPcs = 0;
    replacements1.sumWeightKG = 0;
    console.log(replacements1);

    Sequelize
        .query('EXEC Trans_InsertBoxDetail :mfstID, :mfstIncmID, :boxPieces, :pcsWT, :sumWeight, :sumPcs, :sumWeightKG',
            { replacements: replacements1 })
        .then(resultReturn);

    function resultReturn(recs) {
        res.send(JSON.stringify('Updated Successfully!'));
    }
}

exports.boxUpdate = function (req, res) {
    event.logsEvent(req.body, 'UPDATE - Trans_UpdateBoxDetail');

    var replacements1 = req.body;
    console.log(replacements1);

    Sequelize
        .query('EXEC Trans_UpdateBoxDetail :id, :boxPieces, :pcsWtKgs, :pcsWtLBs',
            { replacements: replacements1 })
        .then(resultReturn);

    function resultReturn(recs) {
        res.send(JSON.stringify('Updated Successfully!'));
    }
}

exports.boxDelete = function (req, res) {
    event.logsEvent(req.body, 'DELETE - Trans_DeleteBoxDetailByBoxID');

    var replacements1 = {
        id: req.body.id,
        mfstID: req.body.mfstID,
    }
    replacements1.sumWeight = 0;
    replacements1.sumPcs = 0;
    replacements1.sumWeightKG = 0;

    Sequelize
        .query('EXEC Trans_DeleteBoxDetailByBoxID :id, :mfstID, :sumWeight, :sumPcs, :sumWeightKG',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        res.send(JSON.stringify('Successfully deleted.'));
    };
}

exports.boxUpdateAll = function (req, res) {
    event.logsEvent(req.body, 'UPDATE - Trans_UpdateBoxDetail ALL');

    var replacements1 = req.body;
    let l = replacements1.length;
    let i;
    let m = 0;
    for (i = 0; i < l; i++) {
        let replacements2 = replacements1[i];
        Sequelize
            .query('EXEC Trans_UpdateBoxDetail :id, :boxPieces, :pcsWtKgs, :pcsWtLBs',
                { replacements: replacements2 })
            .then(resultReturn);

        function resultReturn(recs) {
            m++;
            if (m == l) {
                res.send(JSON.stringify('Updated Successfully!'));
            }
        }

    }

}