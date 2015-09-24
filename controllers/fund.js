var models = require('../models');

module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      // convert funds to arr of JSON objects
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        console.log(json);
        return json;
      });

      res.render('search', { funds: funds });
    });
  }
};
