var models = require('../models');
var AWS = require('aws-sdk');
var fs = require('fs');
var async = require('async');
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

    })
    
    
  },
  userProfile: function(req, res){
    var userId = req.params.id;
    console.log("IS IT GETTING THROUGH?", userId);
    models.users.findById(userId).then(function(user){
      console.log("CHECK AGAIN THE USER", user);
      res.render('signup/new-user-profile', {user: user});
    })
  },
  // uploadInfo:function(req,res){
  //   var userId = req.params.id;
  //   models.users.findById(userId).then(function(user){
  //           console.log("CHECK AGAIN THE USER", user);
  //           res.render('signup/user-complete', {user: user});
  //     })
  // },
  uploadPicture: function(req,res, next){
    var userId = req.params.id;
    var idString = req.params.id.toString();
    var bucketString = "silo-user-profile-";
    var bucketName = bucketString.concat(idString);
    
    AWS.config.update({
    accessKeyId: 'AKIAJAZVDFTFRHXLNUOA',
    secretAccessKey: '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'
    });
    console.log("CHECK HERE", req.files.profile_picture[0].originalname); 
    var s3 = new AWS.S3({params: {Bucket: bucketName, Key: req.files.profile_picture[0].originalname, ACL: 'public-read'}});
    s3.headBucket(bucketName, function(err, data) {
      if (err) {
        s3.createBucket(function(err){
          if (err) { console.log("Error:", err); }
          else{
            s3.upload({Body: req.files.profile_picture[0].buffer, ContentType: req.files.profile_picture[0].mimetype}, function(){       
                console.log("Picture uploaded to bucket");
                models.users.findById(userId).then(function(user){
                  console.log("CHECK AGAIN THE USER", user);
                  user.update({
                    profile_picture: "https://s3.amazonaws.com/" + bucketName + "/" + req.files.profile_picture[0].originalname
                  })   
                });
                next();
            });
          }
        })
      } // an error occurred so bucket doesn't exist
      else   {
        s3.upload({Body: req.files.profile_picture[0].buffer, ContentType: req.files.profile_picture[0].mimetype}, function(){
              console.log("Successfully uploaded picture to bucket");   
              next();    
        });
       
      };           // successful response- bucket exists
    });
  },
  uploadWork: function(req, res, next){

    var userId = req.params.id;
    var bucketName = "silo-user-profile-" + userId;
    AWS.config.update({
    accessKeyId: 'AKIAJAZVDFTFRHXLNUOA',
    secretAccessKey: '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'
    });
    var linkArray = [];
    async.eachSeries(req.files.past_work, function iterator(item, callback){
        console.log("CHECKING INITINTINTINIT", item)
        var s3 = new AWS.S3({params: {Bucket:bucketName, Key: item.originalname, ACL: 'public-read'}});
      
        s3.upload({Body: item.buffer, ContentType: item.mimetype}, function(){
                console.log("Successfully uploaded one piece of work to bucket"); 
                linkArray.push("https://s3.amazonaws.com/" + bucketName + "/" + item.originalname);
                callback();
               
                  // models.users.findById(userId).then(function(user){
                  //   console.log("CHECK AGAIN THE USER", user);
                  //   user.update({
                  //     past_work: linkArray
                  //   })
                  // });
                
        })
    }, function done() {
        models.users.findById(userId).then(function(user){
                    console.log("CHECK AGAIN THE USER", user);
                    console.log("CHECK THE ARRAY", linkArray);
                    user.update({
                      past_work: linkArray
                    }).then(function(){
                      next();
                    })
                    
                  });
    })

   
    
  },
  uploadInfo: function(req, res){
    console.log(req.body);
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
    }).then(function(){
       res.render('signup/user-complete'); 
    })

    });
  }

}
