var models = require('../models');
var query;
var async = require('async');
var countries = require('../resources/countries');
var es = require('../elasticsearch');
var elasticsearchModels = require('../elasticsearch/model');

module.exports = {
  fundSearch: function(req, res) {
    var query = req.query;
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
      //LET USER CHANGE THIS
      if (query.tags) {
        queryOptions.filtered.query.bool.should.push({
          "multi_match" : {
            "query": query.tags,
            "fields": elasticsearchModels.multiMatchFields,
            "operator":   "and",
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

    Logger.debug("queryOptions\n", queryOptions);
    // Logger.debug("queryOptions.filtered.query.bool.should\n",queryOptions.filtered.query.bool.should);
    //
    // if (queryOptions.filtered.filter) {
    //   Logger.debug("queryOptions.filtered.filter\n", queryOptions.filtered.filter);
    // }
    

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
  }
};
