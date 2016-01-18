var models = require('../models');

module.exports = {
  addUser: function(req, res){
    var username = req.body.username;
    var useremail = req.body.useremail;
    var userpassword = req.body.userpassword;
    models.users.find({
      where: {email: useremail}
    }).then(function(user){
      if(!user) {
        models.users.create({
          username: username,
          email: useremail,
          password: userpassword
        }).then(function(user){
          res.render('signup/signup', {user: user});
        });
      }
    });


  },
  userProfile: function(req, res){
    var userId = req.params.id;
    console.log("IS IT GETTING THROUGH?", userId);
    models.users.findById(userId).then(function(user){
      console.log("CHECK AGAIN THE USER", user);
      res.render('signup/new-user-profile', {user: user});
    });
  }
};
