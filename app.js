var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./app/routes');
var pg = require('pg');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
require('./controllers/passport')(passport);
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/silofunds_development';
var app = express();
var mcapi = require('mailchimp-api');
var mcKey;

if (process.env.MAILCHIMP_KEY) {
  mcKey = process.env.MAILCHIMP_KEY;
} else {
  var mailchimpKey = require('./secrets.js').mailchimpKey;
  mcKey = mailchimpKey;
}

mc = new mcapi.Mailchimp(mcKey);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

var redisHost = 'localhost';
var redisPort = 6379;
var rtg = null;
console.log(process.env);
if (process.env.REDIS_URL) {
    // redistogo connection
    console.log("REDISTOGO is ON");
    var rtg = require("url").parse(process.env.REDIS_URL);
    var redis = require('redis').createClient(rtg.port, rtg.hostname);
    redisPort = rtg.port;
    redisHost = rtg.hostname;
    redis.auth(rtg.auth.split(':')[1]);
    console.log("HERE IT IS", redis);
}
else{
  var redis = require("redis").createClient();
}

app.use(session({
  secret: 'so secret',
  cookie: { secure : false, maxAge: (4 * 60 * 60 * 1000)},
  store: new RedisStore({
    client: redis,
    host: redisHost,
    port: redisPort
  })
}));
app.use(passport.initialize());
app.use(passport.session());


// Load routes
routes.initialize(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
