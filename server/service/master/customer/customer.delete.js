'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);
    var replacement = req.body;
    var customerDeleteInfo = {
        id: replacement.id,
        userName: ''
    }


    Sequelize
        .query('EXEC Master_DeleteCustomerDetail :id, :userName',
            { replacements: customerDeleteInfo })
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0]);
    };
};