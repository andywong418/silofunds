 var express = require('express');
var signup = require('../controllers/signup');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var params = [
{name: 'profile_picture', maxCount: 1},
{name: 'video_intro', maxCount: 1},
{name: 'past_work', maxCount: 5}
]

router.post('/', signup.addUser);
router.post('/results', function(req,res){
	res.redirect('/results');
})
// router.get('/fund/:id', signup.fundProfile);
router.get('/user/:id', signup.userProfile);
// router.post('/user/upload_picture/:id',upload.fields(params), signup.uploadPicture);
// router.post('user/upload_video/:id', upload.single('video_intro'), signup.uploadVideo);
// router.post('user/upload_work/:id'), upload.array('past_work', 5), signup.uploadWork);
router.post('/user_signup_complete/:id',upload.fields(params), signup.uploadPicture, signup.uploadWork, signup.uploadInfo);

module.exports = router;
