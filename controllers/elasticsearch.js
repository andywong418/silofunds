var models = require('../models');
var query;
var async = require('async');
var countries = require('../resources/countries');
var es = require('../elasticsearch');
var elasticsearchModels = require('../elasticsearch/model');

module.exports = {
  fundSearch: function(req, res) {
    var query = req.query;

    // NOTE: LEVEL 1 SEARCH -- find out whether we should return "uk" or "us" universities

    var queryTerms = [];
    queryTerms.push(query.tags ? query.tags : "");
    queryTerms.push(query.subject ? query.subject : "");
    queryTerms.push(query.target_university ? query.target_university : "");
    queryTerms.push(query.target_degree ? query.target_degree : "");
    queryTerms.push(query.required_university ? query.required_university : "");
    queryTerms.push(query.required_degree ? query.required_degree : "");
    queryTerms.push(query.required_grade ? query.required_grade : "");
    queryTerms.push(query.country_of_residence ? query.country_of_residence : "");
    queryTerms.push(query.specific_location ? query.specific_location : "");
    queryTerms.push(query.target_country ? query.target_country : "");
    queryTerms.push(query.religion ? query.religion : "");
    queryTerms.push(query.title ? query.title : "");
    queryTerms = queryTerms.join(' ');
    var queryString = [];
    queryString.push(queryTerms);

    Logger.warn("queryString");
    Logger.warn(queryString);

    es.search({
      index: "funds",
      type: ["autocomplete_universities", "autocomplete_subjects", "autocomplete_degrees", "autocomplete_countries"],
      body: {
        "size": 2000,
        "query": {
          "multi_match": {
            "query": queryString,
            "fields": ["university", "subject", "degree", "country"],
            "operator": "or"
          }
        }
      }
    }).then(function(resp) {
      // NOTE: NORMAL SHIT

      // Parse integer fields
      if (query.age) {
        query.age = parseIfInt(query.age);
      }
      if (query.amount_offered) {
        query.amount_offered = parseIfInt(query.amount_offered);
      }

      var emptyQueryObj = Object.keys(query).length === 0 && query.constructor === Object;

      var user = req.session.passport.user;
      var session = req.sessionID;
      var search_url_array = req.url.split('/');
      req.session.redirect_user = search_url_array[1];

      var queryOptions = {
        "filtered": {
          "filter": {
            "bool": {
              "should": { "match_all": {} }
            }
          }
        }
      };

      if (query.all !== "true" || emptyQueryObj) {
        if (query.amount_offered || query.age) {
          var queryOptionsShouldArr = [
            {
              "range": {
                "minimum_amount": {
                  "lte": query.amount_offered
                }
              }
            },
            {
              "range": {
                "maximum_amount": {
                  "gte": query.amount_offered
                }
              }
            },
            {
              "range": {
                "minimum_age": {
                  "lte": query.age
                }
              }
            },
            {
              "range": {
                "maximum_amount": {
                  "gte": query.age
                }
              }
            }
          ];

          queryOptions.filtered.filter.bool.should = queryOptionsShouldArr;
        }

        queryOptions.filtered.query = {
          "bool": {
            "should": []
          }
        };

        //TODO: consider using type:"most_fields"; it is now by default "best_fields"
        if (query.tags) {
          queryOptions.filtered.query.bool.should.push({
            "multi_match" : {
              "query": query.tags, // NOTE: MAYBE HAS TO BE ARRAY OF ONE STRING, STRING IS A JOIN(' ') OF ALL INDIVIDUAL STRINGS FROM DIFFERENT FIELDS -----> reference above
              "fields": elasticsearchModels.multiMatchFields,
              "operator": "and", // NOTE: and MAYBE THIS IS "or"
              "boost": 3
            }
          });
        }

        // Build "match" objects for each field present in query.
        for (var key in query) {
          var notTags = key !== "tags";
          var notAge = key !== "age";
          var notAmount = key !== "amount_offered";
          var notTitle = key !== "title";

          if (notTags && notAge && notAmount) {
            var matchObj = {
              "match": {}
            };

            matchObj.match[key] = query[key];
            queryOptions.filtered.query.bool.should.push(matchObj);

            // if query.tags doesn't exist, multi_match query won't exist
            if (notTitle && query.tags) {
              // Push the field name into the "multi_match" fields array for matching tags
              // queryOptions.filtered.query.bool.should[0].multi_match.fields.push(key); // TODO: remove this and do the above TODO.
            }
          }
        }
      }


      ///////////////////// NOTE: SPECIAL NEEDS /////////////////////////
      Logger.warn(resp.hits.hits);

      if (resp.hits.hits.length !== 0) {
        var universityCategories = [];
        var subject_categories = [];
        var degreeCategories = [];
        var countryCategories = [];

        for (var i = 0; i < resp.hits.hits.length; i++) {
          var hit = resp.hits.hits[i];

          if (hit._type === 'autocomplete_subjects') {
            Logger.info('*********** autocomplete_subjects ***********');

            if (subject_categories.indexOf(hit._source["subject_category"]) === -1 ) {
              subject_categories.push(hit._source["subject_category"]);
            }
          }

          if (hit._type === 'autocomplete_universities') {
            Logger.info('*********** autocomplete_universities ***********');

            if (universityCategories.indexOf(hit._source["university_category"]) === -1 ) {
              universityCategories.push(hit._source["university_category"]);
            }
          }


          if (hit._type === 'autocomplete_degrees') {
            Logger.info('*********** autocomplete_degrees ***********');

            if (degreeCategories.indexOf(hit._source["degree_category"]) === -1 ) {
              degreeCategories.push(hit._source["degree_category"]);
            }
          }

          if (hit._type === 'autocomplete_countries') {
            Logger.info('*********** autocomplete_countries ***********');

            if (countryCategories.indexOf(hit._source["country_category"]) === -1 ) {
              countryCategories.push(hit._source["country_category"]);
            }
          }
        }

        Logger.warn("universityCategories\n" + universityCategories);
        Logger.warn("subject_categories\n" + subject_categories);
        Logger.warn("degreeCategories\n" + degreeCategories);
        Logger.warn("countryCategories\n" + countryCategories);

        // TODO: match for required_university too?
        queryOptions.filtered.query.bool.should.push({
          "match": {
            "target_university": {
              "query":   universityCategories.join(' '),
              "operator": "and"
            }

          }
        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "required_university": {
              "query": universityCategories.join(' '),
              "operator": "and"
            }
          }
        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "subject": {
              "query": subject_categories.join(' '),
              "operator": "and"
            }
          }
        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "target_degree":{
              "query": degreeCategories.join(' '),
              "operator": "and"
            }
          }
        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "required_degree": {
              "query": degreeCategories.join(' '),
              "operator": "and"

          }
        }
        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "target_country": {
              "query": countryCategories.join(' '),
              "operator": "and"

            }
          }
        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "country_of_residence": {
              "query": countryCategories.join(' '),
              "operator": "and"

          }
        }
        });
      }

      //////////////////////////////////////////////////////////////////

      // Logger.debug("queryOptions\n", queryOptions);
      // Logger.debug("queryOptions.filtered.query.bool.should\n",queryOptions.filtered.query.bool.should);
      //
      // if (queryOptions.filtered.filter) {
      //   Logger.debug("queryOptions.filtered.filter\n", queryOptions.filtered.filter);
      // }
      Logger.error(queryOptions.filtered.query.bool);
      es.search({
        index: "funds",
        type: "fund",
        body: {
          "size": 1000,
          "query": queryOptions
        }
      }).then(function(resp) {
        var fund_id_list = [];
        var funds = resp.hits.hits.map(function(hit) {
          var fields = ["application_decision_date","application_documents","application_open_date","title","tags","maximum_amount","minimum_amount","country_of_residence","description","duration_of_scholarship","email","application_link","maximum_age","minimum_age","invite_only","interview_date","link","religion","gender","financial_situation","specific_location","subject","target_degree","target_university","required_degree","required_grade","required_university","merit_or_finance","deadline","target_country","number_of_places", "organisation_id"];
          var hash = {};

          for (var i = 0; i < fields.length ; i++) {
            hash[fields[i]] = hit._source[fields[i]];
          }
          // Sync id separately, because it is hit._id, NOT hit._source.id
          hash.id = hit._id;
          fund_id_list.push(hash.organisation_id); // for the WHERE ___ IN ___ query on users table later
          hash.fund_user = false; // for the user logic later
          return hash;
        });

        models.users.find({ where: { organisation_or_user: { $in: fund_id_list }}}).then(function(user) {
          if (user) {
            Logger.info("YSER",user);
            for (var i=0; i < funds.length; i++) {
              if (funds[i].organisation_id == user.organisation_or_user) {
                funds[i].fund_user = true;
              }
            }
          }
        }).then(function() {
          var results_page = true;
          if (user) {
            models.users.findById(user.id).then(function(user) {
              res.render('results',{ funds: funds, user: user, resultsPage: results_page, query: query } );
            });
          } else {
            res.render('results', { funds: funds, user: false, resultsPage: results_page, query: query });
          }
        });
      }, function(err) {
        console.trace(err.message);
        res.render('error');
      });
    });
  }
};
