'use strict'
var Sequelize = require('../../config/sequelize').getConnection();
exports.index = function (req, res) {
    console.log(req.body);
    Sequelize
        .query('EXEC GetAllNavigationList')
        .then(queryReturn);

    function queryReturn(recs) {
        // console.log(recs[0]);
        var navList = recs[0];
        var parentNav = recursive(navList, null);
        res.send(parentNav);
    };
    function recursive(navList, id) {
        var naviList = navList;
        var parentNav = naviList.filter(nav => nav.parentId == id);
        for (var i = 0; i < parentNav.length; i++) {
            parentNav[i].children = recursive(naviList, parentNav[i].id)
        }
        return parentNav;
    }

};

exports.indexById = function(req, res) {
    console.log(req.body);
    var replacements1 = {
        LoginId: req.params.LoginId
    };
    Sequelize
        .query('EXEC GetNavigationListByLoginId :LoginId',
            {replacements : replacements1})
        .then(queryReturn);
    function queryReturn(recs) {
        var navList = recs[0];
        var parentNav = recursive(navList, null);
        res.send(parentNav);
    };
    function recursive(navList, id) {
        var naviList = navList;
        var parentNav = naviList.filter(nav => nav.parentId == id);
        for (var i = 0; i < parentNav.length; i++) {
            parentNav[i].children = recursive(naviList, parentNav[i].id)
        }
        return parentNav;
    }
};
