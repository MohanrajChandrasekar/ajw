var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var svrAuth = require('../service/master/users/userAuth');
var Sequelize = require('../config/sequelize').getConnection();
//var hash = require('../service/master/users/hash');
var loginHistory = require('../service/master/users/loginHistory');
var bcrypt = require('bcrypt');

var hashPwd = function (pwd) {
    var data = {
        salt: '',
        passwordHash: ''
    };
    var salt = bcrypt.genSaltSync(10);
    console.log(salt);
    var hash = bcrypt.hashSync(pwd, salt);
    console.log(hash);
    data.salt = salt;
    data.passwordHash = hash;
    return data;
}

exports.saltHashPassword = function (userpassword) {
    var data = hashPwd(userpassword);
    console.log('after return:' + data.passwordHash);
    return data;
}
passport.use(new LocalStrategy(
    {
        usernameField: 'loginId',
        passwordField: 'password'
    },


    function (loginId, password, done) {
        verify = function (hash, pwd) {
            var result = bcrypt.compareSync(pwd, hash); // true
            console.log(result);
            return result;
        }

        var replacements = {
            'loginId': loginId
        };

        Sequelize.query('EXEC GetUserByLoginName :loginId', { replacements: replacements }).then(function (res, err) {
            var loginHistoryParams = {
                'userName': loginId,
                'applicationURL': ''
            };


            if (!res[0][0]) {
                loginHistoryParams.activityStatus = 'F';
                var lock = loginHistory.create(loginHistoryParams, function () {
                    return done(-1, false, { message: "Couldn't find your User Account" })
                });
            } else {
                if (res[0][0].isLocked == true) {
                    return done(-3, { message: 'please contact admin.' })
                }

                let body = res[0];
                // let branchName = res[0][0].branchName;
                // let roleId = res[0][0].roleId;
                // let roleName = res[0][0].roleName;
                // module.exports.branchId = branchId;
                // module.exports.branchName = branchName;
                // module.exports.roleId = roleId;
                module.exports.body = body;

                var hashed = res[0][0].password;
                var result = verify(hashed, password);
                if (!result) {
                    loginHistoryParams.activityStatus = 'F';
                } else {
                    loginHistoryParams.activityStatus = 'S';
                }
                var lock = loginHistory.create(loginHistoryParams, function () {
                    if (!result) {
                        return done(-2, false, { message: 'Incorrect Password.' });
                    } else {
                        return done(true);
                    }
                });
            }
        });
    }
));
