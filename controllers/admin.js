var models = require('../models');
var inspect = require('util').inspect;
var Busboy = require('busboy');

var fund_array_to_json = function(array) {
  var funds = array.map(function(fund) {
    var json = fund.toJSON();
    return json;
  });
  return funds;
};

module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      funds = fund_array_to_json(funds);

      res.render('admin/index', { funds: funds });
    });
  },

  new: function(req, res) {
    res.render('admin/new');
  },

  edit: function(req, res) {
    var id = req.params.id;

    models.funds.findById(id).then(function(fund) {
      var date = fund.deadline;

      var mm = date.getMonth() + 1; // In JS months are 0-indexed, whilst days are 1-indexed
      var dd = date.getDate();
      var yyyy = date.getFullYear();
      mm = mm.toString(); // Prepare for comparison below
      dd = dd.toString();
      mm = mm.length > 1 ? mm : '0' + mm;
      dd = dd.length > 1 ? dd : '0' + dd;

      var reformattedDate = yyyy + "-" + mm + "-" + dd;

      res.render('admin/edit', { fund: fund, deadline: reformattedDate });
    });
  },

  update: function(req, res) {
    var id = req.params.id;

    var fund = req.body;
    console.log(fund);
    var title = fund.title;
    var tags = fund.keywords.split(",");
    var invite = ("invite" in fund);
    var link = fund.link ? fund.link : null; // Return null if empty string ""
    var description = fund.description ? fund.description : null;
    var countries = fund.countries.split(",");
    var religion = fund.religion.split(",");
    var financial_situation = fund.financial_situation ? fund.financial_situation : null;
    var gender = fund.gender;
    var merit_or_finance = fund.merit_or_finance;
    var deadline = fund.deadline ? fund.deadline : null;

    var parseIfInt = function(string) {
      if (string != '') {
        return parseInt(string);
      }
    };

    var min_age = parseIfInt(fund.min_age);
    var max_age = parseIfInt(fund.max_age);
    var min_amount = parseIfInt(fund.min_amount);
    var max_amount = parseIfInt(fund.max_amount);

    models.funds.findById(id).then(function(fund) {
      fund.update({
        title: title,
        tags: tags,
        invite_only: invite,
        link: link,
        minimum_age: min_age,
        maximum_age: max_age,
        minimum_amount: min_amount,
        maximum_amount: max_amount,
        description: description,
        countries: countries,
        religion: religion,
        financial_situation: financial_situation,
        merit_or_finance: merit_or_finance,
        gender: gender,
        deadline: deadline
      }).then(function() {
        res.redirect('../../admin');
      });
    });
  },

  destroy: function(req, res) {
    var id = req.params.id;

    models.funds.findById(id).then(function(fund) {
      fund.destroy().then(function() {
        res.redirect('../../admin');
      });
    });
  },

  upload: function(req, res) {
    var busboy = new Busboy({ headers: req.headers });
    var jsonData = null;
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        jsonData = data.toString();
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
      console.log('Done parsing form! Injecting into database...');
      var json_array = JSON.parse(jsonData);

      // For converting pure string fields into an array of strings
      var str_to_arrayofstrings = function(field) {
        if (typeof field === "string") {
          console.log("Converting str into arrayofstrings");
          return field.split(",");
        } else {
          return field;
        }
      };

      for (var ind = 0; ind < json_array.length; ind++) {
        var fund = json_array[ind];

        // TODO: Remove str_to_arrayofstrings function call once migration from DataTypes.TEXT to DataTypes.ARRAY(DataTypes.TEXT) is complete

        models.funds.create({
          title: fund.title,
          tags: fund.tags,
          invite_only: fund.invite_only,
          link: fund.link,
          minimum_age: fund.minimum_age,
          maximum_age: fund.maximum_age,
          minimum_amount: fund.minimum_amount,
          maximum_amount: fund.maximum_amount,
          description: fund.description,
          countries: str_to_arrayofstrings(fund.nationality),
          religion: str_to_arrayofstrings(fund.religion),
          financial_situation: fund.financial_situation,
          merit_or_finance: fund.merit_or_finance,
          gender: fund.gender,
          deadline: fund.deadline
        }).then(function() {
          res.redirect('../admin');
        });
      }
    });
    req.pipe(busboy);
  },

  create: function(req, res) {
    var fund = req.body;
    console.log(fund);
    var title = fund.title;
    var tags = fund.keywords.split(",");
    var invite = ("invite" in fund);
    var link = fund.link ? fund.link : null; // Return null if empty string ""
    var description = fund.description ? fund.description : null;
    var countries = fund.countries.split(",");
    var religion = fund.religion.split(",");
    var financial_situation = fund.financial_situation ? fund.financial_situation : null;
    var gender = fund.gender;
    var merit_or_finance = fund.merit_or_finance;
    var deadline = fund.deadline ? fund.deadline : null;

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
      invite_only: invite,
      link: link,
      minimum_age: min_age,
      maximum_age: max_age,
      minimum_amount: min_amount,
      maximum_amount: max_amount,
      description: description,
      countries: countries,
      religion: religion,
      financial_situation: financial_situation,
      merit_or_finance: merit_or_finance,
      gender: gender,
      deadline: deadline
    }).then(function(fund) {
      res.redirect('admin');
    });
  }
}
