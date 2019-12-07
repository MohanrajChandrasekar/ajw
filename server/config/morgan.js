'use strict';

var config = require('../config/environment');
var morgan = require('morgan');
var fs = require('fs')
var logger = require('morgan');
var path = require('path');
//var mongoMorgan = require('mongo-morgan');

module.exports = function (app) {
    if (config.morgon.showInConsole) {

        // var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

        // setup the logger
        // app.use(morgan('combined', { stream: accessLogStream }))

        app.use(morgan('combined'));

        // app.use(morgan('dev', {
        //     skip: function (req, res) {
        //         return res.statusCode < 400
        //     }, stream: process.stderr
        // }));
        
        // app.use(morgan('dev', {
        //     skip: function (req, res) {
        //         return res.statusCode >= 400
        //     }, stream: process.stdout
        // }));
        
        // app.get('/', function (req, res) {
        //     logger.debug('Debug statement');
        //     logger.info('Info statement');
        //     res.send('Hello World!');
        // });
        // app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}', {stream: accessLogStream}));
   
      
    }
    /*app.use(mongoMorgan(config.mongoDB.auditURL, ':date[iso]\t:method\t:status\t:response-time\t:url\t:user-agent\t:remote-addr\t:referrer }', {
        collection: 'httpLogs'
    }));*/


    //':date[iso]\t:method\t:status\t:response-time\t:url\t:user-agent\t:remote-addr\t:referrer }'
    // app.use(mongoMorgan(config.mongoDB.auditURL, json({
    //     date: ':date[iso]',
    //     method: ':method',
    //     status: ':status',
    //     length: ':res[content-length]',
    //     'response-timeMs': ':response-time ms',
    //     'response-time': ':response-time',
    //     'remote-addr': ':remote-addr',
    //     'url': ':url',
    //     'referrer': ':referrer',

    //     'user-agent': ':user-agent',
    // }), {
    //         collection: 'httpLog'
    //     }));
};
