'use strict';

var Sequelize = require('../../../config/sequelize').getConnection(); 

exports.index = function (req, res) {
    console.log(req.body);

   var replacements1 =  req.body;

    Sequelize
        .query('EXEC Master_InsertEmployeeDetails :empCode, :empName, :empAddress1, :empAddress2, :empPhone, :empEmail, :empGender, :empBloodGrp, :empDOB, :empDOJ, :empDEPT, :empDSG, :empStatus, :empDOR, :empRepOfficeType, :empRepOffice,:createdBy',
        { replacements: replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        
        // res.send(recs[0]);
        res.send(JSON.stringify("Saved Successfully!"));
    }; 
};