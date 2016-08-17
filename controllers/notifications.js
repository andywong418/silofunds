var models = require('../models');
var async = require('async');

module.exports = {
  newNotifications: function(req, res){
    var userId = req.user.id;
    models.notifications.findAll({where: {user_id: userId}, order: 'created_at DESC'}).then(function(notifications){
      res.send(notifications);
    });
  },
  readNotification: function(req, res){
    var notificationId = req.params.id;
    models.notifications.findById(notificationId).then(function(notification){
      notification.update(req.body).then(function(notification){
        res.send(notification);
      });
    });
  },
  deadlineReminder: function(req, res){
    var userId = req.user.id;
    models.applications.findAll({where: {user_id: userId}}).then(function(app){
        models.favourite_funds.findAll({where: {user_id: userId}}).then(function(favourite){
          var nonAppliedFunds = favourite.filter(function(obj){
            return app.indexOf(obj) == -1;
          });
          console.log("HEHE", nonAppliedFunds);
          asyncChangeFavourites(userId, nonAppliedFunds, res);
        });
    });
  }
};

//helper functions
function asyncChangeFavourites(userId, favourites, res){
  var notifArray = [];
  async.each(favourites, function(favourite, callback){
    models.funds.findById(favourite.fund_id).then(function(fund){
      if(fund.deadline){
        var diffDays = updateDiffDays(fund.deadline);
        if(diffDays === 7 || diffDays <= 3){
          //create notification
          var options;
          if(diffDays == 7){
            options = {
              user_id: userId,
              notification: fund.title + "'s deadline is in 1 week! <a href='/organisation/options/" + fund.id +" '> Apply now. </a>'",
              category: 'deadline',
              read_by_user: false
            };
          }
          else{
            options = {
              user_id: userId,
              notification: fund.title + "'s deadline is in " + diffDays + ' days! <a href="/organisation/options/' + fund.id +' "> Apply now. </a>',
              category: 'deadline',
              read_by_user: false
            };
          }

          models.notifications.find({where: options}).then(function(notif){
            console.log("NOTIF", notif);
            if(!notif){
              models.notifications.create(options).then(function(notif){
                notifArray.push(notif);
                callback();
              });
            }
            else{
              callback();
            }
          });
        }
      }
      else{
        callback();
      }
    });
  }, function done(){
    res.send(notifArray);
  });
}
function updateDiffDays(date){
	var oneDay = 24*60*60*1000;
	var completionDate = new Date(date);
	var nowDate = Date.now();

	var diffDays = Math.round(Math.abs((completionDate.getTime() - nowDate)/(oneDay)));
	return diffDays;

}
