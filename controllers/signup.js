var models = require('../models');
var AWS = require('aws-sdk');
var fs = require('fs');
var async = require('async');
var aws_keyid;
var aws_key;

if (process.env.AWS_KEYID && process.env.AWS_KEY) {
	aws_keyid = process.env.AWS_KEYID;
	aws_key = process.env.AWS_KEY;
} else {
	var secrets = require('../app/secrets');

	aws_keyid = secrets.AWS_KEYID;
	aws_key = secrets.AWS_KEY;
}

module.exports = {
  addUser: function(req, res){
    var username = req.body.username;
    var useremail = req.body.useremail;
    var userpassword = req.body.userpassword;
    models.users.find({
      where: {email: useremail}
    }).then(function(user){
      if(!user) {
        models.users.create({
          username: username,
          email: useremail,
          password: userpassword
        }).then(function(user){
          res.render('signup/signup', {user: user});
        });
      }
    });
  },

  userProfile: function(req, res){
    var userId = req.params.id;
    models.users.findById(userId).then(function(user){
      res.render('signup/new-user-profile', {user: user});
    });
  },

  uploadPicture: function(req,res, next){
    var userId = req.params.id;
    var idString = req.params.id.toString();
    var bucketString = "silo-user-profile-";
    var bucketName = bucketString.concat(idString);

    AWS.config.update({
    accessKeyId: aws_keyid,
    secretAccessKey: aws_key
    });
    var s3 = new AWS.S3({params: {Bucket: bucketName, Key: req.files.profile_picture[0].originalname, ACL: 'public-read'}});
    s3.headBucket(bucketName, function(err, data) {
      if (err) {
        s3.createBucket(function(err){
          if (err) { console.log("Error:", err); }
          else{
            s3.upload({Body: req.files.profile_picture[0].buffer, ContentType: req.files.profile_picture[0].mimetype}, function(){
                models.users.findById(userId).then(function(user){
                  user.update({
                    profile_picture: "https://s3.amazonaws.com/" + bucketName + "/" + req.files.profile_picture[0].originalname
                  });
                });
                next();
            });
          }
        });
      } else { // an error occurred so bucket doesn't exist
        s3.upload({Body: req.files.profile_picture[0].buffer, ContentType: req.files.profile_picture[0].mimetype}, function(){
          console.log("Uploaded picture.");
          next();
        });
      }          // successful response- bucket exists
    });
  },

  uploadWork: function(req, res, next){
    var userId = req.params.id;
    var bucketName = "silo-user-profile-" + userId;
    AWS.config.update({
      accessKeyId: aws_keyid,
      secretAccessKey: aws_key
    });
    async.eachSeries(req.files.past_work, function iterator(item, callback){
        var s3 = new AWS.S3({params: {Bucket:bucketName, Key: item.originalname, ACL: 'public-read'}});
        s3.upload({Body: item.buffer, ContentType: item.mimetype}, function(){
          console.log("Uploading work...");
          console.log("https://s3.amazonaws.com/" + bucketName + "/" + item.originalname);
          console.log(userId);
          models.documents.upsert({
            link: "https://s3.amazonaws.com/" + bucketName + "/" + item.originalname,
            user_id: userId
          }).then(function(document){
            console.log("CHECKING HERE", document);
            callback();
          });
        });
    }, function done() {
        console.log("Uploaded work.");
        next();
      });
  },
  uploadInfo: function(req, res){
    console.log("Uploading info...");
    var userId = req.params.id,
    description = req.body.description,
    dateOfBirth = req.body.date_of_birth,
    nationality = req.body.nationality,
    religion = req.body.religion,
    fundingNeeded = req.body.funding_needed;

    models.users.findById(userId).then(function(user){
      user.update({
        description: description,
        date_of_birth: dateOfBirth,
        nationality: nationality,
        religion: religion,
        funding_needed: fundingNeeded
      }).then(function(user){
        models.documents.findAll({
          where: {user_id: user.id}
        }).then(function(documents){
          var newUser = true;
          res.render('signup/user-complete', {user: user, newUser: newUser, documents: documents, session: req.sessionID});
        });
      });
    });
  }
};
