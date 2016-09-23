var models = require('../models');
var async = require('async');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
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
          asyncChangeFavourites(userId, nonAppliedFunds, res);
        });
    });
  },
  getWholePage: function(req, res){
    var userId = req.user.id;
    models.notifications.findAll({where: {user_id: userId}, order: 'created_at DESC'}).then(function(notifications){
      console.log("NOTIFC", userId);
      res.render('notifications', { user: userId, notifications: notifications});
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
        console.log("DIFFDAYS", diffDays);
        if(diffDays === 7 || diffDays <= 3){
          //create notification
          console.log("HIiiiii");
          var options;
          var checkWeek;
          if(diffDays == 7){
            options = {
              user_id: userId,
              notification: fund.title + ' has a deadline in 1 week! <a href="/organisation/options/' + fund.id + '"> Apply now. </a>',
              category: 'deadline',
              read_by_user: false
            };
            checkWeek = true;
          }
          else{
            options = {
              user_id: userId,
              notification: fund.title + ' has a deadline in ' + diffDays + ' days! <a href="/organisation/options/' + fund.id +'"> Apply now. </a>',
              category: 'deadline',
              read_by_user: false
            };
            checkWeek = false;
          }
          console.log("FAT COCK");
          models.notifications.find({where: options}).then(function(notif){
            console.log("NOTIF", notif);
            if(!notif){
              models.notifications.create(options).then(function(notif){
                notifArray.push(notif);
                if(checkWeek){
                  sendUserEmail(userId, fund.title + ' has a deadline in 1 week! <a href="http://silofunds/organisation/options/' + fund.id +'"> Apply now. </a>', callback, 'Fund deadline approaching!');
                }
                else{
                  sendUserEmail(userId, fund.title + ' has a deadline in ' + diffDays + ' days! <a href="http://silofunds/organisation/options/' + fund.id +'"> Apply now. </a>', callback, 'Fund deadline approaching!');
                }

              });
            }
            else{
              callback();
            }
          });
        }
        else{
          callback();
        }
      }
      else{
        callback();
      }
    });
  }, function done(){
    console.log("NOTIFARRAY");
    res.send(notifArray);
  });
}
function sendUserEmail(userId, notification, callback, subject){
  models.users.findById(userId).then(function(user){
    var username = user.username.split(' ')[0];
    //send emails here
    var transporter = nodemailer.createTransport(smtpTransport({
     service: 'Gmail',
     auth: {user: 'james.morrill.6@gmail.com',
           pass: 'exogene5i5'}
    }));
    var mailOptions = {
       from: 'Silofunds <james.morrill.6@gmail.com>',
       to: user.email,
       subject: subject,
       html: '<h3>Dear ' + username + ',</h3> <p>' + notification + '</p><img src="https://www.silofunds.com/images/silo-logo-coloured.png" style="width: 250px; height: 137px"> </img>'
    };
    transporter.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log("Email send failed");
            callback();
        }
        else {
          console.log("SUCCESS");
          callback();
        }
    });
  });
}
function updateDiffDays(date){
	var oneDay = 24*60*60*1000;
	var completionDate = new Date(date);
	var nowDate = Date.now();

	var diffDays = Math.round(Math.abs((completionDate.getTime() - nowDate)/(oneDay)));
	return diffDays;

}
