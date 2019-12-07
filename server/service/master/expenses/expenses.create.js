'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    var replacements1 = req.body;

    var p = new Promise((resolve, reject) => {
        Sequelize.query('EXEC Master_InsertExpensesDetails :expenseCategory, :description, :createdBy',
            { replacements: replacements1 })
            .then(result => {
                return resolve(result);
            })
            .catch(err => {
                return reject(err);
            });
    })

    p.then(rec => {
        var id = rec[0][0].id;
        if (id == -1) {
            var returnVal = {
                statusBool: -1,
                statusText: 'Expense Category Already Exists'
            };
            res.send(returnVal);
        }
        else {
            var returnVal = {
                statusBool: 1,
                statusText: 'Saved Successfully'
            };
            res.send(returnVal);
        }
    });
};

