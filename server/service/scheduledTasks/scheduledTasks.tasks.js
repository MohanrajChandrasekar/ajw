'use strict';
var schedule = require('node-schedule');
var autoRunScannable = require('../../service/transactions/agentDelivery/update.agent');
// var config = require('../config/environment');
// var Sequelize = require('../config/sequelize').getConnection();
// var svrOutStanding = require('./outstandingNCEEmail/outstandingNCEEmail');
// var svrDueReminder = require('./dueReminderNCEEmail/dueReminderNCEEmail');
// var svrEnisNCESync = require('./enisNCESync/enisNCESync');
// var svrSubStationSync = require('./subStationSync/subStationSync');

//require('./dueReminderNCEEmail/dueReminderNCEEmail');
//require('./outstandingNCEEmail/outstandingNCEEmail');

schedule.scheduleJob('0 0 * * *', () => {
      console.log('Scheduler Runs.. every 24 hours');
      autoRunScannable.updatePostalAndSameBranchOutscanned();
});




// if (config.isRunScheduler) {
//     console.log('Scheduler is Enabled');
    // try {
    //     Sequelize
    //         .query('EXEC GetOptionsValue :OptionCode', { replacements: { OptionCode: '-1' } })
    //         .then(queryReturnOptions);
    // } catch (ex) {
    //     console.log(ex);
    // }

    // function queryReturnOptions(recsOpt) {
    //     try {

    //         var sSchedulerTaskOutStanding = '00 00 07 * * 1-7';
    //         var sSchedulerTaskNCESync = '00 00 19 * * 1-7';
    //         var sSchedulerTaskDueReminder = '00 00 06 * * 1-7';
    //         var sSchedulerTaskSubStationSync = '00 30 19 * * 1-7'; 

    //         // SAMPLE EXAMPLE
    //         // var dueReminderSchedule = second + ' ' + minute + ' ' + hour + ' * * ' + day;
    //         // var dueReminderSchedule = '30 29 21 * * 0-7';
    //         // var outStandingSchedule = '00 29 18 * * 1-7';

    //         var optionData = recsOpt[0];
    //         if (optionData !== undefined && optionData !== null && optionData.length > 0) {
    //             for (var i = 0; i < optionData.length > 0; i++) {
    //                 if (optionData[i].OptionCode === 'SchedulerTaskOutStanding') {
    //                     sSchedulerTaskOutStanding = optionData[i].OptionValue;
    //                 }

    //                 if (optionData[i].OptionCode === 'SchedulerTaskNCESync') {
    //                     sSchedulerTaskNCESync = optionData[i].OptionValue;
    //                 }

    //                 if (optionData[i].OptionCode === 'SchedulerTaskDueReminder') {
    //                     sSchedulerTaskDueReminder = optionData[i].OptionValue;
    //                 }

    //                 if (optionData[i].OptionCode === 'SchedulerTaskSubStationSync') {
    //                     sSchedulerTaskSubStationSync = optionData[i].OptionValue;
    //                 }
    //             }
    //         }

    //         // OUT STANDING
    //         schedule.scheduleJob(sSchedulerTaskOutStanding, function () { 
    //             Sequelize
    //                 .query('EXEC GetOptionsValue :OptionCode', { replacements: { OptionCode: 'enableOutStandingEmail' } })
    //                 .then((result) => { 
    //                     if (result && result.length > 0 && result[0][0].OptionValue && result[0][0].OptionValue.toLowerCase() === "true") {
    //                         svrOutStanding.scheduleStarted(function (returnResult) {
    //                             console.log('');
    //                         });
    //                     }
    //                 });

    //         });

    //         // DUE REMINDER
    //         schedule.scheduleJob(sSchedulerTaskDueReminder, function () { 
    //             Sequelize
    //             .query('EXEC GetOptionsValue :OptionCode', { replacements: { OptionCode: 'enableDueReminderEmail' } })
    //             .then((result) => {
    //                 if (result && result.length > 0 && result[0][0].OptionValue && result[0][0].OptionValue.toLowerCase() === "true") {
    //                     svrDueReminder.scheduleStarted(function (returnResult) {
    //                     });
    //                 }
    //             }); 
               
    //         });

    //         //ENIS NCE SYNC
    //         schedule.scheduleJob(sSchedulerTaskNCESync, function () {
    //             svrEnisNCESync.scheduleStarted(function (res) {

    //                 console.log(res);
    //             });
    //         });

    //         //SUBSTATION SYNC
    //         schedule.scheduleJob(sSchedulerTaskSubStationSync, function () {
    //             svrSubStationSync.scheduleStarted(function (returnResult) {
    //             });
    //         });

    //     } catch (ex) {
    //         console.log(ex);
    //     }
    // }
// } else {
//     console.log('Scheduler is Disabled');
// }
