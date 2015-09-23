var index = require('./index');
var users = require('./users');
var search = require('./search');

module.exports = function (app) {
  app.use('/', index);
  app.use('/users', users);
  app.use('/search', search);
};
