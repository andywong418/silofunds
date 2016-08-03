var models = require('../models');
var bcrypt = require('bcrypt');

module.exports = {
  emailValidator: function(req, res){
    var email = req.body.email;
    var loginEmail = req.body.loginEmail;
    if(email){
      models.users.find({where: {email: email}}).then(function(user){
        if(user){
          res.send('There is already an account with this email address');
        }
        res.end();
      });
    } else {
      models.users.find({where: {email:loginEmail}}).then(function(user){
        if(!user){
          res.send('Please enter a valid email address');
        }
      });
    }
  },

  emailValidatorLogin: function(req, res){
    var email = req.body.email;
    models.users.find({where: {email: email}}).then(function(user){
      if(!user){
        res.send('There is no account with this email address');
        res.end();
      };
    });
  },

  passwordValidator: function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    if(password) {
      models.users.find({where: {email: email}}).then(function(user){
        if(!user){
          res.send('There is no account with this email address');
        } else {
          bcrypt.compare(password, user.password,function(err, result){
            if(!result){
              res.send('The password is incorrect');
            }
            else{
              res.send(200, null);
            }
          });
        }
      });
    }
  }
};
