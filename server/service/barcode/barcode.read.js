'use strict'
const bwipjs = require('bwip-js');
exports.index = function (req, res) {
    console.log(req.body);

    let cnNO = req.params.cnNO
    try {
        bwipjs.toBuffer({
            bcid: 'code128',       // Barcode type
            text: cnNO,    // Text to encode
            scale: 3,               // 3x scaling factor
            height: 10,              // Bar height, in millimeters
            includetext: true,            // Show human-readable text
            textxalign: 'center',        // Always good to set this
        }, function (err, png) {
            if (err) {
                console.log(err);
                res.send(err);
                // Decide how to handle the error
                // `err` may be a string or Error object
            } else {
                console.log(png);
                let base64data = png.toString('base64');
                res.send(base64data);
                module.exports.base64data = base64data;
                // `png` is a Buffer
                // png.length           : PNG file length
                // png.readUInt32BE(16) : PNG image width
                // png.readUInt32BE(20) : PNG image height
            }
        });
    }
    catch (ex) {
        console.log(ex);
    }

};

