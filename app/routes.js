var index = require('../routes/index');
var users = require('../routes/users');
var search = require('../routes/search');
var funds = require('../routes/funds');
var signup = require('../routes/signup');
var login = require('../routes/login');
var auth = require('../routes/auth');

module.exports.initialize = function (app) {
  app.use('/', index);
  app.use('/users', users);
  app.use('/search', search);
  app.use('/funds', funds);
  app.use('/signup', signup);
  app.use('/login', login);
  app.use('/auth', auth);
};
