var models = require('../models');
var AWS = require('aws-sdk');
var fs = require('fs');
var async = require('async');
var aws_keyid;
var aws_key;
var sequelize = require('sequelize');

if (process.env.AWS_KEYID && process.env.AWS_KEY) {
	aws_keyid = process.env.AWS_KEYID;
	aws_key = process.env.AWS_KEY;
} else {
	var secrets = require('../app/secrets');

	aws_keyid = secrets.AWS_KEYID;
	aws_key = secrets.AWS_KEY;
}

module.exports = {
  subscribe: function(req, res, next){
    var username = req.body.username;
    var email = req.body.useremail;
    var name = username.split(" ");
    var firstName = name[0];
    var lastName = name[1]
    mc.lists.subscribe({ id: '075e6f33c2', email: {email: req.body.useremail}, merge_vars: {
        EMAIL: email,
        FNAME: firstName,
        LNAME: lastName
        }}, function(data) {
      console.log("Successfully subscribed!");
      console.log('ending AJAX post request...');
      next();
    }, function(error) {
      if (error.error) {
        console.log(error.code + error.error);
      } else {
        console.log('some other error');
      }
      console.log('ending AJAX post request...');
      res.status(400).end();
    });
  },
  addUser: function(req, res, next){
    var username = req.body.username;
    var useremail = req.body.useremail;
    var userpassword = req.body.userpassword;

		req.session.lastPage = '/signup';
    console.log("REQ FOR REDIRECT", req);
    models.users.find({
      where: {email: useremail}
    }).then(function(user){
      if(!user) {
        models.users.create({
          username: username,
          email: useremail,
          password: userpassword,
          email_updates: true
        }).then(function(user){
          res.render('signup/signup', {user: user});
        });
      }
    });
  },

  userProfile: function(req, res){
    var userId = req.params.id;

		if (req.session.lastPage == '/signup') {
			models.users.findById(userId).then(function(user){
	      res.render('signup/new-user-profile', {user: user});
	    });
		} else {
			req.flash('danger', 'Please signup from here.');
			res.redirect('/');
		}
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
    console.log("CHECK REDIRECT", req);
    var userId = req.params.id,
    description = req.body.description,
    dateOfBirth = req.body.date_of_birth,
    nationality = req.body.nationality,
    religion = req.body.religion,
    fundingNeeded = req.body.funding_needed;
    console.log("INFO HERE?");;
    var religionArray = [];
    religionArray.push(religion);
    models.users.findById(userId).then(function(user){
      user.update({
        description: description,
        date_of_birth: dateOfBirth,
        nationality: nationality,
        religion: religionArray,
        funding_needed: fundingNeeded
      }).then(function(user){
        models.documents.findAll({
          where: {user_id: user.id}
        }).then(function(documents){
          var newUser = true;
          if(req.session.redirect_user){
            res.redirect('/results' + req.session.redirect_user);
          }
          else{
          res.render('signup/user-complete', {user: user, newUser: newUser, documents: documents, session: req.session, applications: false});
          }
        });
      });
    });
  },

  fundProfile: function(req, res){
    var fundId = req.params.id;
    models.users.findById(fundId).then(function(user){
      var scholarshipName = user.username;
      var email = user.email;
      var userId = user.id
      //see if fund already exists on fund table
      models.funds.findOrCreate({where:{title: scholarshipName}, defaults:{email: email}}).spread(function(user, created){
        console.log("EVEN HERE", created);
        
        if(created){
          console.log("LOOK AT ME", user);
          var fund_id = user.id;
          models.users.findById(fundId).then(function(user){
            user.update({
              fund_or_user: fund_id
            }).then(function(user){
              res.render('signup/new-fund-profile', {user: user});
            })
            
          })
        }

        else{
          console.log("JUST KIDDING WE HERE")
          var fundTableId = user.id;
          user.update({
            email: email
          }).then(function(user){
            models.users.findById(fundId).then(function(user){
              user.update({
                fund_or_user: fundTableId
              }).then(function(user){
                res.render('signup/new-fund-profile', {user: user});
              })
            })
          })
        }
      })
    });
  },
  get: function(req, res){
    var id = req.params.id;
    models.users.findById(id).then(function(user){
      var fundUser = user;
      models.funds.findById(user.fund_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){
            console.log(attrname);
            user["dataValues"][attrname] = fund[attrname];

          }         
        }
        res.json(user);
      })

    })

  },
  getTags:function(req, res){
    var id = req.params.id;
    console.log(req.body);
    var tagArray;
    var tags = req.body["tags[]"];
    if(Array.isArray(tags)){
      tagArray = tags;
    }
    else{
      tagArray= [];
      tagArray.push(tags);
    }
    console.log(tagArray);
    models.users.findById(id).then(function(user){
      models.funds.findById(user.fund_or_user).then(function(user){
        user.update({
          tags: tagArray
        }).then(function(data){
          res.send(data);
        })
      })
      
    })
  },
  getCountries: function(req, res){
    var id = req.params.id;
    console.log(req.body);
    var countriesArray;
    var countries = req.body["countries[]"];
    if(Array.isArray(countries)){
      countriesArray = countries;
   }
   else{
      countriesArray = [];
      countriesArray.push(countries);
     }
    console.log(countriesArray);
    models.users.findById(id).then(function(user){
      models.funds.findById(user.fund_or_user).then(function(user){
        user.update({
          countries: countriesArray
        }).then(function(data){
          res.send(data);
        })
      })
      
    })


  },
  getReligion: function(req, res){
     var id = req.params.id;
    var religionArray;
    var religion = req.body["religion[]"];
   if(Array.isArray(religion)){
      religionArray = religion;
   }
   else{
      religionArray = [];
      religionArray.push(religion);
     }
    console.log(religionArray);
    models.users.findById(id).then(function(user){
      user.update({religion: religionArray}).then(function(user){
        models.funds.findById(user.fund_or_user).then(function(fund){
          fund.update({
            religion: religionArray
          }).then(function(data){
            res.send(data);
          })
        })
      })

      
    })
  },
  getApplication: function(req, res){
    var id = req.params.id;
    models.users.findById(id).then(function(user){
      var fundUser = user;
      models.funds.findById(user.fund_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){

            user["dataValues"][attrname] = fund[attrname];

          }         
        }
        var fields= [];
        models.applications.find({where: {Fund_userid: fund.id, status: 'setup'}}).then(function(application){
          if(application){
            models.categories.findAll({where: {application_id: application.id}}).then(function(categories){
            // for (var category in categories){
            //   console.log(category);
            //   models.fields.findAll({where: {category_id : category['dataValues']['id']}}).then(function(fields){
            //     console.log(field)
            //   })
            user["dataValues"]["categories"] = categories;
            res.json(user);
           })
          }
          else{
            res.json(user);
          }
        
        })
      })

    })
  },
  fundAccount: function(req, res){
    var userId = req.params.id;
    var bucketName = "silo-fund-profile-" + userId;
    console.log(req.file);
    if (req.file){
      AWS.config.update({
        accessKeyId: aws_keyid,
        secretAccessKey: aws_key
      });
      var s3 = new AWS.S3({params: {Bucket: bucketName, Key: req.file.originalname, ACL: 'public-read'}});
      s3.headBucket(bucketName, function(err, data) {
        if (err) {
          s3.createBucket(function(err){
            if (err) { console.log("Error:", err); }
            else{
              s3.upload({Body: req.file.buffer, ContentType: req.file.mimetype}, function(){
                  models.users.findById(userId).then(function(user){
                    user.update({
                      profile_picture: "https://s3.amazonaws.com/" + bucketName + "/" + req.file.originalname
                    }).then(function(user){
                      res.send("GOT HIMMMMMMMM");
                    });
                  });
              });
            }
          });
        } else { // an error occurred so bucket doesn't exist
          s3.upload({Body: req.file.buffer, ContentType: req.file.mimetype}, function(){
            console.log("Uploaded picture.");
               models.users.findById(userId).then(function(user){
                    user.update({
                      profile_picture: "https://s3.amazonaws.com/" + bucketName + "/" + req.file.originalname
                    }).then(function(user){
                      res.send("GOT HIMMMMMMMM");
                    });
              });
          });
        }          // successful response- bucket exists
      });
    }
    else{
      console.log("BIG TINGS", req.body);
      models.users.findById(userId).then(function(user){
        user.update(req.body).then(function(user){
          models.funds.findById(user.fund_or_user).then(function(fund){
            fund.update(req.body).then(function(user){
              res.send(user);
            })
          })
          
        })
      })
    }
  },
  insertFundData: function(req, res){
    var userId = req.params.id;
    console.log("KENDRICK", req.body);
    models.users.findById(userId).then(function(user){
        var fundId = user.fund_or_user;
        console.log(fundId);
        models.funds.findById(fundId).then(function(user){
          console.log("HMMMMMMMMMMM", user);
          user.update(req.body).then(function(user){
            console.log("ERROR");
            res.send(user);
          })
        })
      
    })
  },
  applicationCategory: function(req, res){
    var fundId = req.params.id;
    var status = req.body.status;
    var title = req.body.title;
    console.log(fundId);
    models.applications.findOrCreate({
      where:{
      Fund_userid: fundId
    }, defaults: { status: status}}).spread(function(user, created){
      if(created){
        models.categories.create({
          title: title,
          application_id: user.id
        }).then(function(data){
          res.send(data);
        })
      }
      else{
        models.categories.find({where: {application_id: user.id}}).then(function(data){
        })
      }
    })
  },
  changeCategory: function(req, res){
    var fundId = req.params.id;
    var title = req.body.title;
    var categoryId = req.body.category_id;

    models.categories.findById(categoryId).then(function(category){
      category.update({
        title: title
      }).then(function(data){
        res.send(data);
      })
    })
  
  },
  deleteCategory: function(req, res){
    var categoryId = req.params.id;
    console.log("SOMETHING", categoryId);
    models.categories.findById(categoryId).then(function(category){
      category.destroy().then(function(){
        res.send("DESTROYED cateogory");
      })
    })
  },
  addCategory: function(req, res){
    var fundId = req.params.id;
    var title = req.body.title;
    models.applications.find({where: {Fund_userid: fundId, status: 'setup'}}).then(function(application){
      models.categories.create({
        title: title,
        application_id: application.id
      }).then(function(data){
        res.send(data);
      })
    })
  },

  addField: function(req, res){
    var categoryId = req.params.id;
    var html = JSON.stringify(req.body);
    console.log(html);
    // REMEMBER TO CHANGE TITLE TO HTML
    models.categories.findById(categoryId).then(function(category){
      models.fields.create({
        html: html,
        category_id: category.id
    }).then(function(data){
      res.send(data);
    })
    })
  
  },
  editField: function(req, res){
    var fieldId = req.params.id;
    var html = JSON.stringify(req.body);
    models.fields.findById(fieldId).then(function(field){
      field.update({
        html: html
      }).then(function(data){
        res.send(data);
      })
    })
  },

  getFields: function(req, res){
    console.log("SOMETGHIN");
    var catgoryId = req.params.id;
    models.fields.findAll({where: {category_id: catgoryId}}).then(function(data){
      if(data){
      res.send(data);
      }
    })
  },
  deleteField: function(req, res){
    var fieldId = req.params.id;
    models.fields.findById(fieldId).then(function(field){
      field.destroy().then(function(){
        res.send("DESTROYED IT");
      })
    })
  },
  signupFundComplete: function(req, res){
    var id = req.params.id;
    var session = req.sessionID;
    console.log("BOOYA", session);
    models.users.findById(id).then(function(user){
      var fundUser = user;
      models.funds.findById(user.fund_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){

            user["dataValues"][attrname] = fund[attrname];

          }         
        }
        var fields= [];
        models.applications.find({where: {Fund_userid: fund.id, status: 'setup'}}).then(function(application){
            models.categories.findAll({where: {application_id: application.id}}).then(function(categories){
            // for (var category in categories){
            //   console.log(category);
            //   models.fields.findAll({where: {category_id : category['dataValues']['id']}}).then(function(fields){
            //     console.log(field)
            //   })
            user["dataValues"]["categories"] = categories;
            res.render('signup/fund-profile', {user: user, newUser: true, session: session});
           })
          
        
        })
      })

    })
  }
};
