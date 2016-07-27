var express = require('express');
var home = require('../controllers/home');
var users = require('../controllers/users-james');
var passport = require('passport');
var signup = require('../controllers/signup');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer')
var models = require('../models')
var pzpt = require('../controllers/passport-james/functions');
require('../controllers/passport-james/strategies')(passport);
var router = express.Router();

router.get('/', home.index);
router.post('/subscribe', home.subscribe);


// Facebook auth strategy
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

// Login and register
// Login
router.get('/login', users.loginGET)
// Authenticate loginPOST request sends to intermediate route and then sends on to fun or user profile as we need info from the req
router.post('/login', passport.authenticate('loginStrategy', {
  successRedirect: '/loginSplit',
  failureRedirect: '/login'
}))
router.get('/loginSplit', users.loginSplitterGET)

// Register
router.get('/register', users.registerGET)
// Authenticate registerPOST request
router.post('/register', signup.subscribe, passport.authenticate('registrationStrategy', {
  successRedirect: '/registerSplit',
  failureRedirect: '/register'
}))
// Register splitter
router.get('/registerSplit', users.registerSplitterGET)


// If a user is logged in, then they should not be able to access fund pages, and vice versa
router.get(/user/, function(req, res, next){
  console.log(req.user)
  if(req.user.organisation_or_user !== null) {
    res.render(error);
    res.end()
  } else {
    next();
  }
})
router.get(/organisation/, function(req, res, next){
  console.log(req.user)
  if(req.user.organisation_or_user == null) {
    res.render(error);
    res.end()
  } else {
    next();
  }
})

// *** Password reset
// GET forgotten password page

router.get('/forgot', function(req, res, next){
  var error = req.flash('error')
  var info = req.flash('info')
  if(error.length !== 0) {
    res.render('user/forgot', {error: error})
  } else if(info.length !== 0) {
    res.render('user/forgot', {info: info})
  } else {
    res.render('user/forgot')
  }
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      models.users.find({where: {email: req.body.email}}).then(function(user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });

        ////


        var smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'SendGrid',
          auth: {
            user: '!!! YOUR SENDGRID USERNAME !!!',
            pass: '!!! YOUR SENDGRID PASSWORD !!!'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });

      });
    }
  ], function(err) {
    if (err) {console.log(err);}
    res.redirect('/forgot', function(err) {
      console.log(err);
    });
  });
});



module.exports = router;
