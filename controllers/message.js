var models = require('../models');

module.exports = {
  index: function(req, res) {
    models.users.findAll().then(function(users) {
      users = users.map(function(user) {
        return user.get();
      });

      res.render('messages', { allUsers: users });
    });
  }
};
