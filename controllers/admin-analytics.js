var models = require('../models');

module.exports = {
  index: function(req, res) {
    models.sequelize.query("select count(*) from users").spread(function(userCount, metadata) {
      userCount = userCount[0].count;

      models.sequelize.query('select distinct country_of_residence from users').spread(function(countries, metadata) {
        // Reformat array
        var newArr = [];
        for (var i = 0; i < countries.length; i++) {
          if (countries[i].country_of_residence) {
            for (var j = 0; j < countries[i].country_of_residence.length; j++) {
              var tag = countries[i].country_of_residence[j];
              if (newArr.indexOf(tag) == -1) {
                newArr.push(tag);
              }
            }
          }
        }

        // Case insensitive sorting
        newArr.sort(function (a, b) {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        newArr = newArr.join(" || ");

        res.render('admin/analytics', { distinct_countries: newArr, userCount: userCount });
      });
    });
  },

  seg_uk: function(req, res) {
    var tags = req.query.tags;
    var tagArray = [];

    for (var i = 0; i < tags.length; i++) {
      tagArray.push("'" + tags[i] + "'");
    }

    tagArray = tagArray.join(",");

    // Note that each tag in the tagArray has to be wrapped around single quote characters.
    models.sequelize.query("SELECT count(*) from users where array[" + tagArray + "]::text[] && country_of_residence").spread(function(count, metadata) {
      count = count[0].count;

      res.send(count);
      res.end();
    });
  },

  seg_colleges: function(req, res) {
    models.sequelize.query("select college, count(*) from users group by college").spread(function(data, metadata) {
      console.log(data);

      // Reformat array of objects
      var college_counts = {};

      for (var i = 0; i < data.length; i++) {
        if (data[i].college) {
          for (var j = 0; j < data[i].college.length; j++) {
            var college = data[i].college[j];
            if (college_counts.hasOwnProperty(college)) {
              college_counts[college] += parseInt(data[i].count);
            } else {
              college_counts[college] = parseInt(data[i].count);
            }
          }
        } else {
          // College field is null.
          college_counts["null"] = parseInt(data[i].count);
        }
      }

      res.send(college_counts);
      res.end();
    });
  }
}
