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

// router.get('/', function(req, res) {
//   req.flash('danger', 'Please signup from here.');
//   res.redirect('/');
// });
//REMOVED SIGNUP.SUBSCRIBE FOR TESTING.
router.post('/', signup.subscribe, passport.authenticate('local-signup', {
	failureRedirect: '/login/error'
}), function(req, res){
		Logger.info("AFTER MAILCHIMP");
    var username = req.body.username;
    var useremail = req.body.email;
    var userpassword = req.body.userpassword;
    var fundOption = req.body.fundOption;

	  req.session.lastPage = '/signup';
    models.users.find({
      where: {email: email}
    }).then(function(user){
      if(typeof fundOption == 'undefined'){
				Logger.info("HELLO");
        res.render('signup/new-user-profile', {user: user});
      }
      else{
        var organisationId = user.id;
        var scholarshipName = user.username;
        models.organisations.findOrCreate({where:{name: scholarshipName}}).spread(function(organisation, created){
          if(created){
            var organisation_id = organisation.id;
            models.users.findById(organisationId).then(function(organisation){
              organisation.update({
                organisation_or_user: organisation_id
              }).then(function(organisation){
                res.render('signup/new-fund-profile', {user: organisation});
              })

            })
          }
          else{
            var fundTableId = fund.id;
            fund.update({
              email: email
            }).then(function(fund){
              models.users.findById(fundId).then(function(fund){
                fund.update({
                  organisation_or_user: fundTableId
                }).then(function(fund){
                  res.render('signup/new-fund-profile', {user: fund});
                })
              })
            })
          }
        })
      }


    });
});
router.post('/results', function(req,res){
	res.redirect('/results');
});
router.get('/verify', signup.verifyEmail);
router.get('/verify/:token', signup.verifyEmailConfirm);
router.get('/user/:id', signup.userProfile);
router.post('/user/save', signup.saveUserSignup);
router.get('/user_signup/:id', signup.getSignupInfo);
router.post('/user_signup/profile_picture/:id', upload.single('profile_picture'), signup.uploadPicture);
router.post('/user_signup/work/:id', upload.array('past_work', 5), signup.uploadWork);
router.get('/organisation/:id', signup.fundProfile);
router.get('/fund_account/:id', signup.get);
router.post('/fund_signup/:id', upload.single('profile_picture'), signup.fundAccount);
router.post('/fund_signup/charity_no/:id', signup.insertCharityNumber);
router.post('/fund_signup/fund_data/:id', signup.insertFundData);


// Now edited
router.post('/user_signup_complete/', signup.uploadInfo);

module.exports = router;
