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
  },

  seg_subjects: function(req, res) {
    models.sequelize.query("select subject, count(*) from users group by subject").spread(function(data, metadata) {
      console.log(data);

      // NOTE: Think about whether we need to split up field values into unique subjects. We're losing information if we do unique. Number of people studying "law and history" is different from number of people studying "law" and then "history"...

      // NOTE: See seg_colleges method for example, it's already implemented there.

      // Reformat array
      var subject_counts = {};

      for (var i = 0; i < data.length; i++) {
        if (data[i].subject) {
          for (var j = 0; j < data[i].subject.length; j++) {
            var subject = data[i].subject[j].toLowerCase();
            if (subject_counts.hasOwnProperty(subject)) {
              subject_counts[subject] += parseInt(data[i].count);
            } else {
              subject_counts[subject] = parseInt(data[i].count);
            }
          }
        } else {
          // Subject field is null
          subject_counts["null"] = parseInt(data[i].count);
        }
      }

      res.send(subject_counts);
      res.end();
    });
  }
}
