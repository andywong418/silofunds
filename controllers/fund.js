var models = require('../models');
var descriptions = require('../helpers/descriptionsHelper.js');

module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });

      res.render('search', { funds: funds, descriptions: descriptions });
    });
  },

  home: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });

      res.render('funds/index', { funds: funds, descriptions: descriptions });
    });
  },

  search: function(req, res) {
    var searchString = req.body.tags;
    var searchAge = parseInt(req.body.age);
    var searchAmount = parseInt(req.body.amount);
    var injectionVariables = [searchString];

    var sql = "SELECT * from funds WHERE ? % ANY(tags)";

    if (searchAge) {
      sql = sql + " AND " + "minimum_age <= ?";
      injectionVariables.push(searchAge);
    }

    if (searchAmount) {
      sql = sql + " AND " + "maximum_amount >= ?";
      injectionVariables.push(searchAmount);
    }

    models.sequelize.query(sql, {
      replacements: injectionVariables,
      type: models.sequelize.QueryTypes.SELECT
    }).then(function(funds) {
      res.render('search', { funds: funds, descriptions: descriptions });
    });
  },

  new: function(req, res) {
    res.render('funds/new', { layout: '../layout' });
  },

  create: function(req, res) {
    var fund = req.body;
    var title = fund.title;
    var tags = fund.keywords.split(", ");
    var link = fund.link;
    var min_age = fund.min_age;
    var max_age = fund.max_age;
    var min_amount = fund.min_amount;
    var max_amount = fund.max_amount;

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
      res.redirect('funds');
    });
  }
}
