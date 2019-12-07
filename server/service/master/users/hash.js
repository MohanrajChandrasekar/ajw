// 'use strict';
// var crypto = require('crypto');
// var Sequelize = require('../../../config/sequelize').getConnection();

// var bcrypt = require('bcrypt');


// var hashPwd = function (pwd) {
//     var data = {
//         salt: '',
//         passwordHash: ''
//     };
//     var salt = bcrypt.genSaltSync(10);
//     console.log(salt);
//     var hash = bcrypt.hashSync(pwd, salt);
//     console.log(hash);
//     data.salt = salt;
//     data.passwordHash = hash;
//     return data;
// }

// // exports.verify = function (hash, pwd) {
// //     var result = bcrypt.compareSync(pwd, hash); // true
// //     console.log(result);
// //     return result;
// // }



// exports.saltHashPassword = function (userpassword) {
//     var data = hashPwd(userpassword);
//     console.log('after return:' + data.passwordHash);
//     return data;
// }

// // exports.verifyPassword = function (userEmail, pwd) {
// //     // var hashed;
// //     var replacements1 = {
// //         'userEmail': userEmail
// //     };

// //     var result = '';
// //     console.log(result);
// //     Sequelize.query('EXEC Master_userPasswordSalt :userEmail', { replacements: replacements1 }).then(queryReturn);
// //     function queryReturn(recs) {
// //         console.log(recs[0][0]);
// //         var hashed = recs[0][0].password;
// //         var result = verify(hashed, pwd);
// //         console.log('final Result:' + result);

// //     }
// //     return result;
// // }

