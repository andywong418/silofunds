var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function(req,res) {
  console.log(req.query);

  models.es.search({
    index: "funds",
    type: "fund",
    body: {
      "size": 5,
      "query": {
        "filtered": {
          "query": {
            "multi_match": {
              "query": req.query.term,
              "fields": ["title.autocomplete"]
            }
          }
        }
      }
    }
  }).then(function(resp) {
    console.log("This is the response:");
    console.log(resp);
    var results = resp.hits.hits.map(function(hit) {
      console.log("Hit:");
      console.log(hit);

      return hit._source.title;
    });

    res.send(results);
  }, function(err) {
    console.trace(err.message);
    res.send({ response: err.message });
  });
});

module.exports = router;
