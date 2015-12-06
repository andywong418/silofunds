var index = require('../routes/index');
var users = require('../routes/users');
var search = require('../routes/search');
var signup = require('../routes/signup');
var login = require('../routes/login');
var auth = require('../routes/auth');
var admin = require('../routes/admin');
var autocomplete = require('../routes/autocomplete');
var emailValidation = require('../routes/emailValidation');
var passwordValidation = require('../routes/passwordValidation');

module.exports.initialize = function (app) {
  app.use('/', index);
  app.use('/users', users);
  app.use('/search', search);
  app.use('/signup', signup);
  app.use('/login', login);
  app.use('/auth', auth);
  app.use('/admin', admin);
  app.use('/autocomplete', autocomplete);
  app.use('/emailValidation', emailValidation);
  app.use('/passwordValidation', passwordValidation);
};
