'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    var replacements1 = req.body;

    var p = new Promise((resolve, reject) => {
        Sequelize.query('EXEC Master_DeleteBranchDetails :id,:updatedBy',
        { replacements: replacements1})
            .then(result => {
                return resolve(result);
            })
            .catch(err => {
                return reject(err);
            });
    })

    p.then(rec => {
        res.send(JSON.stringify('Deleted Successfully!'));
    }); 


};
