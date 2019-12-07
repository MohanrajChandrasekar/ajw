'use strict';

module.exports = {

    // Server port
    port: 4000,

    //Log file path

    //Morgon
    morgon: {
        showInConsole: true,
        writeInFile: true
    },

    //MongoDB
    mongoDB: { 
        url: 'mongodb://localhost/cuteOfficeTest',
        auditURL: 'mongodb://localhost/cuteOfficeLogTest',
        file: { dbName: "cuteOfficeFileTest", host: "localhost", port: 27017 },
        option: { server: { poolSize: 10 } }

    },
    format: {
        time: 'HH:mm',
        dateTime: 'DD/MM/YYYY HH:mm:ss',
        day: 'dddd',
        date: 'DD/MM/YYYY',
        hour: 'hh',
        changeDate: 'MM-DD-YYYY',
        dayTrim: 'ddd',
        dateYr: "YYYY-MM-DD",
        dateYrTime: "YYYY-MM-DD hh:mm:ss",
        date12Hr: 'DD/MM/YYYY HH:mm A'
    }
};
