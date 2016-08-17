var express = require('express');
var notifications = require('../controllers/notifications');
var router = express.Router();

router.get('/new', notifications.newNotifications);
router.post('/readNotification/:id', notifications.readNotification);
router.get('/favourites', notifications.deadlineReminder);

module.exports = router;
