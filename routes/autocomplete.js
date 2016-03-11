var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function(req,res) {
  console.log(req.query);

  var query = req.query.term.split(" ");
  query = query[query.length - 1];
  console.log("AUTO QUERY" + query);

  models.es.suggest({
    index: "funds",
    body: {
      suggest: {
        text: query,
        completion: {
          "field": "suggest"
        } 
      }
    }
  }).then(function(resp) {

    var results = resp.suggest[0].options.map(function(obj) {
      return obj.text;
    });

    res.send(results);

  }, function(err) {
    console.trace(err.message);
    res.send({ response: err.message });
  });
});

module.exports = router;
