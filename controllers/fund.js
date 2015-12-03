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
    console.log("CHECK THE REQ", req.session);
    var searchString = req.query.tags;
    var searchAge = parseInt(req.query.age);
    var searchAmount = parseInt(req.query.amount);
      }
    });
  }
}
