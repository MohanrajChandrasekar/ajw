'use strict';

var Sequelize = require('../../../config/sequelize').getConnection();
var passport = require('../../../config/passport');
var bcrypt = require('bcrypt');

function verify(hash, pwd) {
    var result = bcrypt.compareSync(pwd, hash); // true
    console.log(result);
    return result;
}
exports.index = function (req, response) {
    console.log(req.body);

    var replacements1 = req.body;

    var replacements = {
        loginId: replacements1.loginId
    };

    Sequelize.query('EXEC GetUserByLoginName :loginId', { replacements: replacements }).then(function (res, err) {

        if (res[0][0]) {
            var hashed = res[0][0].password;
            var result = verify(hashed, replacements1.oldPassword);
            if (result == true) {

                var passwordData = passport.saltHashPassword(replacements1.newPassword);

                var replacementData = {
                    password: passwordData.passwordHash,
                    salt: passwordData.salt,
                    loginId: replacements1.loginId,
                    updatedBy: ''
                }

                Sequelize
                    .query('EXEC ChangePassword :loginId, :password, :salt, :updatedBy',
                        { replacements: replacementData })
                    .then(queryReturn);
                function queryReturn(recs) {
                    response.send(JSON.stringify("Updated Successfully!"));
                };
            }
        } 
    });


};