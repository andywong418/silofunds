var index = require('../routes/index');
var users = require('../routes/users');
var results = require('../routes/results');
var signup = require('../routes/signup');
var login = require('../routes/login');
var auth = require('../routes/auth');
var admin = require('../routes/admin');
var autocomplete = require('../routes/autocomplete');
 var validation = require('../routes/validation');


module.exports.initialize = function (app) {
  app.use('/', index);
  app.use('/users', users);
  app.use('/results', results);
  app.use('/signup', signup);
  app.use('/login', login);
  app.use('/auth', auth);
  app.use('/admin', admin);
  app.use('/autocomplete', autocomplete);
   app.use('/validation', validation);
  };
