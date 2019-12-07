'user strict'
var Sequelize = require('../../../config/sequelize').getConnection();

exports.index = function (req, res) {
    Sequelize
        .query('EXEC Trans_GetMisroutedShipments ',{type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs)
        res.send(recs);
    };
};

exports.indexByID = function (req, res) {
      var replacements = {id: req.params.id};
    Sequelize
        .query('EXEC Trans_GetMisroutedShipmentByID :id',{replacements: replacements, type: Sequelize.QueryTypes.SELECT})
        .then(queryReturn);

    function queryReturn(recs) {
        console.log(recs)
        res.send(recs[0]);
    };
};


exports.reportByMAWB = async function (req, res) {  
    var replacements = req.body;
    let spRecords = await Sequelize.query('EXEC Report_MistroutedShipments :fromDate, :toDate, :MAWBno',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
    if(spRecords.err){
        console.log(spRecords.err);
    }else{
        res.send(spRecords);
    }
}