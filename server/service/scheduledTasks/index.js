'use strict';
var schedule = require('node-schedule');
var autoRunScannable = require('../../service/transactions/agentDelivery/update.agent');

if (process.env.NODE_ENV === "production") {
      schedule.scheduleJob('* */30 * * * *', async function () {
            let result = await autoRunScannable.autoUpdateInScanAndAgentDelvMF_ONLY_EXPRESS_SPCLCNNO();
            console.log(result);
      });

      schedule.scheduleJob('* */30 * * * *', async function() {
            let result = await autoRunScannable.autoUpdateInScanAndAgentDelvMF_POSTAL_ONLY();
            console.log(result);
      });
}