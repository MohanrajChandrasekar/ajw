'use strict';

var Sequelize = require('../../../config/sequelize').getConnection(); 

exports.index = function (req, res) {
    console.log(req.body);

    var roleIdx = 0;
   var replacements1 =  req.body;
   console.log(replacements1);


    Sequelize
    .query('EXEC UpdateUserDetails :id, :loginId, :userName,:userEmail,:branchId,:password,:updatedBy',
        { replacements: replacements1})
        .then(onSuccess);

    function onSuccess(recs) {

      
    Sequelize
    .query('EXEC DeleteUserRoles :id',
    {replacements: replacements1})
    .then(onDeleteSuccess);

    function onDeleteSuccess(recs) {
        var userRole = replacements1.selectedRoles;
        var updatedBy = replacements1.updatedBy;
        userRole.forEach(roleId => {
            console.log(recs);
            var userId = replacements1.id;
            var roleId = roleId;
            var userName = updatedBy;

            var replacements = {
                userId: userId,
                roleId: roleId,
                userName: userName,
            }
            Sequelize
                .query('EXEC UpdateUserRoles :userId,:roleId,:userName',
                    { replacements: replacements })
                .then(queryReturn);
        });
        
    }
        
    };

    function queryReturn(recs) {
        roleIdx = roleIdx + 1;
        if (replacements1.selectedRoles.length == roleIdx) {
            res.send(JSON.stringify("Updated Successfully!"));
        }
    };
};


