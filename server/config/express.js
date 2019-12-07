var express = require('express'); 
var bodyParser = require('body-parser');  
var path = require('path');
var passport = require('passport');
var jsonwebtoken = require('jsonwebtoken');
// var LocalStrategy = require('passport-local').Strategy;

//var busboyBodyParser = require('busboy-body-parser');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(path.normalize(__dirname + '/../..'), 'www')));
app.set('appPath', 'www');
//app.use(busboyBodyParser());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Cache-Control', 'no-cache');
    // console.log(req.)
    // if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    //     jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'ajw', function(err, decode) {
    //         if (err) {
    //             return res.status(401).json({message: 'Unauthorized user!'});
    //         }
            
    //     });
    // } else if (req.url === '/api/master/user/login') {
    //     next();
    // } else {
    //     return res.status(401).json({message: 'Unauthorized user!'});
    // }
    next();
});
require('./morgan.js')(app);
require('./routes.js')(app);

exports.app = app;