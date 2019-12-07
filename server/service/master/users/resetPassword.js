'use strict';
var Sequelize = require('../../../config/sequelize').getConnection();
var bcrypt = require('bcrypt');
var passport = require('../../../config/passport');
var generator = require('generate-password');
var emailer = require('../../users/userEmail');

exports.index = function (req, res) {
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    var replacements = req.body;
    replacements.pwd = password;
    var passwordData =passport.saltHashPassword(password);
    replacements.password = passwordData.passwordHash;
    replacements.salt = passwordData.salt;
    replacements.updateBy = '';
    replacements.reset = true;

    Sequelize
        .query('EXEC ResetPassword :id,:salt,:password,:updateBy',{ replacements: replacements })
        .then(queryReturn);

    function queryReturn(recs) {
        emailer.sendEmail(replacements);
        res.send(JSON.stringify("Reset password Successfully!"));
    };
};