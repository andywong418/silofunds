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
  }
};
