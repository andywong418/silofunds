var models = require('../models');
var inspect = require('util').inspect;
var Busboy = require('busboy');
var religions = require('../resources/religions');
var sequelize = models.sequelize;
var stripe = require('stripe')("sk_test_pMhjrnm4PHA6cA5YZtmoD0dv");
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
var es = require('../elasticsearch');

/*
NOTE: organisation_id is omitted from 'fields' below because mapping would fuck up during upload. W amount of funds and X amount of organisations uploaded onto Y amount of existing funds and Z amount of existing organisations in the DB would cause all the organisation_id references to fuck up and reference the wrong things.
*/

/*
NOTE: Uploading funds with sequential IDs will not cause problems with 'organisation_id' -> 'organisation.id' references, but doing the same for organisations would. If there are gaps in the id of organisations table, check the box to make sure IDs are NOT uploaded sequentially.
*/

/*
NOTE: TLDR; (usually) CHECK BOX when uploading organisations, DON'T CHECK when uploading funds;
*/

var fields = ["application_decision_date","application_documents","application_open_date","title","tags","maximum_amount","minimum_amount","country_of_residence","description","duration_of_scholarship","email","application_link","maximum_age","minimum_age","invite_only","interview_date","link","religion","gender","financial_situation","specific_location","subject","target_degree","target_university","required_degree","required_grade","required_university","merit_or_finance","deadline","target_country","number_of_places","support_type","other_eligibility","other_application_steps","created_at","updated_at"];

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
      res.render('admin/new', { organisations: organisations, religions: religions });
    });
  },

  funds: function(req, res) {
    var data = {};
    models.funds.findAll({ order: 'id DESC' }).then(function(funds) {
      funds = fund_array_to_json(funds);
      funds = funds.map(function(fund) {
        fund.deadline = fund.deadline ? reformatDate(fund.deadline) : null;

        return fund;
      });

      data.funds = funds;
    }).then(function() {
      models.sequelize.query('SELECT title, COUNT(*) FROM funds GROUP BY title HAVING COUNT(*) > 1').spread(function(duplicateTitles, metadata) {
        data.duplicateTitles = duplicateTitles;
      }).then(function() {
        models.sequelize.query('SELECT email, COUNT(*) FROM funds WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1').spread(function(duplicateEmails, metadata) {
          data.duplicateEmails = duplicateEmails;

          res.render('admin/funds', { funds: data.funds, fundsWithDuplicateTitles: data.duplicateTitles, fundsWithDuplicateEmails: data.duplicateEmails });
        });
      });
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
      var deadline = fund.deadline ? reformatDate(fund.deadline) : null;
      var application_open_date = fund.application_open_date ? reformatDate(fund.application_open_date) : null;
      var application_decision_date = fund.application_decision_date ? reformatDate(fund.application_decision_date) : null;
      var interview_date = fund.interview_date ? reformatDate(fund.interview_date) : null;

      models.organisations.findAll({ order: 'name ASC' }).then(function(organisations) {
        organisations = fund_array_to_json(organisations);
        res.render('admin/edit', {
          application_decision_date: application_decision_date,
          application_open_date: application_open_date,
          fund: fund,
          deadline: deadline,
          interview_date: interview_date,
          organisations: organisations,
          religions: religions
        });
      });
    });
  },

  update: function(req, res) {
    var id = req.params.id;

    var fund = req.body;
    var application_decision_date = fund.application_decision_date ? fund.application_decision_date : null;
    var application_documents = fund.application_documents[0] ? lowercaseArray(fund.application_documents.split(",")) : null;
    var application_open_date = fund.application_open_date ? fund.application_open_date : null;
    var title = fund.title;
    var tags = fund.keywords[0] ? lowercaseArray(fund.keywords.split(",")) : null;
    var invite = ("invite" in fund);
    var interview_date = fund.interview_date ? fund.interview_date : null;
    var link = fund.link ? fund.link : null;
    var description = fund.description ? fund.description : null;
    var duration_of_scholarship = fund.duration_of_scholarship ? fund.duration_of_scholarship : null;
    var email = fund.email ? fund.email : null;
    var target_country = fund.target_country[0] ? lowercaseArray(fund.target_country.split(",")) : null;
    var country_of_residence = fund.country_of_residence[0] ? lowercaseArray(fund.country_of_residence.split(",")) : null;
    var religion = fund.religion ? fund.religion : null;
    var financial_situation = fund.financial_situation ? fund.financial_situation : null;
    var other_application_steps = fund.other_application_steps ? fund.other_application_steps : null;
    var other_eligibility = fund.other_eligibility ? fund.other_eligibility : null;
    var subject = fund.subject[0] ? lowercaseArray(fund.subject.split(",")) : null;
    var specific_location = fund.specific_location[0] ? lowercaseArray(fund.specific_location.split(",")) : null;
    var target_degree = fund.target_degree[0] ? lowercaseArray(fund.target_degree.split(",")) : null;
    var target_university = fund.target_university[0] ? lowercaseArray(fund.target_university.split(",")) : null;
    var required_degree = fund.required_degree[0] ? lowercaseArray(fund.required_degree.split(",")) : null;
    var required_university = fund.required_university[0] ? lowercaseArray(fund.required_university.split(",")) : null;
    var required_grade = fund.required_grade ? fund.required_grade : null;
    var gender = fund.gender;
    var merit_or_finance = fund.merit_or_finance;
    var deadline = fund.deadline ? fund.deadline : null;
    var application_link = fund.application_link ? fund.application_link : null;
    var organisation_id = parseIfInt(fund.organisation_id);
    var min_age = parseIfInt(fund.min_age);
    var max_age = parseIfInt(fund.max_age);
    var min_amount = parseIfInt(fund.min_amount);
    var max_amount = parseIfInt(fund.max_amount);
    var number_of_places = parseIfInt(fund.number_of_places);
    var support_type = fund.support_type ? fund.support_type : null;

    models.funds.findById(id).then(function(fund) {
      fund.update({
        application_decision_date: application_decision_date,
        application_documents: application_documents,
        application_open_date: application_open_date,
        title: title,
        tags: tags,
        duration_of_scholarship: duration_of_scholarship,
        email: email,
        invite_only: invite,
        interview_date: interview_date,
        link: link,
        application_link: application_link,
        minimum_age: min_age,
        maximum_age: max_age,
        minimum_amount: min_amount,
        maximum_amount: max_amount,
        number_of_places: number_of_places,
        other_application_steps: other_application_steps,
        other_eligibility: other_eligibility,
        description: description,
        country_of_residence: country_of_residence,
        target_country: target_country,
        required_grade: required_grade,
        religion: religion,
        financial_situation: financial_situation,
        organisation_id: organisation_id,
        specific_location: specific_location,
        subject: subject,
        support_type: support_type,
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

  resetTable: function(req, res) {
    if (req.body.password === process.env.CLEAR_DB_PASSWORD) {
      models.funds.findAll({ paranoid: false }).then(function(funds) {
        for (var i = 0; i < funds.length; i++) {
          funds[i].destroy({ force: true });
        }
      })
      .catch(function(err) { Logger.error(err); })
      .then(function() { Logger.warn('Cleared funds table.'); })
      .then(function() {
        models.sequelize.query("SELECT setval('funds_id_seq', 1, false)")
          .catch(function(err) { Logger.error(err); })
          .then(function(results) {
            Logger.warn('funds_id_seq reset to 1');
            res.redirect('/admin/funds');
          });
      });
    } else {
      Logger.warn('Someone just tried to clear funds table and failed miserably.');
      res.redirect('/admin/funds');
    }
  },

  upload: function(req, res) {
    var fieldValues = {};
    var busboy = new Busboy({ headers: req.headers });
    var jsonData = '';
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      Logger.info('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        Logger.info('File [' + fieldname + '] got ' + data.length + ' bytes');
        jsonData += data.toString();
      });
      file.on('end', function() {
        Logger.info('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      Logger.info('Field [' + fieldname + ']: value: ' + inspect(val));
      fieldValues[fieldname] = val;
    });
    busboy.on('finish', function() {
      Logger.info('Done parsing form! Injecting into database...');
      var json_array = JSON.parse(jsonData);
      var createOptionsArr = [];

      for (var ind = 0; ind < json_array.length; ind++) {
        var fund = json_array[ind];
        var create_options = {};

        for (var i=0; i<fields.length; i++) {
          var field = fields[i];
          create_options[field] = fund[field];

          if (fund.deleted_at) {
            create_options["deleted_at"] = fund.deleted_at;
          }

          if (fund.organisation_id) {
            create_options["organisation_id"] = (parseInt(fund.organisation_id) + parseInt(fieldValues["offset_number"])).toString();
          }

          if (fieldValues.overwrite_id) {
            create_options.id = fund.id;
          }
        }

        createOptionsArr.push(create_options);
      }

      models.funds.bulkCreate(createOptionsArr).then(function() {
        Logger.info('Created funds.');
      }).catch(function(err) {
        Logger.error(err);
      }).then(function() {
        models.sequelize.query("SELECT setval('funds_id_seq', MAX(id)) FROM funds").spread(function(results, metadata) {
          res.redirect('/admin/funds');
        });
      });
    });
    req.pipe(busboy);
  },

  create: function(req, res) {
    var fund = req.body;
    var application_decision_date = fund.application_decision_date ? fund.application_decision_date : null;
    var application_documents = fund.application_documents[0] ? lowercaseArray(fund.application_documents.split(",")) : null;
    var application_open_date = fund.application_open_date ? fund.application_open_date : null;
    var title = fund.title;
    var tags = fund.keywords[0] ? lowercaseArray(fund.keywords.split(",")) : null;
    var invite = ("invite" in fund);
    var interview_date = fund.interview_date ? fund.interview_date : null;
    var link = fund.link ? fund.link : null;
    var description = fund.description ? fund.description : null;
    var duration_of_scholarship = fund.duration_of_scholarship ? fund.duration_of_scholarship : null;
    var email = fund.email ? fund.email : null;
    var target_country = fund.target_country[0] ? lowercaseArray(fund.target_country.split(",")) : null;
    var country_of_residence = fund.country_of_residence[0] ? lowercaseArray(fund.country_of_residence.split(",")) : null;
    var religion = fund.religion ? fund.religion : null;
    var financial_situation = fund.financial_situation ? fund.financial_situation : null;
    var other_application_steps = fund.other_application_steps ? fund.other_application_steps : null;
    var other_eligibility = fund.other_eligibility ? fund.other_eligibility : null;
    var subject = fund.subject[0] ? lowercaseArray(fund.subject.split(",")) : null;
    var specific_location = fund.specific_location[0] ? lowercaseArray(fund.specific_location.split(",")) : null;
    var target_degree = fund.target_degree[0] ? lowercaseArray(fund.target_degree.split(",")) : null;
    var target_university = fund.target_university[0] ? lowercaseArray(fund.target_university.split(",")) : null;
    var required_degree = fund.required_degree[0] ? lowercaseArray(fund.required_degree.split(",")) : null;
    var required_university = fund.required_university[0] ? lowercaseArray(fund.required_university.split(",")) : null;
    var required_grade = fund.required_grade ? fund.required_grade : null;
    var gender = fund.gender;
    var merit_or_finance = fund.merit_or_finance;
    var deadline = fund.deadline ? fund.deadline : null;
    var application_link = fund.application_link ? fund.application_link : null;
    var organisation_id = parseIfInt(fund.organisation_id);
    var min_age = parseIfInt(fund.min_age);
    var max_age = parseIfInt(fund.max_age);
    var min_amount = parseIfInt(fund.min_amount);
    var max_amount = parseIfInt(fund.max_amount);
    var number_of_places = parseIfInt(fund.number_of_places);
    var support_type = fund.support_type ? fund.support_type : null;

    models.funds.create({
      application_decision_date: application_decision_date,
      application_documents: application_documents,
      application_open_date: application_open_date,
      title: title,
      tags: tags,
      duration_of_scholarship: duration_of_scholarship,
      email: email,
      invite_only: invite,
      interview_date: interview_date,
      link: link,
      application_link: application_link,
      minimum_age: min_age,
      maximum_age: max_age,
      minimum_amount: min_amount,
      maximum_amount: max_amount,
      number_of_places: number_of_places,
      other_application_steps: other_application_steps,
      other_eligibility: other_eligibility,
      description: description,
      country_of_residence: country_of_residence,
      target_country: target_country,
      required_grade: required_grade,
      religion: religion,
      financial_situation: financial_situation,
      organisation_id: organisation_id,
      specific_location: specific_location,
      subject: subject,
      support_type: support_type,
      target_degree: target_degree,
      target_university: target_university,
      required_degree: required_degree,
      required_university: required_university,
      merit_or_finance: merit_or_finance,
      gender: gender,
      deadline: deadline
    }).catch(function(err) {
      Logger.info("There seems to have been an error: " + err);
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

      es.bulk({
        body: body
      }, function (err, resp) {
        Logger.info(resp);
      });
    }).then(function() {
      Logger.info('...Finished sync');
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
      var charity_id = organisation.charity_id ? organisation.charity_id : null;

      models.organisations.create({
        name: name,
        charity_id: charity_id
      }).catch(function(err) {
        Logger.info("There seems to have been an error: " + err);
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

    resetTable: function(req, res) {
      if (req.body.password === process.env.CLEAR_DB_PASSWORD) {
        models.organisations.findAll({ paranoid: false }).then(function(organisations) {
          for (var i = 0; i < organisations.length; i++) {
            organisations[i].destroy({ force: true });
          }
        })
        .catch(function(err) { Logger.error(err); })
        .then(function() { Logger.warn('Cleared organisations table.'); })
        .then(function() {
          models.sequelize.query("SELECT setval('organisations_id_seq', 1, false)")
            .catch(function(err) { Logger.error(err); })
            .then(function(results) {
              Logger.warn('organisations_id_seq reset to 1');
              res.redirect('/admin/organisations');
            });
        });
      } else {
        Logger.warn('Someone just tried to clear organisations table and failed miserably.');
        res.redirect('/admin/organisations');
      }
    },

    update: function(req, res) {
      var id = req.params.id;

      var organisation = req.body;
      var name = organisation.name;
      var charity_id = organisation.charity_id ? organisation.charity_id : null;

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
      var fieldValues = {};
      var busboy = new Busboy({ headers: req.headers });
      var jsonData = '';
      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        Logger.info('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        file.on('data', function(data) {
          Logger.info('File [' + fieldname + '] got ' + data.length + ' bytes');
          jsonData += data.toString();
        });
        file.on('end', function() {
          Logger.info('File [' + fieldname + '] Finished');
        });
      });
      busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        Logger.info('Field [' + fieldname + ']: value: ' + inspect(val));
        fieldValues[fieldname] = val;
      });
      busboy.on('finish', function() {
        Logger.info('Done parsing form! Injecting into database...');
        var json_array = JSON.parse(jsonData);
        var createOptionsArr = [];

        for (var ind = 0; ind < json_array.length; ind++) {
          var organisation = json_array[ind];
          var create_options = {};

          for (var i=0; i<organisationsTableFields.length; i++) {
            var field = organisationsTableFields[i];
            create_options[field] = organisation[field];

            if (organisation.deleted_at) {
              create_options["deleted_at"] = organisation.deleted_at;
            }

            if (fieldValues.overwrite_id) {
              // Use file IDs
              create_options.id = (parseInt(organisation.id) + parseInt(fieldValues["offset_number"])).toString();
            }
          }

          createOptionsArr.push(create_options);
        }

        models.organisations.bulkCreate(createOptionsArr).then(function() {
          Logger.info('Created organisations.');
        }).catch(function(err) {
          Logger.error(err);
        }).then(function() {
          models.sequelize.query("SELECT setval('organisations_id_seq', MAX(id)) FROM organisations").spread(function(results, metadata) {
            res.redirect('/admin/organisations');
          });
        });
      });
      req.pipe(busboy);
    }
  },

  stripe: {
    index: function(req, res) {
      stripe.accounts.list(function(err, accounts) {
        if (err) {
          Logger.info(err);
        }
        accounts = accounts.data;

        res.render('admin/stripe', { accounts: accounts });
      });
    },

    // destroy: function(req, res) {
    //   var accountID = req.params.id;
    //
    //   stripe.accounts.del(accountID).then(function() {
    //     res.redirect('/admin/stripe');
    //   });
    // }
  }
};
