'use strict';
var hash = require('./hash');
var passport = require('../../../config/passport');
var Sequelize = require('../../../config/sequelize').getConnection();
var generator = require('generate-password');
var mailer = require('../../users/userEmail');

exports.index = function (req, res) {
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    var roleIdx = 0;
    var replacements1 = req.body;
    var passwordData = passport.saltHashPassword(password);
    replacements1.password = passwordData.passwordHash;
    replacements1.salt = passwordData.salt;
    replacements1.pwd = password;
    Sequelize
        .query('EXEC InsertUser :userName, :loginId,:branchId,:salt, :password, :userEmail, :createdBy',{ replacements: replacements1 })
        .then(onSuccess);

    function onSuccess(recs) {
        var userId = recs[0][0].id;
        if (userId == -1) {
            var returnVal = {
                statusBool: -1,
                statusText: 'LoginId/Email Address already exists'
            };
            res.send(returnVal);
        }else{
            var userRole = replacements1.selectedRoles;
            var createdBy = replacements1.createdBy;
            userRole.forEach(roleId => {
                var roleId = roleId;
                var userName = createdBy;
                var replacements = {
                    userId: userId,
                    roleId: roleId,
                    userName: userName,
                }
                Sequelize
                    .query('EXEC InsertUsersRole :userId,:roleId,:userName',{ replacements: replacements })
                    .then(queryReturn);
            });
        }
    };

    function queryReturn(recs) {
        roleIdx = roleIdx + 1;
        var returnVal = {
            statusBool: 1,
            statusText: "Saved Successfully!"
        };
        mailer.sendEmail(replacements1);
        if (replacements1.selectedRoles.length == roleIdx) {
            res.send(returnVal);
        }
    };
};
