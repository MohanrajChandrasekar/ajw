'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();

// console.log(Sequelize);

exports.index = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC GetLoginHistory :userName, :startTime , :endTime')
        .then(queryReturn);

    function queryReturn(recs) {
        // console.log(recs[0]);
        res.send(recs[0]);
    };

};


exports.create = function (params, callback) {  
    Sequelize
        .query('EXEC InsertLoginHistory :userName, :activityStatus, :applicationURL',
            { replacements: params })
        .then(callback); 
 
};



