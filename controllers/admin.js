var models = require('../models');
var inspect = require('util').inspect;
var Busboy = require('busboy');
var sequelize = models.sequelize;
var Umzug = require('umzug');
var umzugOptions = {
  storage: 'sequelize',
  storageOptions: { sequelize: sequelize },
  logging: false,
  upName: 'up',
  downName: 'down',
  migrations: {
    // The params that gets passed to the migrations.
    // Might be an array or a synchronous function which returns an array.
    params: [sequelize.getQueryInterface(), sequelize.constructor],
    path: 'migrations',
    pattern: /^\d+[\w-]+\.js$/,
  }
};
var umzug = new Umzug(umzugOptions);

var fields = ["title","tags","maximum_amount","minimum_amount","country_of_residence","description","application_link","maximum_age","minimum_age","invite_only","link","religion","gender","financial_situation","subject","target_degree","target_university","required_degree","required_university","merit_or_finance","deadline","target_country","created_at","updated_at"];

var organisationsTableFields = ["name","charity_id","created_at","updated_at"];

var fund_array_to_json = function(array) {
  var funds = array.map(function(fund) {
    var json = fund.toJSON();
    return json;
  });
  return funds;
};

var lowercaseArray = function(array) {
  var loweredArray = array.map(function(string) {
    return string.toLowerCase();
  });
  return loweredArray;
};

var parseIfInt = function(string) {
  if (string !== '') {
    return parseInt(string);
  }
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
    res.render('admin/index');
  },

  new: function(req, res) {
    models.organisations.findAll({ order: 'name ASC' }).then(function(organisations) {
      organisations = fund_array_to_json(organisations);
      res.render('admin/new', { organisations: organisations });
    });
  },

  funds: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      funds = fund_array_to_json(funds);
      res.render('admin/funds', { funds: funds });
    });
  },

  migrations: function(req, res) {
    umzug.executed().then(function(executedMigrations) {
      umzug.pending().then(function(pendingMigrations) {
        res.render('admin/migrations', { executedMigrations: executedMigrations, pendingMigrations: pendingMigrations });
      });
    });
  },

  migrateUp: function(req, res) {
    var all = req.query.all;

    umzug.pending().then(function(migrations) {
      pendingMigrations = migrations.map(function(migration) {
        return migration.file;
      });

      if (!all) {
        pendingMigrations = [pendingMigrations[0]];
      }

      umzug.execute({
        migrations: pendingMigrations,
        method: 'up'
      }).then(function(migrations) {
        res.redirect('../admin/migrations');
      });
    });
  },

  migrateDown: function(req, res) {
    umzug.down().then(function(migration) {
      res.redirect('../admin/migrations');
    });
  },

  validate: function(req, res) {
    var title = req.body.title;

    models.funds.findAll({
      where: {
        title: title
      }
    }).then(function(fund) {
      if (fund.length) {
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

      models.organisations.findAll({ order: 'name ASC' }).then(function(organisations) {
        organisations = fund_array_to_json(organisations);
        res.render('admin/edit', { fund: fund, deadline: reformattedDate, organisations: organisations });
      });
    });
  },

  update: function(req, res) {
    var id = req.params.id;

    var fund = req.body;
    var title = fund.title;
    var tags = fund.keywords[0] ? lowercaseArray(fund.keywords.split(",")) : null;
    var invite = ("invite" in fund);
    var link = fund.link ? fund.link : null;
    var description = fund.description ? fund.description : null;
    var target_country = fund.target_country[0] ? fund.target_country.split(",") : null;
    var country_of_residence = fund.country_of_residence[0] ? lowercaseArray(fund.country_of_residence.split(",")) : null;
    var religion = fund.religion[0] ? lowercaseArray(fund.religion.split(",")) : null;
    var financial_situation = fund.financial_situation ? fund.financial_situation : null;
    var subject = fund.subject[0] ? lowercaseArray(fund.subject.split(",")) : null;
    var target_degree = fund.target_degree[0] ? lowercaseArray(fund.target_degree.split(",")) : null;
    var target_university = fund.target_university[0] ? lowercaseArray(fund.target_university.split(",")) : null;
    var required_degree = fund.required_degree[0] ? lowercaseArray(fund.required_degree.split(",")) : null;
    var required_university = fund.required_university[0] ? lowercaseArray(fund.required_university.split(",")) : null;
    var gender = fund.gender;
    var merit_or_finance = fund.merit_or_finance;
    var deadline = fund.deadline ? fund.deadline : null;
    var application_link = fund.application_link ? fund.application_link : null;
    var organisation_id = parseIfInt(fund.organisation_id);
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
        country_of_residence: country_of_residence,
        target_country: target_country,
        religion: religion,
        financial_situation: financial_situation,
        organisation_id: organisation_id,
        subject: subject,
        target_degree: target_degree,
        target_university: target_university,
        required_degree: required_degree,
        required_university: required_university,
        merit_or_finance: merit_or_finance,
        gender: gender,
        deadline: deadline
      }).then(function() {
        res.redirect('/admin/funds');
      });
    });
  },

  destroy: function(req, res) {
    var id = req.params.id;

    models.funds.findById(id).then(function(fund) {
      fund.destroy().then(function() {
        res.redirect('/admin/funds');
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
    var title = fund.title;
    var tags = fund.keywords[0] ? lowercaseArray(fund.keywords.split(",")) : null;
    var invite = ("invite" in fund);
    var link = fund.link ? fund.link : null;
    var description = fund.description ? fund.description : null;
    var target_country = fund.target_country[0] ? fund.target_country.split(",") : null;
    var country_of_residence = fund.country_of_residence[0] ? lowercaseArray(fund.country_of_residence.split(",")) : null;
    var religion = fund.religion[0] ? lowercaseArray(fund.religion.split(",")) : null;
    var financial_situation = fund.financial_situation ? fund.financial_situation : null;
    var subject = fund.subject[0] ? lowercaseArray(fund.subject.split(",")) : null;
    var target_degree = fund.target_degree[0] ? lowercaseArray(fund.target_degree.split(",")) : null;
    var target_university = fund.target_university[0] ? lowercaseArray(fund.target_university.split(",")) : null;
    var required_degree = fund.required_degree[0] ? lowercaseArray(fund.required_degree.split(",")) : null;
    var required_university = fund.required_university[0] ? lowercaseArray(fund.required_university.split(",")) : null;
    var gender = fund.gender;
    var merit_or_finance = fund.merit_or_finance;
    var deadline = fund.deadline ? fund.deadline : null;
    var application_link = fund.application_link ? fund.application_link : null;
    var organisation_id = parseIfInt(fund.organisation_id);
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
      country_of_residence: country_of_residence,
      target_country: target_country,
      religion: religion,
      financial_situation: financial_situation,
      organisation_id: organisation_id,
      subject: subject,
      target_degree: target_degree,
      target_university: target_university,
      required_degree: required_degree,
      required_university: required_university,
      merit_or_finance: merit_or_finance,
      gender: gender,
      deadline: deadline
    }).catch(function(err) {
      console.log("There seems to have been an error: " + err);
    }).then(function() {
      res.redirect('/admin/funds');
    });
  },

  sync: function(req, res) {
    models.funds.findAll().then(function(funds) {
      var body = [];
      funds = fund_array_to_json(funds);

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
  },

  organisations: {
    index: function(req, res) {
      models.organisations.findAll({ order: 'name ASC' }).then(function(organisations) {
        organisations = fund_array_to_json(organisations);
        res.render('admin/organisations', { organisations: organisations });
      });
    },

    new: function(req, res) {
      res.render('admin/organisations-new');
    },

    create: function(req, res) {
      var organisation = req.body;
      var name = organisation.name;
      var charity_id = parseIfInt(organisation.charity_id);

      models.organisations.create({
        name: name,
        charity_id: charity_id
      }).catch(function(err) {
        console.log("There seems to have been an error: " + err);
      }).then(function() {
        res.redirect('/admin/organisations');
      });
    },

    destroy: function(req, res) {
      var id = req.params.id;

      models.organisations.findById(id).then(function(organisation) {
        organisation.destroy().then(function() {
          res.redirect('/admin/organisations');
        });
      });
    },

    download: function(req, res, next) {
      // For generating the download link and transferring ALL data to front-end
      // (including deleted_at == NOT NULL)
      models.organisations.findAll({ order: 'name ASC', paranoid: false }).then(function(organisations) {
        organisations = fund_array_to_json(organisations);
        res.send(organisations);
        res.end();
      });
    },

    edit: function(req, res) {
      var id = req.params.id;

      models.organisations.findById(id).then(function(organisation) {
        res.render('admin/organisations-edit', { organisation: organisation });
      });
    },

    update: function(req, res) {
      var id = req.params.id;

      var organisation = req.body;
      var name = organisation.name;
      var charity_id = parseIfInt(organisation.charity_id);

      models.organisations.findById(id).then(function(organisation) {
        organisation.update({
          name: name,
          charity_id: charity_id
        }).then(function() {
          res.redirect('/admin/organisations');
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
          var organisation = json_array[ind];
          var create_options = {};

          for (var i=0; i<organisationsTableFields.length; i++) {
            var field = organisationsTableFields[i];
            create_options[field] = organisation[field];

            if (organisation.deleted_at) {
              create_options["deleted_at"] = organisation.deleted_at;
            }
          }

          models.organisations.create( create_options ).then(function() {
            console.log('Created fund.');
          });
        }
        res.redirect('/admin/organisations');
      });
      req.pipe(busboy);
    }
  }
};
