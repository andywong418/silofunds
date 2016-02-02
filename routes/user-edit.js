var express = require('express');
var edit = require('../controllers/user-edit');
var router = express.Router();
var multer = require('multer');
var upload = multer();

router.post('/add-work', upload.single('file'), edit.addWork);
router.post('/add-description', edit.addDescription);
router.post('/delete-work', edit.deleteWork);
router.post('/profile-picture', upload.single('profile_picture'), edit.changePicture);

module.exports = router; 