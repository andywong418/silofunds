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

router.get('/countries', function(req,res) {
  var query = req.query.q.split(" ");
  query = query[query.length - 1];

  models.es.suggest({
    index: "funds",
    body: {
      suggest: {
        text: query,
        completion: {
          "field": "suggest_countries"
        }
      }
    }
  }).then(function(resp) {
    var arrOfResults = resp.suggest[0].options;
    var arrOfObj = [];

    for (var i=0; i < arrOfResults.length; i++) {
      var wrapper = {};

      wrapper["id"] = arrOfResults[i].payload.country_id.toString();
      wrapper["name"] = arrOfResults[i].text;
      arrOfObj.push(wrapper);
    }

    res.send(arrOfObj);
  }, function(err) {
    console.trace(err.message);
    res.send({ response: err.message });
  });
});

router.get('/degrees', function(req,res) {
  var query = req.query.q.split(" ");
  query = query[query.length - 1];

  models.es.suggest({
    index: "funds",
    body: {
      suggest: {
        text: query,
        completion: {
          "field": "suggest_degrees"
        }
      }
    }
  }).then(function(resp) {
    var arrOfResults = resp.suggest[0].options;
    var arrOfObj = [];

    for (var i=0; i < arrOfResults.length; i++) {
      var wrapper = {};

      wrapper["id"] = arrOfResults[i].payload.degree_id.toString();
      wrapper["name"] = arrOfResults[i].text;
      arrOfObj.push(wrapper);
    }

    res.send(arrOfObj);
  }, function(err) {
    console.trace(err.message);
    res.send({ response: err.message });
  });
});

router.get('/religions', function(req,res) {
  var query = req.query.q.split(" ");
  query = query[query.length - 1];

  models.es.suggest({
    index: "funds",
    body: {
      suggest: {
        text: query,
        completion: {
          "field": "suggest_religions"
        }
      }
    }
  }).then(function(resp) {
    var arrOfResults = resp.suggest[0].options;
    var arrOfObj = [];

    for (var i=0; i < arrOfResults.length; i++) {
      var wrapper = {};

      wrapper["id"] = arrOfResults[i].payload.religion_id.toString();
      wrapper["name"] = arrOfResults[i].text;
      arrOfObj.push(wrapper);
    }

    res.send(arrOfObj);
  }, function(err) {
    console.trace(err.message);
    res.send({ response: err.message });
  });
});
router.get('/universities', function(req, res){
  var query = req.query.q.split(" ");
  query = query[query.length - 1];

  models.es.suggest({
    index: "funds",
    body: {
      suggest: {
        text: query,
        completion: {
          "field": "suggest_universities"
        }
      }
    }
  }).then(function(resp) {
    var arrOfResults = resp.suggest[0].options;
    var arrOfObj = [];

    for (var i=0; i < arrOfResults.length; i++) {
      var wrapper = {};

      wrapper["id"] = arrOfResults[i].payload.university_id.toString();
      wrapper["name"] = arrOfResults[i].text;
      arrOfObj.push(wrapper);
    }

    res.send(arrOfObj);
  }, function(err) {
    console.trace(err.message);
    res.send({ response: err.message });
  });
})
router.get('/subjects', function(req, res){
  var query = req.query.q.split(" ");
  query = query[query.length - 1];

  models.es.suggest({
    index: "funds",
    body: {
      suggest: {
        text: query,
        completion: {
          "field": "suggest_subjects"
        }
      }
    }
  }).then(function(resp) {
    var arrOfResults = resp.suggest[0].options;
    var arrOfObj = [];

    for (var i=0; i < arrOfResults.length; i++) {
      var wrapper = {};

      wrapper["id"] = arrOfResults[i].payload.subject_id.toString();
      wrapper["name"] = arrOfResults[i].text;
      arrOfObj.push(wrapper);
    }

    res.send(arrOfObj);
  }, function(err) {
    console.trace(err.message);
    res.send({ response: err.message });
  });
})
router.get('/users', function(req, res){
  console.log(req.query);

  var query = req.query.term.split(" ");
  query = query[query.length - 1];
  console.log("AUTO QUERY" + query);

  models.es.suggest({
    index: "users",
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
})
module.exports = router;
