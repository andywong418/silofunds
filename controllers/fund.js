var models = require('../models');
var query;
module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });

      res.render('results', { funds: funds });
    });
  },

  search: function(req, res) {
    var searchString = req.query.tags;
    var searchAge = parseInt(req.query.age);
    var searchAmount = parseInt(req.query.amount);
    var user = req.session.passport.user;

    models.es.search({
      index: "funds",
      type: "fund",
      body: {
        "query": {
          "filtered": {
            "query": {
              "multi_match": {
                "query": searchString,
                "fields": ["tags","title.autocomplete"]
              }
            }
          }
        }
      }
    }).then(function(resp) {
      console.log("This is the response:");
      console.log(resp);

      var funds = resp.hits.hits.map(function(hit) {
        console.log("Hit:");
        console.log(hit);
        var fields = ["title","tags","maximum_amount","minimum_amount","countries","description","maximum_age","minimum_age","invite_only","link","religion","gender","financial_situation","merit_or_finance","deadline"];
        var hash = {};

        for (var i = 0; i < fields.length ; i++) {
          hash[fields[i]] = hit._source[fields[i]];
        }
        // Sync id separately, because it is hit._id, NOT hit._source.id
        hash.id = hit._id;

        return hash;
      });
      var results_page = true;
      console.log(funds);
      if(user){
        res.render('results',{ funds: funds, user: user } );
      }
      else{
        res.render('results', { funds: funds, user: false, resultsPage: results_page });
      }
    }, function(err) {
      console.trace(err.message);
      res.render('error');
    });
  }
};
