var index = require('../routes/index');
var users = require('../routes/users');
var results = require('../routes/results');
var signup = require('../routes/signup');
var auth = require('../routes/auth');
var admin = require('../routes/admin');
var messages = require('../routes/messages');
var autocomplete = require('../routes/autocomplete');
var validation = require('../routes/validation');
var user_edit = require('../routes/user-edit');
var user = require('../routes/users');
var donors = require('../routes/donors');
var organisation = require('../routes/organisations');
var basicAuth = require('basic-auth');
var notifications = require('../routes/notifications');
var institutions = require('../routes/institutions');

var auth_admin = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Admin Authorization Required');
    return res.sendStatus(401);
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
  // Redirects
  if (process.env.NODE_ENV == 'production') {
    app.get('*', function(req, res, next) {
      if(req.headers['x-forwarded-proto']!='https') {
        res.redirect('https://www.silofunds.com'+req.url);
      } else {
        next(); /* Continue to other routes if we're not redirecting */
      }
    });
  }
  ////

  app.use('/', index);
  app.use('/results', results);
  app.use('/signup', signup);
  app.use('/auth', auth);
  app.use('/admin', auth_admin, admin);
  app.use('/autocomplete', autocomplete);
  app.use('/validation', validation);
  app.use('/user-edit', user_edit);
  app.use('/user', user);
  app.use('/donor', donors);
  app.use('/organisation', organisation);
  app.use('/messages', messages);
  app.use('/notifications', notifications);
  app.use('/institution', institutions);
};
