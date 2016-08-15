var models = require('../models');
var async = require('async');

module.exports = {
  index: function(req, res) {
    if(req.isAuthenticated()){
      var userId = req.user.id;
      var allUsers = [];
      models.messages.findAll({where: {user_from: userId}}).then(function(messages){
        if(messages.length > 0){
          async.each(messages, function(message, callback){
            var userObj = {};
            //Only handle one to one user first
            models.users.findById(message.user_to[0]).then(function(user){
              if(user.profile_picture){
                userObj['profile_picture'] = user.profile_picture;
              }
              userObj['username'] = user.username;
              userObj['id'] = user.id;
              allUsers.push(userObj);
              callback();
            });
          }, function done(){
            res.render('messages', {allUsers: allUsers, user: req.user});
          });
        }
        else{
          res.render('messages', {allUsers: false, user: req.user});
        }

      });
    }
    else{
      res.redirect('/login');
    }

  },
  messageUser: function(req, res){
    if(req.isAuthenticated()){
      var userTo = req.params.id;
      var userFrom = req.user.id;
      var allUsers = [];
      var userCount = 0;
      // return all relevant messages and push the new user on
      models.messages.findAll({where: {user_from: userFrom}}).then(function(messages){
        if(messages.length > 0){
          async.each(messages, function(message, callback){
            var userObj = {};
            console.log("message to", message.user_to[0]);
            //Only handle one to one user first
            models.users.findById(message.user_to[0]).then(function(user){
              console.log(user);
              if(user.profile_picture){
                userObj['profile_picture'] = user.profile_picture;
              }
              userObj['username'] = user.username;
              userObj['id'] = user.id;
              if(user.id == userTo){
                // if person you message is there already, push them to the top of the array
                allUsers.unshift(userObj);
                userCount++;
              }
              else{
                allUsers.push(userObj);
              }
              console.log("array check", allUsers);

              callback();
            });
          }, function done(){
            if(userCount === 0){
              //new message to someone never messaged before
              models.users.findById(userTo).then(function(user){
                user = user.get();
                allUsers.unshift(user);
                res.render('messages', {allUsers: allUsers, user: req.user});
              });
            }
            if(userCount > 0){
              res.render('messages', {allUsers: allUsers, user: req.user});

            }
          });
        }
        else{
          //first message ever
          models.users.findById(userTo).then(function(user){
            user = user.get();
            allUsers.push(user);
            res.render('messages', {allUsers: allUsers, user: req.user});

          });
        }

      });
    }
    else{
      res.redirect('/login');
    }

  }
};
