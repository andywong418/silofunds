var models = require('../models');
var query;
var async = require('async');
var countries = require('../resources/countries');
var es = require('../elasticsearch');
var elasticsearchModels = require('../elasticsearch/model');
var parseIfInt = function(string) {
  if (string !== '') {
    return parseInt(string);
  }
};
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        var listKeys = Object.keys(list[i]);
        var valueKeys = Object.keys(obj);
        if(valueKeys[0] == 'target_university'){
          if(listKeys[0] == valueKeys[0]){
            return true;
          }
        }
        else{
          if (listKeys[0] == valueKeys[0] && list[i][listKeys[0]].toLowerCase() == obj[valueKeys[0]].toLowerCase()) {
              return true;
          }
        }

    }

    return false;
}
function checkTargetIndex(field, relevantTerms){
  var relTermCounter = 0;
  var relTerm;
  for(var i = 0; i < relevantTerms.length; i++){
    if(relevantTerms[i][field]){
      relTerm = relevantTerms[i][field];
      relTermCounter++;
    }
  }
  if(relTermCounter === 0){
    return false;
  }
  else{
    return relTerm;
  }
}
var sort_by;
module.exports = {
  fundSearch: function(req, res) {
    var query = req.query;
    Logger.debug("query\n", query);

    // NOTE: LEVEL 1 SEARCH -- find out whether we should return "uk" or "us" universities
    if(req.query.sort_by){
      sort_by = req.query.sort_by;
      delete req.query.sort_by;
    }
    else{
      sort_by = false;
    }

    Logger.error(req.query);
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
    // querTerms.push(query.college ? query.college: "");
    queryTerms.push(query.title ? query.title : "");
    queryTerms = queryTerms.join(' ');
    var queryString = [];
    queryString.push(queryTerms);

    Logger.info("queryString");
    Logger.info(queryString);

    es.search({
      index: "funds",
      type: ["autocomplete_universities", "autocomplete_subjects", "autocomplete_degrees", "autocomplete_countries"],
      body: {
        "size": 2000,
        "query": {
          "multi_match": {
            "query": queryString,
            "fields": ["university", "subject", "abbreviated_degree", "country"],
            "operator": "or"
          }
        },
        "highlight": {
          "fields": {
            "university": {},
            "subject": {},
            "abbreviated_degree": {},
            "country": {},
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

      var user = req.user;
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
        // Setting up filter

        queryOptions.filtered.filter.bool.should = [];
        var shouldFilter = queryOptions.filtered.filter.bool.should;

        if (query.amount_offered || query.age) {
          shouldFilter.push({
            "range": {
              "minimum_amount": {
                "lte": query.amount_offered
              }
            }
          });
          shouldFilter.push({
            "range": {
              "maximum_amount": {
                "gte": query.amount_offered
              }
            }
          });
          shouldFilter.push({
            "range": {
              "minimum_age": {
                "lte": query.age
              }
            }
          });
          shouldFilter.push({
            "range": {
              "maximum_amount": {
                "gte": query.age
              }
            }
          });
        }
        if (!query.specific_location) {
          // If specific location is not specified in the search query append missing filter to "specific_location"
          queryOptions.filtered.filter.bool.must = {
            "missing": { "field": "specific_location" }
          };
        }

        // If nothing has been appended to should filter, restore it to "match_all"
        if (typeof shouldFilter !== 'undefined' && shouldFilter.length === 0) {
          shouldFilter = { "match_all": {} };
        }

        // Setting up filtered query
        queryOptions.filtered.query = {
          "bool": {
            "should": [{
              "bool": {
                "must": []
              }
            }]
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
              "bool": {
                "should": [{
                  "match": {}
                }]
              }
            };
            var fieldsWithAllParam = ["subject", "country_of_residence", "required_degree", "target_degree", "required_university", "target_university"];
            matchObj.bool.should[0].match[key] = {
              "query": query[key],
              "boost": 10
            };
            if (fieldsWithAllParam.indexOf(key) > -1) {
              var obj = {
                "match": {}
              };

              obj.match[key] = "all";
              matchObj.bool.should.push(obj);
            }

            queryOptions.filtered.query.bool.should[0].bool.must.push(matchObj);
            // if query.tags doesn't exist, multi_match query won't exist
            if (notTitle && query.tags) {
              // Push the field name into the "multi_match" fields array for matching tags
              // queryOptions.filtered.query.bool.should[0].multi_match.fields.push(key); // TODO: remove this and do the above TODO.
            }
          }
        }
      }


      ///////////////////// NOTE: SPECIAL NEEDS /////////////////////////
      Logger.warn("CHECKING RESP");
      Logger.warn(resp.hits.hits);

      var relevantTerms = []; // NOTE: Whole object to be passed into view for "Did you mean?" prompt.

      if (resp.hits.hits.length !== 0) {
        var universityCategories = [];
        var subject_categories = [];
        var degreeCategories = [];
        var countryCategories = [];


        for (var i = 0; i < resp.hits.hits.length; i++) {
          var hit = resp.hits.hits[i];

          if (hit._type === 'autocomplete_subjects') {
            Logger.info('*********** autocomplete_subjects ***********');
            var subjectObj = {};
            if (subject_categories.indexOf(hit._source["subject_category"]) === -1 ) {
              subject_categories.push(hit._source["subject_category"]);
            }
            var relevantTerm = hit.highlight.subject[0].split('<')[1].split('>')[1];
            subjectObj.subject = relevantTerm;
            if(!containsObject(subjectObj, relevantTerms)){
              //rnot in there
                relevantTerms.push(subjectObj);
                console.log("SB OBJ", subjectObj);
                queryOptions.filtered.query.bool.should.push({
                  "match": {
                    "subject": {
                      "query": subjectObj.subject,
                      "minimum_should_match": "100%",
                      "operator": "and",
                      "boost": 4
                    }
                  }
                });
                console.log(queryOptions.filtered.query.bool.should);
            }
          }

          if (hit._type === 'autocomplete_universities') {
            Logger.info('*********** autocomplete_universities ***********');
            var uniObj = {};
            if (universityCategories.indexOf(hit._source["university_category"]) === -1 ) {
              universityCategories.push(hit._source["university_category"]);
            }
            //only don't split university;
            var firstSplit = hit.highlight.university[0].split('<em>').join((''));
            Logger.info(firstSplit.replace("</em>", ""));
            var relevantTerm = firstSplit.replace("</em>", "");

            console.log("RELEVANT TERM", relevantTerm);
            uniObj.target_university = relevantTerm;
            console.log(uniObj);
            console.log(relevantTerms);
            console.log({ target_university: 'Oxford' } === { target_university: 'Oxford' });
            console.log(containsObject(uniObj, relevantTerms));
            if(!containsObject(uniObj, relevantTerms)){
              //rnot in there
                relevantTerms.push(uniObj);
            }

          }


          if (hit._type === 'autocomplete_degrees') {
            Logger.info('*********** autocomplete_degrees ***********');
            var degreeObj = {};
            if (degreeCategories.indexOf(hit._source["degree_category"]) === -1 ) {
              degreeCategories.push(hit._source["degree_category"]);
            }

            Logger.error(hit.highlight.abbreviated_degree);
            var relevantTerm = hit.highlight.abbreviated_degree[0].split('<')[1].split('>')[1];
            degreeObj.target_degree = relevantTerm;
            if(!containsObject(degreeObj, relevantTerms)){
              //rnot in there
                relevantTerms.push(degreeObj);
            }
          }

          if (hit._type === 'autocomplete_countries') {
            Logger.info('*********** autocomplete_countries ***********');
            var countryObj = {};
            if (countryCategories.indexOf(hit._source["country_category"]) === -1 ) {
              countryCategories.push(hit._source["country_category"]);
            }


            var relevantTerm = hit.highlight.country[0].split('<')[1].split('>')[1];
            countryObj.country_of_residence = relevantTerm;
            if(!containsObject(countryObj, relevantTerms)){
              //rnot in there
                relevantTerms.push(countryObj);
            }
          }


        }
        var boolQuery = queryOptions.filtered.query.bool;
        boolQuery.must_not = [];
        var countryOfResidence = query.country_of_residence ? query.country_of_residence : null;

        if (countryOfResidence) {
          var notString = "not " + countryOfResidence;
          var notCountryCategories = countryCategories.map(function(country) {
            return "not " + country;
          });
          Logger.info(notCountryCategories);
          Logger.info(notString);
          boolQuery.must_not.push({
            "match": {
              "country_of_residence": {
                "query": notString,
                "operator": "and"
              }
            }
          });

          if (typeof notCountryCategories !== 'undefined' && notCountryCategories.length === 0) {
            for (var j = 0; j < notCountryCategories.length; j++) {
              boolQuery.must_not.push({
                "match": {
                  "country_of_residence": {
                    "query": notCountryCategories[j],
                    "operator": "and"
                  }
                }
              });
            }
          }
        }

        var targetCountry = query.target_country ? query.target_country : null;

        if (targetCountry) {
          var notTargetCountry = "not " + targetCountry;
          boolQuery.must_not.push({
            "match": {
              "country_of_residence": {
                "query": notTargetCountry,
                "operator": "and"
              }
            }
          });
        }
        //
        // Logger.warn("universityCategories\n" + universityCategories);
        // Logger.warn("subject_categories\n" + subject_categories);
        // Logger.warn("degreeCategories\n" + degreeCategories);
        // Logger.warn("countryCategories\n" + countryCategories);

        // TODO: match for required_university too?
        console.log("REL TERMS", relevantTerms);

          var uniRelTerm = checkTargetIndex("target_university", relevantTerms);
          console.log("REL TER", uniRelTerm);
          if(uniRelTerm){
            queryOptions.filtered.query.bool.should.push({
              "match": {
                "target_university":{
                  "query": universityCategories.join(' ') +  ' ' + uniRelTerm,
                  "minimum_should_match": "100%",
                  "operator": "and"
                }
              }
            });
          }
          else{
            queryOptions.filtered.query.bool.should.push({
              "match": {
                "target_university":{
                  "query": universityCategories.join(' '),
                  "minimum_should_match": "100%",
                  "operator": "and"
                }
              }
            });
          }




        queryOptions.filtered.query.bool.should.push({
          "match": {
            "required_university": {
              "query": universityCategories.join(' '),
              "minimum_should_match": "100%",
              "operator": "and"
            }
          }
        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "subject": {
              "query": subject_categories.join(' '),
              "minimum_should_match": "100%",
              "operator": "and"
            }
          }
        });
        var degreeRelTerm = checkTargetIndex("target_degree", relevantTerms);


        queryOptions.filtered.query.bool.should.push({
          "match": {
            "target_degree": {
              "query":   degreeCategories.join(' '),
              "minimum_should_match": "100%",
              "operator": "and"
            }
          }
        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "required_degree":{
              "query": degreeCategories.join(' '),
              "minimum_should_match": "100%",
              "operator": "and"
            }
          }

        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "target_country": {
              "query": countryCategories.join(' '),
              "minimum_should_match": "100%",
              "operator": "and"
            }
          }
        });

        queryOptions.filtered.query.bool.should.push({
          "match": {
            "country_of_residence":{
              "query": countryCategories.join(' '),
              "minimum_should_match": "100%",
              "operator": "and"
            }
          }

        });
      }


      // Logger.debug("queryOptions\n", queryOptions);
      // Logger.debug("queryOptions.filtered.query.bool.should\n",queryOptions.filtered.query.bool.should);
      //
      // if (queryOptions.filtered.filter) {
      //   Logger.debug("queryOptions.filtered.filter\n", queryOptions.filtered.filter);
      // }


      es.explain({
        index: 'funds',
        type: 'fund',
        id: '827',
        body: {
          "query": queryOptions
        }
      }, function (error, response) {
        // Logger.error(response.explanation.details[0].details[1].details[0].details[0]);
        // console.log("QUEER OPTIONS", queryOptions.filtered.query.bool.should);
        // console.log("QUEER OPTIONS", queryOptions.filtered.query.bool.should[6].match);
        var bodyObj;
        if(!sort_by){
          bodyObj = {
            "size": 1000,
            "query": queryOptions
          };
        }
        if(sort_by == 'deadline'){
          bodyObj = {
            "size": 1000,
            "query": queryOptions,
            "sort": [
              {"deadline": {"order": "asc"}}
            ]
          };
        }
        if(sort_by == 'highest_amount'){
          bodyObj = {
            "size": 1000,
            "query": queryOptions,
            "sort": [
              {"maximum_amount": {"order": "desc"}}
            ]
          };
        }
        if(sort_by == 'lowest_amount'){
          bodyObj = {
            "size": 1000,
            "query": queryOptions,
            "sort": [
              {"maximum_amount": {"order": "asc"}}
            ]
          };
        }
        delete query.sort_by;
        es.search({
          index: "funds",
          type: "fund",
          body: bodyObj
        }).then(function(resp) {
          var new_resp = []; // This removes funds in user.removed_funds
          if(user) {
            if(user.removed_funds && user.removed_funds.length > 0){
              for(var i = 0; i < resp.hits.hits.length; i++) {
                  if(user.removed_funds.indexOf(resp.hits.hits[i]._id) > -1) {
                  } else {
                    new_resp.push(resp.hits.hits[i]);
                  }
              }
          }
            else{
              new_resp = resp.hits.hits;
            }
          } else {
            new_resp = resp.hits.hits;
          }
          resp.hits.hits = new_resp;
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
                if (query.tags && Object.keys(query).length === 1) {
                  Logger.error(relevantTerms);
                  res.render('results',{ funds: funds, user: user, resultsPage: results_page, query: query, relevant_terms: relevantTerms, sort_by: sort_by });
                }
                else{
                  res.render('results',{ funds: funds, user: user, resultsPage: results_page, query: query, relevant_terms: false, sort_by: sort_by } );
                }
              });
            } else {
              if (query.tags && Object.keys(query).length === 1){
                console.log("RESULTS");
                res.render('results', { funds: funds, user: false, resultsPage: results_page, query: query, relevant_terms: relevantTerms, sort_by: sort_by });

              }
              else{
                console.log("ANOTHER RESULTS", query);
                res.render('results', { funds: funds, user: false, resultsPage: results_page, query: query, relevant_terms: false, sort_by: sort_by });
              }
            }
          });
        }, function(err) {
          console.trace(err.message);
          res.render('error');
        });
      });
    });
  }
};
