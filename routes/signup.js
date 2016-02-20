 var express = require('express');
var signup = require('../controllers/signup');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var params = [
{name: 'profile_picture', maxCount: 1},
{name: 'video_intro', maxCount: 1},
{name: 'past_work', maxCount: 5}
];

router.get('/', function(req, res) {
  req.flash('danger', 'Please signup from here.');
  res.redirect('/');
});
router.post('/', signup.subscribe, signup.addUser);
router.post('/results', function(req,res){
	res.redirect('/results');
});
router.get('/user/:id', signup.userProfile);
router.post('/user_signup_complete/:id',upload.fields(params), signup.uploadPicture, signup.uploadWork, signup.uploadInfo);
router.get('/fund/:id', signup.fundProfile);
router.get('/fund/fund_account/:id', signup.get);
router.get('/fund/fund_account/application/:id', signup.getApplication);
router.post('/fund_signup/tags/:id', signup.getTags);
router.post('/fund_signup/countries/:id', signup.getCountries);
router.post('/fund_signup/religion/:id', signup.getReligion);
router.post('/fund_signup/:id', upload.single('profile_picture'), signup.fundAccount);
router.post('/fund_signup/fund_data/:id', signup.insertFundData);
router.post('/fund_signup/fund_application/:id', signup.applicationCategory);
router.post('/fund_signup/change_category/:id', signup.changeCategory);
router.get('/fund_signup/delete_category/:id', signup.deleteCategory);
router.post('/fund_signup/add_category/:id', signup.addCategory);
router.post('/fund_signup/add_field/:id', signup.addField);
router.post('/fund_signup/edit_field/:id', signup.editField);
router.get('/fund_signup/get_fields/:id', signup.getFields);
router.get('/fund_signup/delete_field/:id', signup.deleteField);
router.get('/fund_signup_complete/:id', signup.signupFundComplete);

module.exports = router;
