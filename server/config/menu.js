"use strict"

module.exports = {

    headerMenu: [
        {
            "text": "Masters",
            "href": "#",
            "heading": "true",
            "icon": "fa  fa-university",
            "submenu": [
                {
                    "text": "Inspection",
                    "href": "/#/inspection",
                    "sref": "inspection",
                    "icon": "fa fa-search",
                    "translate": "sidebar.nav.menu.GENERALAUDITREPORT",
                    "module": "master",
                    "permission": "question"
                },
                {
                    "text": "Inspection View",
                    "href": "/#/inspectionView",
                    "sref": "inspectionView",
                    "icon": "fa fa-indent",
                    "translate": "sidebar.nav.menu.GENERALAUDITREPORT",
                    "module": "master",
                    "permission": "question"
                },
                {
                    "text": "Options",
                    "href": "/#/options",
                    "sref": "options",
                    "icon": "fa fa-cog",
                    "translate": "sidebar.nav.menu.GENERALAUDITREPORT",
                    "module": "master",
                    "permission": "question"
                }
            ]
        },
        {
            "text": "Admin",
            "href": "#",
            "heading": "true",
            "icon": "fa fa-user",
            "submenu": [
                {
                    "text": "Users",
                    "href": "/#/userManagement",
                    "sref": "userManagement",
                    "icon": "fa fa-users",
                    "translate": "sidebar.nav.menu.STRIKINGPOINTBYUSER",
                    "module": "userManagement",
                    "permission": "user"
                },
                {
                    "text": "Roles",
                    "href": "/#/roleManagement",
                    "sref": "roleManagement",
                    "icon": "fa fa-user",
                    "translate": "sidebar.nav.menu.STRIKINGPOINTBYUSER",
                    "module": "userManagement",
                    "permission": "role"
                },
                {
                    "text": "Permissions",
                    "href": "/#/permission",
                    "sref": "permission",
                    "icon": "fa fa-check-square-o",
                    "translate": "sidebar.nav.menu.STRIKINGPOINTBYUSER",
                    "module": "userManagement",
                    "permission": "permission"
                }
            ]
        }
    ]

};
