'use strict'

var Sequelize = require('../../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    console.log(req.body);

    Sequelize
        .query('EXEC Master_GetPincodeServiceDetails')
        .then(queryReturn);

    function queryReturn(recs) {
        // console.log(recs[0]);
        res.send(recs[0]);
    };

};

exports.indexById = function(req, res) {
    console.log(req.body);
    
    var replacements1 = {
        id: req.params.id
    };
    Sequelize
        .query('EXEC Master_GetPincodeServiceDetailById :id',
            {replacements : replacements1})
        .then(queryReturn);

    function queryReturn(recs) {
        res.send(recs[0][0]);
    };

};

exports.getPincodesByCityCode = function(req, res) {
    console.log(req.body);
    
    var replacements1 = {ajwCity: req.params.ajwCity};
    Sequelize
        .query('EXEC Master_GetPincodesByCityCode :ajwCity',{replacements : replacements1, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs);
        res.send(recs);
    };

};

exports.getCityByPincode = async function(req, res) {
    console.log(req);

    var replacements1 = {pincode: req.params.pincode};

    let rcrds = await  Sequelize.query('EXEC Trans_CityByPincode :pincode',{replacements : replacements1, type: Sequelize.QueryTypes.SELECT});
    // Sequelize
    //     .query('EXEC Trans_CityByPincode :pincode',{replacements : replacements1, type: Sequelize.QueryTypes.SELECT})
    //     .then(queryReturn);

    if(rcrds.err){
        console.log(err);
    }else{
        let result = { statusBool: 200, data: rcrds };
        res.send(result);
    }
    // function queryReturn(recs) {
    //     console.log(recs);
    //     res.send(recs);
    // };
}