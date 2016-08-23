if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
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
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me-extended').Strategy;
require('./controllers/passport')(passport);
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var app = express();
var contentLength = require('express-content-length-validator');
var express_enforces_ssl = require('express-enforces-ssl');
var helmet = require('helmet');
var mcapi = require('mailchimp-api');
var mcKey = process.env.MAILCHIMP_KEY;
var gzip = require('connect-gzip');
mc = new mcapi.Mailchimp(mcKey);
var compression = require('compression');

var MAX_CONTENT_LENGTH_ACCEPTED = 9999;

Logger = require('./logger');

//Use prerender
app.use(require('prerender-node').set('prerenderToken', 'hCDkfgPPa4oQo1K3NZOW'));
// app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:1337/').set('prerenderToken', 'hCDkfgPPa4oQo1K3NZOW'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use(compression());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.argv.indexOf('--silent-http') === -1) {
  app.use(logger('dev'));
}
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var redisHost = 'localhost';
var redisPort = 6379;
var rtg = null;
if (process.env.REDIS_URL) {
    // redistogo connection
    var rtg = require("url").parse(process.env.REDIS_URL);
    var redis = require('redis').createClient(rtg.port, rtg.hostname);
    redisPort = rtg.port;
    redisHost = rtg.hostname;
    redis.auth(rtg.auth.split(':')[1]);
    Logger.info("HERE IT IS", redis);
}
else{
  var redis = require("redis").createClient();
}

app.use(session({
  secret: 'so secret',
  cookie: { secure: true, maxAge: 14400000, httpOnly: true },
  store: new RedisStore({
    client: redis,
    host: redisHost,
    port: redisPort
  }),
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(gzip.staticGzip(__dirname + '/bower_components/jquery/dist', { matchType: /javascript/ }));

// Security Shit
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use(express_enforces_ssl());
}
app.use(contentLength.validateMax({max: MAX_CONTENT_LENGTH_ACCEPTED, status: 400, message: "stop it!"})); // max size accepted for the content-length
app.use(helmet({ dnsPrefetchControl: false }));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hsts({
  maxAge: 10886400000,     // Must be at least 18 weeks to be approved by Google
  includeSubdomains: true, // Must be enabled to be approved by Google
  preload: true
}));
// TODO: This shit is not working out someone get on this.
// app.use(helmet.contentSecurityPolicy({
//   // Specify directives as normal.
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", "'unsafe-inline'", "https://*.hotjar.com", "'https://oss.maxcdn.com'", "'https://s3.amazonaws.com'"],
//     imgSrc: ["'self'", "http://33.media.tumblr.com"],
//     styleSrc: ["'self'", "https://fonts.googleapis.com"],
//   },
//   disableAndroid: false,
//   browserSniff: true
// }));

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
