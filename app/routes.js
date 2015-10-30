var index = require('../routes/index');
var users = require('../routes/users');
var search = require('../routes/search');
var admin = require('../routes/admin');
var autocomplete = require('../routes/autocomplete');

module.exports.initialize = function (app) {
  app.use('/', index);
  app.use('/users', users);
  app.use('/search', search);
  app.use('/admin', admin);
  app.use('/autocomplete', autocomplete);
};
