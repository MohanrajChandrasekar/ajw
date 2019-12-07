'use strict'
var Sequelize = require('../../config/sequelize').getConnection();

exports.getBoxDetails = async (req, res) => {
      var replacements = req.body;
      try{
            let queryResults = await Sequelize.query('EXEC Report_BoxDetails :HawbNo',{replacements: replacements, type: Sequelize.QueryTypes.SELECT});
            var returnRes = { status: 200, queryResults };
            res.send(returnRes);
      } catch(err) {
            console.log(err);
            var returnRes = { status: 500, err };
            res.send(returnRes);
      }
}