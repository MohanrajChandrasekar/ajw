var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var Sequelize = require('../../../config/sequelize').getConnection();
var jwt = require('jsonwebtoken');
var pp = require('../../../config/passport');
//var password = require('password-hash-and-salt');


exports.validUser = function (req, res, next) {
    console.log(req.body);
    loginId = req.body.loginId;
    
    var user = {
        user: loginId,
        pwd: req.body.password,

    }
    passport.authenticate('local', (result) => {

        console.log(result);
        if (result < 0) {
            if (result == -1) {
                res.status(500);
                res.send({ statusBool: false, message: "Couldn't find your User Account" });
                return;
            }

            if (result == -2) {
                res.status(500);
                res.send({ statusBool: false, message: "Wrong password. Try again or Contact admin to reset it." });
                return;
            }
            if (result == -3) {
                res.status(500);
                res.send({ statusBool: false, message: "please contact admin." });
                return;
            }
        } else {
            if (result == null || result == undefined) {
                res.status(500);
                res.send({ statusBool: false, message: "Incorrect Username or Password." });
                return;
            }
            var body = pp.body;
            var role = [];
            var roleName = [];
            var i=0;
            body.forEach(element => {
                var ele = { roleId: element.roleId, roleName: element.roleName,i:i };
                role[i] = ele.roleId;
                i=i+1;
                console.log(element);
            });

           // only include items with even id's
            var tkn = jwt.sign({ user }, 'ajw');
            console.log(tkn);
            res.status(200);
            res.send({ statusBool: true, message: "Successfully Logged In!", token: tkn, userName: loginId, branchId: body[0].branchId, branchName: body[0].branchName, roleId: role, id: body[0].id });
            return;

        }

        // res.status(result.statusHttp);
        res.send(result);
    })(req, res, next)

};
//
