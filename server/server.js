"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var _ = require('underscore');
var config = require('./config/environment');
var app = require('./config/express.js').app;
require('./config/winston.js');
require('./config/sequelize.js'); 
require('./config/passport.js');
//require('./config/nodemailer.js');
require('./service/scheduledTasks/index');
// var cron = require('node-cron');

var server;
if (config.ishttps) {
    const fs = require('fs');
    //convert passphrase from base64 to string
    var passphrase = new Buffer(config.httpsPassphrase, 'base64').toString('ascii');

    const options = {
        pfx: fs.readFileSync(config.httpsPfxLoc),
        passphrase: passphrase
    };
    server = require('https').createServer(options, app);
} else {
    server = require('http').createServer(app);
}

//require('http').createServer(app);


server.listen(config.port, function() {
    var port = server.address().port;
    console.log('Application running in \'%s\' mode and listening at port \'%s\'', process.env.NODE_ENV, port);
});

module.exports = server;
