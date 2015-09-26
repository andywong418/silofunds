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

    // Plug ----- model: Fund ----- next to options below if you want to return instances of
    // this model (not a JSON, but an instance to do further stuff with).
    models.sequelize.query("SELECT * from funds WHERE ? % ANY(tags)",
      { replacements: [searchString], type: models.sequelize.QueryTypes.SELECT }
    ).then(function(funds) {
      res.render('search', { funds: funds });
    });
  }
};
