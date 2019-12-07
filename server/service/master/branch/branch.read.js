'use strict'

var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    var p = new Promise((resolve, reject) => {
        Sequelize.query('EXEC Master_GetBranchDetails')
        .then(result => {
            return resolve(result);
        })
        .catch(err =>{
            return reject(err);
        });    
    })
    p.then(rec =>{
        res.send(rec[0])
    });
      
}

exports.indexById = function(req, res) {
    console.log(req.body);
    
    var replacements1 = {
        id: req.params.id
    };

    var p = new Promise((resolve, reject) => {
    Sequelize.query('EXEC Master_GetBranchDetailById :id',
            {replacements : replacements1})
        .then(result=>{
            return resolve(result);
        })
        .catch(err =>{
            return reject(err);
        });    
    })
    p.then(rec =>{
        res.send(rec[0][0])
    });
      
}