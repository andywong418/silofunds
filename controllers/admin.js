var models = require('../models');

module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });

      res.render('admin/index', { funds: funds });
    });
  },

  new: function(req, res) {
    res.render('admin/new', { layout: '../layout' });
  },

  create: function(req, res) {
    var fund = req.body;
    console.log(fund);
    var title = fund.title;
    var tags = fund.keywords.split(", ");
    var invite = ("invite" in fund);
    var link = fund.link ? fund.link : null; // Return null if empty string ""
    var description = fund.description ? fund.description : null;
    var nationality = fund.nationality ? fund.nationality : null;
    var religion = fund.religion ? fund.religion : null;
    var financial_situation = fund.financial_situation ? fund.financial_situation : null;

    var parseIfInt = function(string) {
      if (string != '') {
        return parseInt(string);
      }
    };

    var min_age = parseIfInt(fund.min_age);
    var max_age = parseIfInt(fund.max_age);
    var min_amount = parseIfInt(fund.min_amount);
    var max_amount = parseIfInt(fund.max_amount);

    // If fund is for BOTH genders, gender should be NULL. Similarly for merit / finance field.
    var gender = null;
    var merit_or_finance = null;

    if ('male' in fund) {
      gender = 'male';
    }
    if ('female' in fund) {
      gender = 'female';
    }
    if ('merit' in fund) {
      merit_or_finance = 'merit';
    }
    if ('finance' in fund) {
      merit_or_finance = 'finance';
    }

    models.funds.create({
      title: title,
      tags: tags,
      invite_only: invite,
      link: link,
      minimum_age: min_age,
      maximum_age: max_age,
      minimum_amount: min_amount,
      maximum_amount: max_amount,
      description: description,
      nationality: nationality,
      religion: religion,
      financial_situation: financial_situation,
      merit_or_finance: merit_or_finance,
      gender: gender
    }).then(function(fund) {
      res.redirect('admin');
    });
  }
}
