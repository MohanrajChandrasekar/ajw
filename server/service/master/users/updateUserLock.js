'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    var replacements1 = req.body;
    replacements1.updateBy='';
    Sequelize
        .query('EXEC UpdateUserLock :id,:isLocked, :updateBy',
            { replacements: replacements1 })
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);

        // res.send(recs[0]);
        res.send(JSON.stringify("Updated Successfully!"));
    };
};