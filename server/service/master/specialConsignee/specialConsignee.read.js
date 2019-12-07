'use strict'

var sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);
        sequelize
          .query('EXEC Get_specialConsignees')
          .then(queryReturn);

          

    function queryReturn(recs) {
        res.send(recs[0]);
    };
    
};    

exports.indexById = function (req, res) {
    console.log(req.body);

    var replacements1 = {
        id: req.params.id
    };
    sequelize
        .query('EXEC Get_specialConsigneesById :id',
          {replacements: replacements1})   
          .then(queryReturn);

        
    function queryReturn(recs) {
        res.send(recs[0][0]);
    };
    
};    
    