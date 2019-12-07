var Sequelize = require('../../config/sequelize').getConnection();

exports.index = (req, res) => {
      let replacements = req.body;

      Sequelize
            .query('EXEC Trans_DeliveryRatio :fromDate, :toDate', {replacements: replacements, type: Sequelize.QueryTypes.SELECT})
            .then(queryReturn);

      function queryReturn(recs) {
            console.log(recs);
            var returnVal = { statusBool: 1 , data: recs };
            res.send(returnVal);
      }
}