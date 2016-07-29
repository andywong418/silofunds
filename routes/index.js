var express = require('express');
var home = require('../controllers/home');
var users = require('../controllers/users-james');
var passport = require('passport');
var signup = require('../controllers/signup');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var models = require('../models')
var pzpt = require('../controllers/passport-james/functions');
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
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

// NOTE:If a user is logged in, then they should not be able to access fund pages, and vice versa
// router.get(/user/, function(req, res, next){
//   console.log(req.user)
//   if(req.user.organisation_or_user !== null) {
//     res.render(error);
//     res.end()
//   } else {
//     next();
//   }
// })

// NOTE: without below, an organisation can get onto user page.
// router.get(/organisation/, function(req, res, next){
//   console.log(req.user)
//   if(req.user.organisation_or_user == null) {
//     res.render(error);
//     res.end()
//   } else {
//     next();
//   }
// })

// *** Password reset
// GET forgotten password page (added some possible flash messages)
router.get('/forgot', function(req, res, next){
  // If they are already logged in, send them back to their home page
  if(req.isAuthenticated()){
    if(req.user.organisation_or_user !== null) {
      res.redirect('/organisation/home')
    } else {
      res.redirect('/user/profile')
    }
  }
  // Flash message logic
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

router.post('/forgot', function(req, res, next){
  models.users.find({where: {email: req.body.email}}).then(function(user){
    if(!user) {
      req.flash('error', 'No account with that email address exists.')
      res.redirect('/forgot')
    } else {
      var token = generateToken()
      user.update({
        country_of_residence: token
      }).then(function(user){
        // Nodemailer here
        transporter.sendMail({
          from: 'Contact <james.morrill.6@gmail.com>',
          to: user.email,
          subject: 'Hello',
          text: "Hi, James." + token,
          html: "<b>Please follow the following link to reset your password " + "http://localhost:3001/reset/" + token + " </b>"
        }, function (error, response) {
          //Email not sent
          if (error) {
            res.end("Email send failed");
          }
          //email send sucessfully
          else {
            console.log(response);
          }
        });


      })
    }
  })
})

router.get('/reset/:token', function(req, res, next) {
  res.render('user/reset')
})

router.post('/reset/:token', function(req, res, next) {
  var token = req.params.token
  console.log(token)
  models.users.find({where: {country_of_residence: token}}).then(function(user) {
    user.update({
      password: req.body.password
    }).then(function(user) {
      req.flash('passwordUpdated', 'Your password has been updated')
      res.redirect('/login')
    })
  })
})



// Nodemailer stuff
var mail = {
    from: '"James Morrill 👥" <james.morrill.6@gmail.com>', // sender address
    to: 'james.morrill.6@gmail.com, james.morrill.6@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

var transporter = nodemailer.createTransport(smtpTransport({
 service: 'Gmail',
 auth: { user: 'james.morrill.6@gmail.com',
       pass: 'exogene5i5' }
 }));


function generateToken() {
    var buf = new Buffer(16);
    for (var i = 0; i < buf.length; i++) {
        buf[i] = Math.floor(Math.random() * 256);
    }
    var id = buf.toString('base64');
    return id;
}
// Crypto, may be more secure, learn after
// var myFunction = function(done) {
//   crypto.randomBytes(20, function(err, buf) {
//     var token = buf.toString('hex');
//     done(err, token);
//   });
// }

module.exports = router;
