var index = require('../routes/index');
var users = require('../routes/users');
var search = require('../routes/search');
var funds = require('../routes/funds');

module.exports.initialize = function (app) {
  app.use('/', index);
  app.use('/users', users);
  app.use('/search', search);
  app.use('/funds', funds);
};
