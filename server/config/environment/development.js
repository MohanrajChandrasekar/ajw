'use strict';

module.exports = {

    // Server port
    port: 6016,

    //Log file path

    //Morgon
    morgon: {
        showInConsole: true,
        writeInFile: true
    },

    ishttps: false,
    msSqlSerName: 'localhost',
    msSqlDbName: 'ajwPRO',

    //Auditlog
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
    },

    invalidLogInAttemptCount: 5,

    maxlockingDay: 30,

    //Mobile version
    minimumMobVersion: '1.3.2',

};
