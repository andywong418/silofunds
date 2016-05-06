var models = require('../models');
var inspect = require('util').inspect;
var Busboy = require('busboy');

var fields = ["title","tags","maximum_amount","minimum_amount","countries","description","application_link","maximum_age","minimum_age","invite_only","link","religion","gender","financial_situation","merit_or_finance","deadline"];

var fund_array_to_json = function(array) {
  var funds = array.map(function(fund) {
    var json = fund.toJSON();
    return json;
  });
  return funds;
};

var reformatDate = function(date) {
  var mm = date.getMonth() + 1; // In JS months are 0-indexed, whilst days are 1-indexed
  var dd = date.getDate();
  var yyyy = date.getFullYear();
  mm = mm.toString(); // Prepare for comparison below
  dd = dd.toString();
  mm = mm.length > 1 ? mm : '0' + mm;
  dd = dd.length > 1 ? dd : '0' + dd;

  var reformattedDate = yyyy + "-" + mm + "-" + dd;
  return reformattedDate;
};

module.exports = {
  index: function(req, res) {
    console.log("IT'S HERE");
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      console.log(funds);
      funds = fund_array_to_json(funds);
      res.render('admin/index', { funds: funds });
    });
  },

  new: function(req, res) {
    res.render('admin/new');
  },

  validate: function(req, res) {
    var title = req.body.title;

    models.funds.findAll({
      where: {
        title: title
      }
    }).then(function(fund) {
      console.log("CHECKS");
      console.log(fund);
      console.log(fund.length);

      if (fund.length) {
        console.log("FUND ID:");
        console.log(fund[0].id);

        res.send(fund);
      } else {
        res.send(null);
      }
    });
  },

  download: function(req, res, next) {
    // For generating the download link and transferring ALL data to front-end
    // (including deleted_at == NOT NULL)
    models.funds.findAll({ order: 'id ASC', paranoid: false }).then(function(funds) {
      funds = fund_array_to_json(funds);
      res.send(funds);
      res.end();
    });
  },

  edit: function(req, res) {
    var id = req.params.id;

    models.funds.findById(id).then(function(fund) {
      var date = fund.deadline;
      var reformattedDate = null;

      if (date) {
        reformattedDate = reformatDate(date);
      }

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
    var countries = fund.countries[0] ? fund.countries.split(",") : null; // Return null if empty array
    var religion = fund.religion[0] ? fund.religion.split(",") : null;
    var financial_situation = fund.financial_situation ? fund.financial_situation : null;
    var gender = fund.gender;
    var merit_or_finance = fund.merit_or_finance;
    var deadline = fund.deadline ? fund.deadline : null;
    var application_link = fund.application_link ? fund.application_link : null;

    var parseIfInt = function(string) {
      if (string !== '') {
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
        application_link: application_link,
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
    var jsonData = '';
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        jsonData += data.toString();
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

      for (var ind = 0; ind < json_array.length; ind++) {
        var fund = json_array[ind];
        var create_options = {};

        for (var i=0; i<fields.length; i++) {
          var field = fields[i];
          create_options[field] = fund[field];

          if (fund.deleted_at) {
            create_options["deleted_at"] = fund.deleted_at;
          }
        }

        models.funds.create( create_options ).then(function() {
          console.log('Created fund.');
        });
      }
      res.redirect('../admin');
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
    var countries = fund.countries[0] ? fund.countries.split(",") : null;
    var religion = fund.religion[0] ? fund.religion.split(",") : null;
    var financial_situation = fund.financial_situation ? fund.financial_situation : null;
    var gender = fund.gender;
    var merit_or_finance = fund.merit_or_finance;
    var deadline = fund.deadline ? fund.deadline : null;
    var application_link = fund.application_link ? fund.application_link : null;

    var parseIfInt = function(string) {
      if (string !== '') {
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
      application_link: application_link,
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
    }).catch(function(err) {
      console.log("There seems to have been an error: " + err);
    }).then(function() {
      res.redirect('admin');
    });
  },

  sync: function(req, res) {
    models.funds.findAll().then(function(funds) {
      var body = [];
      funds = fund_array_to_json(funds);

      console.log(funds);
      console.log('\n\n');

      // Prepare body for _bulk processing. Each element in body array HAS to be an object.
      funds.forEach(function(fund) {
        body.push({'index': {'_index': 'funds', '_type': 'fund', '_id': fund.id}});
        var wrapper = {};

        for (var i = 0; i < fields.length ; i++) {
          wrapper[fields[i]] = fund[fields[i]];
        }
        wrapper["suggest"] = { "input": fund.tags };
        body.push(wrapper);
      });

      models.es.bulk({
        body: body
      }, function (err, resp) {
        console.log(resp);
      });
    }).then(function() {
      console.log('...Finished sync');
      res.redirect('../admin');
    });
  }
};
