var models = require('../models');
var query;
module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });
      
      res.render('search', { funds: funds });
    });
  },

  search: function(req, res) {
    query = req._parsedUrl.query;
    var searchString = req.query.tags;
    var searchAge = parseInt(req.query.age);
    var searchAmount = parseInt(req.query.amount);
    var injectionVariables = [searchString];

    var sql = "SELECT * from funds" // WHERE ? % ANY(tags)";

    // if (searchAge) {
    //   sql = sql + " AND " + "minimum_age <= ?";
    //   injectionVariables.push(searchAge);
    // }
    //
    // if (searchAmount) {
    //   sql = sql + " AND " + "maximum_amount >= ?";
    //   injectionVariables.push(searchAmount);
    // }

    models.sequelize.query(sql, {
      replacements: injectionVariables,
      type: models.sequelize.QueryTypes.SELECT
    }).then(function(funds) {
      res.render('search', { funds: funds, user: false });
    });
  }
}
