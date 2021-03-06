'use strict';
var ejs = require('ejs');
var fs = require('fs');
var pdf = require('html-pdf');
var moment = require('moment');

exports.tracking = function (req, res) {
    // console.log('Inside Consignment Tracking doc..');
    var jsonContent = {
        reportName: "CONSIGNMENT TRACKING",
        logo: "",
        printedOn: moment().format('DD-MMM-YYYY'),
    };

    jsonContent.tblData = req.body;
    jsonContent.title = "Consignment Tracking Details";
    jsonContent.tblData[0].refOutMFdate = jsonContent.tblData[0].refOutMFdate === null ? '' : moment(jsonContent.tblData[0].refOutMFdate).format('DD-MM-YYYY');
    jsonContent.tblData[0].refOutMFTime = jsonContent.tblData[0].refOutMFTime === null ? '' : moment(jsonContent.tblData[0].refOutMFTime).format('HH:MM:SS');
    jsonContent.tblData[0].inScannedAT = jsonContent.tblData[0].inScannedAT === null ? '' : moment(jsonContent.tblData[0].inScannedAT).format('DD-MM-YYYY');
    jsonContent.tblData[0].refAgntMFDate = jsonContent.tblData[0].refAgntMFDate === null ? '' : moment(jsonContent.tblData[0].refAgntMFDate).format('DD-MM-YYYY');
    jsonContent.tblData[0].refAgntMFTime = jsonContent.tblData[0].refAgntMFTime === null ? '' : moment(jsonContent.tblData[0].refAgntMFTime).format('HH:MM:SS'); 
    jsonContent.tblData[0].podDelDate = jsonContent.tblData[0].podDelDate === null ? '' : moment(jsonContent.tblData[0].podDelDate).format('DD-MM-YYYY');
    jsonContent.tblData[0].podDelTime = jsonContent.tblData[0].podDelTime === null ? '' : moment(jsonContent.tblData[0].podDelTime).format('HH:MM:SS'); 

    var options = {};

    options = {
        // Export options 
        "directory": "/tmp", // The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp' 
        // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html 
        "format": "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid 
        "orientation": "portrait", // portrait or landscape 
        "margin": "0mm",
        "height": "8.3in", // allowed units: mm, cm, in, px 
        "width": "11.7in",
        // Page options 
        "border": "0mm", // default is 0, units: mm, cm, in, px 
        "margin-left": "0mm",
        "margin-right": "0mm",
        "margin-top": "0mm",
        "footer": {
            "height": "15mm",
            "contents": {
                // default: '<table class=\'tdCustom\'  style=\'font-size:8pt;border:0;margin-top:0pt;margin-left:30px;\'><tr><td class=\'tdCustom\'>Generated by cuteTime.</td><td class=\'tdCustom\' style=\'width:90pt; text-align:left\'>Print Date:</td><td class=\'tdCustom\' style=\'width:70pt; text-align:left\'></td><td class=\'tdCustom\' style=\'width:100pt; text-align:left\'>Approved By:</td><td class=\'tdCustom\' style=\'width:70pt; text-align:left\'></td><td class=\'tdCustom\' style=\'width:70pt; text-align:left\'>Approved Date:</td><td class=\'tdCustom\' style=\'width:70pt; text-align:left\'></td><td class=\'tdCustom\' style=\'width:150pt; text-align:right\'>Page {{page}} of {{pages}}</td></tr></table>'
            }
        },
        // Rendering options 
        "base": "file:///home/www/your-asset-path", // Base path that's used to load files (images, css, js) when they aren't referenced using a host 
        // Zooming option, can be used to scale images if `options.type` is not pdf 
        "zoomFactor": "1", // default is 1 
        // File options 
        "type": "pdf"
        //"phantomPath": "file:///D:/Utils/phantomjs-2.1.1-windows/bin/"
    };

    options.header = {
        "height": "25mm"
    };

    var cnNO = require('../barcode/barcode.read');
    var barcode = cnNO.base64data;
    jsonContent.barcode = barcode;

    fs.readFile('service//report//header//barcodeHeader.html', 'utf8', headerReadResponse);

    function headerReadResponse(err, htmldata) {
        options.header.contents = ejs.render(htmldata, jsonContent);
        fs.readFile('service//report//footer//footer.html', 'utf8', footerReadResponse);
    }

    function footerReadResponse(err, htmldata) {
        options.footer.contents = ejs.render(htmldata, jsonContent);
        fs.readFile('service//report//html//tracking.html', 'utf8', bodyReadResponse);
    }

    var expectedContent;
    function bodyReadResponse(err, htmldata) {
        expectedContent = ejs.render(htmldata, jsonContent);
        var url = 'test.pdf';
        pdf.create(expectedContent, options).toFile(url, function (err, stream) {

            if (err) return console.log(err);

            var file1 = fs.createReadStream(url);
            var stat = fs.statSync(url);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Accept', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
            file1.pipe(res);
        })
    }

};