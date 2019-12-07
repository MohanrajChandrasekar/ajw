'use strict';

var path = require('path');
module.exports = function (app) {

    app.use('/api/master/office', require('../service/master/office'));
    app.use('/api/master/city', require('../service/master/city'));
    app.use('/api/master/code_gen', require('../service/master/code_gen'));
    app.use('/api/master/zone', require('../service/master/zone'));
    app.use('/api/master/user', require('../service/master/users'));
    app.use('/api/master/mode', require('../service/master/mode'));
    app.use('/api/master/pincode/ratemaster', require('../service/master/pincode/ratemaster'));
    app.use('/api/master/pincode/service', require('../service/master/pincode/service'));
    app.use('/api/master/pincode', require('../service/master/pincode'));
    app.use('/api/master/book_issue', require('../service/master/book_issue'));
    app.use('/api/master/shipper', require('../service/master/shipper'));
    app.use('/api/master/state', require('../service/master/state'));
    app.use('/api/master/currency', require('../service/master/currency'));
    app.use('/api/master/email', require('../service/master/email'));
    app.use('/api/master/employee', require('../service/master/employee'));
    app.use('/api/master/coloader', require('../service/master/coloader'));
    app.use('/api/master/coloaderRate', require('../service/master/coloaderRate'));
    app.use('/api/master/specialConsignee', require('../service/master/specialConsignee'));
    // app.use('/api/master/user', require('../service/master/user/auth'));
    app.use('/api/master/customer', require('../service/master/customer'));
    app.use('/api/master/company', require('../service/master/company'));
    app.use('/api/master/deliveryCategory', require('../service/master/deliveryCategory'));
    app.use('/api/transaction/income/manifest', require('../service/transactions/incomingManifest'));
    app.use('/api/master/roles', require('../service/master/roles'));
    app.use('/api/log', require('../service/logger'));
    app.use('/api/navigationList', require('../service/navigationList'));
    app.use('/api/transaction/income/jobplanner', require('../service/transactions/jobPlanner'));
    app.use('/api/master/document', require('../service/master/document'));
    app.use('/api/master/magazine', require('../service/master/magazine'));
    app.use('/api/master/consignorConsignee', require('../service/master/consignorConsignee'));
    app.use('/api/transaction/booking', require('../service/transactions/bookingDetails'));
    app.use('/api/dashboard', require('../service/dashboard'));
    app.use('/api/transaction/agent', require('../service/transactions/agentDelivery'));
    app.use('/api/transaction/outgoingPacketManifest', require('../service/transactions/outgoingPacketManifest'));
    app.use('/api/transaction/tracking', require('../service/transactions/consignmentTracking'));
    app.use('/api/master/agent', require('../service/master/agent'));
    app.use('/api/user', require('../service/users'));
    app.use('/api/master/doc', require('../service/report'));
    app.use('/api/barcode',require('../service/barcode'));
    app.use('/api/master/expenses',require('../service/master/expenses'));
    app.use('/api/transaction/expenses', require('../service/transactions/expenseManager'));
    app.use('/api/transaction/specialbooking', require('../service/transactions/specialBooking'));
    app.use('/api/transaction/failedCnnoHandling', require('../service/transactions/failedCnnoHandling'));
    app.use('/api/transaction/misrouted', require('../service/transactions/misroutedShipments'));
    app.use('/api/master/specialConsignee', require('../service/master/specialConsignee'));

    app.route('/*')
        .post(function (req, res) {
            console.log(req);
            res.sendFile(path.join(path.normalize(__dirname + '/../..'), 'www//index.html'));
        });

};
