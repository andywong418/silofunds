var index = require('../routes/index');
var users = require('../routes/users');
var results = require('../routes/results');
var signup = require('../routes/signup');
var login = require('../routes/login');
var auth = require('../routes/auth');
var admin = require('../routes/admin');
var autocomplete = require('../routes/autocomplete');
var validation = require('../routes/validation');
var user_edit = require('../routes/user-edit');
var basicAuth = require('basic-auth');

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Admin Authorization Required');
    return res.send(401);
  }

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASS) {
    // On production
    if (user.name === process.env.ADMIN_USERNAME && user.pass === process.env.ADMIN_PASS) {
      return next();
    } else {
      return unauthorized(res);
    }
  } else {
    // Local
    var adminUsers = require('./secrets.js').adminUsers;

    if (user.pass === adminUsers[user.name]) {
      return next();
    } else {
      return unauthorized(res);
    }
  }
};

module.exports.initialize = function (app) {
  app.use('/', index);
  app.use('/users', users);
  app.use('/results', results);
  app.use('/signup', signup);
  app.use('/login', login);
  app.use('/auth', auth);
  app.use('/admin', auth, admin);
  app.use('/autocomplete', autocomplete);
  app.use('/validation', validation);
  app.use('/user-edit', user_edit);
};;