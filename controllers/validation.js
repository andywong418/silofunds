var models = require('../models');
var bcrypt = require('bcrypt');

module.exports = {
  emailValidator: function(req,res){
    var email = req.query.email;
    var loginEmail = req.query.loginEmail;

    if(email){
      models.users.find({where: {email: email}}).then(function(user){
        if(user){
          res.send('There is already an account under this email address');
        }
        res.end();
      });
    } else {
      models.users.find({where:{email:loginEmail}}).then(function(user){
        if(!user){
          res.send('Please enter a valid email address');
        }
      });
    }
  },

  passwordValidator: function(req, res){
    var email = req.body.email;
    var password = req.body.password;

    models.users.find({where: {email: email}}).then(function(user){
      if(!user){
        res.send('There is no account under this email address');
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
};
