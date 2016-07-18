var models = require('../../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');



// Export passport strategies
module.exports = function(passport) {


  //  Serialize and deserialize
  passport.serializeUser(function(user, done){
     done(null, user);
  });
  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });


  // Create a login strategy
  passport.use('loginStrategy', new LocalStrategy({
  // By default, local strategy uses username and password
    usernameField: 'useremail',
    passwordField: 'password'
  },
  function(username, password, done) {
    models.users.find({where: {email: username}}).then(function(user) {
      if (!user) {
        return done(null, false, {message: 'There is no account under this name.'});
      } bcrypt.compare(password, user.password, function(err, res) {
          if (!res) {
            return done(null, false, {message: 'Wrong password'});
          } else {
            console.log(user);
            return done(null, user);
          }
      });
    });
  }));



  // Create a registraton strategy
  passport.use('registrationStrategy', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passReqToCallback : true
    },
  function(req, email, password, done) {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      models.users.find({where: {email: email}}).then(function(user){
        var data = req.body
        if(!user && data.password == data.confirmPassword) {
          // set username to be fund name or firstname + last name,
          var username = data.firstName + data.lastName + data.fundName;
          models.users.create({
            username: username,
            email: data.email,
            password: data.password,
            email_updates: true
          }).then(function(user){
            // Sending flash as logout message for brevity, since the alert is of the same form
            return done(null, user, req.flash('logoutMsg', 'Your account has been created, you may now login'));
          });
        } else if (data.password !== data.confirmPassword) {
          return done(null, false, req.flash('flashMsg', 'Passwords did not match'))
        } else {
          return done(null, false, req.flash('flashMsg', 'Sorry, that email has already been used'))
        }
      });
    });
  }));





}
