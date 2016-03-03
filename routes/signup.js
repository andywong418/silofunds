 var express = require('express');
var signup = require('../controllers/signup');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var passport = require('passport');
var params = [
{name: 'description'},
{name: 'birthday'},
{name: 'country'},
{name: 'religion'},
{name: 'fundingNeeded'}
];
require('../controllers/passport')(passport);
var models = require('../models');

router.get('/', function(req, res) {
  req.flash('danger', 'Please signup from here.');
  res.redirect('/');
});
router.post('/', signup.subscribe, passport.authenticate('local-signup', {
	failureRedirect: '/login/error'
}), function(req, res){
    var username = req.body.username;
    var useremail = req.body.useremail;
    var userpassword = req.body.userpassword;

		req.session.lastPage = '/signup';
    console.log("REQ FOR REDIRECT", req);
    models.users.find({
      where: {email: useremail}
    }).then(function(user){
    	console.log("AM I HERE?");
      res.render('signup/signup', {user: user});      
    });
});
router.post('/results', function(req,res){
	res.redirect('/results');
});
router.get('/user/:id', signup.userProfile);
router.post('/user_signup/profile_picture/:id', upload.single('profile_picture'), signup.uploadPicture);
router.post('/user_signup/work/:id', upload.array('past_work', 5), signup.uploadWork);
router.post('/user_signup_complete/:id', signup.uploadInfo);
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
