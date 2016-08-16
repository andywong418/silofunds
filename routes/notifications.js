var express = require('express');
var notifications = require('../controllers/notifications');
var router = express.Router();

router.get('/new', notifications.newNotifications);
router.post('/readNotification/:id', notifications.readNotification);

module.exports = router;
