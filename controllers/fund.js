var models = require('../models');

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
    var searchString = req.body.tags;
    searchString = searchString.split(', ');

    models.funds.findAll({
      where: {
        tags: {
          $in: searchString
        }
      }
    }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });

      res.render('search', { funds: funds });
    });
  }
};
