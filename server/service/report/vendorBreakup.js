var Sequelize = require('../../config/sequelize').getConnection();

exports.index = (req, res) => {
      let replacements = req.body;

      Sequelize
            .query('EXEC Trans_VendorReport :fromDate, :toDate', {replacements: replacements, type: Sequelize.QueryTypes.SELECT})
            .then(queryReturn);

      function queryReturn(recs) {
            var returnVal = { statusBool: 1 , data: recs };
            res.send(returnVal);
      }
}

exports.indexBetweenRunNumbers = async (req, res) => {
      let replacements = req.body;

      Sequelize
            .query('EXEC Trans_Report_deliveryVendorList :fromRunno, :toRunno', {replacements: replacements, type: Sequelize.QueryTypes.SELECT})
            .then(queryReturn);

      function queryReturn(recs) {
            var returnVal = { statusBool: 200 , data: recs };
            res.send(returnVal);
      }
}