'use strict';
var Sequelize = require('sequelize');
var config = require('./environment');
var connection;


init();

function init() {
    try {
        connection = new Sequelize(config.msSqlDbName, 'sa', 'Cute@123', {
            host: config.msSqlSerName,
            dialect: 'mssql',
            dialectOptions: {
                "instanceName": "MSSQLSERVER2014"
            },
            pool: {
                max: 5,
                min: 0,
                idle: 100000
            }
        });

    } catch (ex) {
        console.log(ex);
    }
}

exports.getConnection = function () {

    if (connection === undefined || connection === null) {
        init();
    }

    return connection;
};
