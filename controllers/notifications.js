var models = require('../models');
var async = require('async');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
var path = require('path');

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
                  sendUserEmail(userId, "http://silofunds/organisation/options/" + fund.id, fund.title + ' has a deadline in 1 week! ', 'Apply now.', callback, 'Fund deadline approaching!');
                }
                else{
                  sendUserEmail(userId,"http://silofunds/organisation/options/" + fund.id, fund.title + ' has a deadline in ' + diffDays + ' days! ', 'Apply now.', callback, 'Fund deadline approaching!');
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
var EmailTemplate = require('email-templates').EmailTemplate;

function sendUserEmail(userId, link, notiftext, notification, callback, subject){
  models.users.findById(userId).then(function(user){
    var username = user.username.split(' ')[0];
    //send emails here
    var locals = {
      header: 'Dear ' + username + ',',
      notif_link: link,
      notiftext: notiftext,
      notification: notification
    };
    var templatePath = path.join(process.cwd(), 'email-notification-templates');
    var template = new EmailTemplate(templatePath);

    var transporter = nodemailer.createTransport(smtpTransport({
     service: 'Gmail',
     auth: {user: 'notifications@silofunds.com',
           pass: 'notifaccount'}
    }));

    template.render(locals, function(err, results){
      if (err) {
         callback();
         return console.error(err);
      }
      transporter.sendMail({
        from: 'Silofunds',
        to: user.email,
        subject: subject,
        html: results.html
      }, function(err, responseStatus){
        if (err) {
         console.error(err);
         callback();
        }
        else{
          console.log("SUCCESS");
          console.log(responseStatus.message);
          callback();
        }

      });
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
