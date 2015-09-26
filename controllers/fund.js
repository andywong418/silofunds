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
    
    console.log(models.funds)

      models.sequelize.query("SELECT * from funds WHERE ? % ANY(tags);", {replacements: [searchString], type: models.sequelize.QueryTypes.SELECT}
    
    ).then(function(funds) {
      
      var funds = funds.map(function(fund) {
      return fund;
      });

      res.render('search', { funds: funds });
    });
    
    
  }
};