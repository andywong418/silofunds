var models = require('../models');


module.exports = {
   addUser: function(req, res){
     var username = req.body.username;
     var useremail = req.body.useremail;
     var userpassword = req.body.userpassword;
     models.users.create ({
     	username: username,
     	email: useremail,
     	password: userpassword
     })
     res.render('signup');
     }

}