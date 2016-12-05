var express = require('express');
var edit = require('../controllers/user-edit');
var fs = require('fs');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var upload_pictures;

if (!fs.existsSync(process.cwd() + '/tmp')) {
  fs.mkdirSync(process.cwd() + '/tmp');
}

var temporaryStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.cwd() + '/tmp')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  }
});
upload_pictures = multer({ storage: temporaryStorage });

router.post('/add-work', upload.single('file'), edit.addWork);
router.post('/add-description', edit.addDescription);
router.post('/delete-work', edit.deleteWork);
router.post('/profile-picture', upload_pictures.single('profile_picture'), edit.changePicture);
module.exports = router; 
