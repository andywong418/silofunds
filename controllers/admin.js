var models = require('../models');
var descriptions = require('../helpers/descriptionsHelper.js');

module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });

      res.render('admin/index', { funds: funds, descriptions: descriptions });
    });
  },

  new: function(req, res) {
    res.render('admin/new', { layout: '../layout' });
  },

  create: function(req, res) {
    var fund = req.body;
    var title = fund.title;
    var tags = fund.keywords.split(", ");
    var link = fund.link;

    var parseIfInt = function(string) {
      if (string != '') {
        return parseInt(string);
      }
    };

    var min_age = parseIfInt(fund.min_age);
    var max_age = parseIfInt(fund.max_age);
    var min_amount = parseIfInt(fund.min_amount);
    var max_amount = parseIfInt(fund.max_amount);

    models.funds.create({
      title: title,
      tags: tags,
      invite_only: fund.invite,
      link: link,
      minimum_age: min_age,
      maximum_age: max_age,
      minimum_amount: min_amount,
      maximum_amount: max_amount
    }).then(function(fund) {
      res.redirect('admin');
    });
  }
}
