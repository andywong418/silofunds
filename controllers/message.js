var models = require('../models');

module.exports = {
  index: function(req, res) {
    models.users.findAll({ where: { id: { $ne: req.user.id }}}).then(function(users) {
      users = users.map(function(user) {
        return user.get();
      });

      res.render('messages', { allUsers: users, user: req.user });
    });
  }
};
