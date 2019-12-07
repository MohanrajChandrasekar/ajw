'use strict';

var Sequelize = require('../../../config/sequelize').getConnection(); 

exports.index = function (req, res) {
    console.log(req.body);

   var replacements1 =  req.body;

    Sequelize
        .query('EXEC CreateRole :roleName, :roleDescription, :createdBy',
        { replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        var roleId = recs[0][0].id;
        if(roleId == -1){
            var returnVal = {
                statusBool: -1,
                statusText: 'Role already exists!!'
            };
            res.send(returnVal);
        }
        else{
            var returnVal = {
                statusBool: roleId,
                statusText: 'Saved Successfully!'
            };
            res.send(returnVal);
        }
      
    }; 
};