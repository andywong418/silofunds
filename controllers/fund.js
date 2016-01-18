var models = require('../models');
var query;
module.exports = {
  index: function(req, res) {
    models.funds.findAll({ order: 'id ASC' }).then(function(funds) {
      var funds = funds.map(function(fund) {
        var json = fund.toJSON();
        return json;
      });

      res.render('search', { funds: funds });
    });
  },

  search: function(req, res) {
    console.log("CHECK THE REQ", req.session.passport.user);
    var searchString = req.query.tags;
    var searchAge = parseInt(req.query.age);
    var searchAmount = parseInt(req.query.amount);
    var user = req.session.passport.user;

    models.es.search({
      index: "funds",
      type: "fund",
      body: {
        "query": {
          "match": {
            "title": searchString
          }
        }
      }
    }).then(function(resp) {
      console.log("This is the response:");
      console.log(resp);

      var funds = resp.hits.hits.map(function(hit) {
        console.log("Hit:");
        console.log(hit);

        var title = hit._source.title;
        var maximum_amount = hit._source.maximum_amount;
        var minimum_amount = hit._source.minimum_amount;
        var countries = hit._source.countries;
        var description = hit._source.description;
        var id = hit._id;

        var hash = {};

        hash.title = title;
        hash.maximum_amount = maximum_amount;
        hash.minimum_amount = minimum_amount;
        hash.description = description;
        hash.id = id;
        hash.countries = countries;

        return hash;
      });

      console.log(funds);
      if(user){
        res.render('results',{ funds: funds, user: user } )
      }
      else{
        res.render('results', { funds: funds, user: false });
      }
    }, function(err) {
      console.trace(err.message);
      res.render('error');
    });
  }
};
