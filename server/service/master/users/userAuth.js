'use strict'

var Sequelize = require('../../../config/sequelize').getConnection(); 

exports.authenticate = function(email, password, res){
    console.log('inside user Auth:' + email);
    
    var replacements1 = {
        'email':email
    }
    //fetch user and verify
    Sequelize.query('EXEC Master_UserStatus :email', { replacements: replacements1}).then(queryReturn);

    function queryReturn(recs){
        console.log(recs[0][0]);
        res = recs[0];
    }
}