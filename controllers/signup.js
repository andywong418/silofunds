var models = require('../models');
var url = require('url');
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
var previousPage;
function changeArrayfields(fields, arrayFields){
  for(var i =0 ; i <arrayFields.length; i++){
    if(fields[arrayFields[i] + '[]']){
      var emptyArray = []
      fields[arrayFields[i]] = emptyArray.concat(fields[arrayFields[i] + '[]']);
    }
  }
  return fields;
}
function moderateObject(objectFields){
  for(var key in objectFields){
    if(objectFields[key] === ''){
      delete objectFields[key];
    }
  }
  return objectFields;
}
module.exports = {
  subscribe: function(req, res, next){
    var username = req.body.username;
    var email = req.body.useremail;
    var name = username.split(" ");
    var firstName = name[0];
    var lastName = name[1];
		previousPage = url.parse(req.headers.referer).path;
    mc.lists.subscribe({ id: '075e6f33c2', email: {email: req.body.useremail}, merge_vars: {
        EMAIL: email,
        FNAME: firstName,
        LNAME: lastName
        }}, function(data) {
      next();
    }, function(error) {
      if (error.error) {
        console.log(error.code + error.error);

      } else {
        console.log('some other error');
      }
      console.log('ending AJAX post request...');
      res.status(400);
			res.redirect('/');
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
	saveAbout: function(req, res){

		var userId = req.user.id;
		req.body = changeArrayfields(req.body, ['country_of_residence']);
		req.body = moderateObject(req.body);
		console.log(userId);
		models.users.findById(userId).then(function(user){
			console.log(req.body);
			user.update(req.body).then(function(user){

				res.send(user);
			})
		})
	},
 getSignupInfo: function(req, res){
	 console.log("GET IN");
	 var userId = req.params.id;
	 models.users.findById(userId).then(function(user){
		 user = user.get();
		 res.json(user);
	 })
 },
  uploadPicture: function(req,res){
    var userId = req.params.id;
    var idString = req.params.id.toString();
    var bucketString = "silo-user-profile-";
    var bucketName = bucketString.concat(idString);
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
                  });
                });
                console.log('uploaded picture');
                res.end();
            });
          }
        });
      } else { // an error occurred so bucket doesn't exist
        s3.upload({Body: req.file.buffer, ContentType: req.file.mimetype}, function(){
          console.log("Uploaded picture.");
          res.end();
        });
      }          // successful response- bucket exists
    });
  },

  uploadWork: function(req, res){
    var userId = req.params.id;
    var bucketName = "silo-user-profile-" + userId;

    AWS.config.update({
      accessKeyId: aws_keyid,
      secretAccessKey: aws_key
    });
    async.eachSeries(req.files, function iterator(item, callback){
        var s3 = new AWS.S3({params: {Bucket:bucketName, Key: item.originalname, ACL: 'public-read'}});
        s3.upload({Body: item.buffer, ContentType: item.mimetype}, function(){
          models.documents.upsert({
            link: "https://s3.amazonaws.com/" + bucketName + "/" + item.originalname,
            user_id: userId
          }).then(function(document){

            callback();
          });
        });
    }, function done() {
        res.end();
      });
  },
  uploadInfo: function(req, res){
    var userId = req.params.id,
    description = req.body.description,
    dateOfBirth = req.body.date_of_birth,
    nationality = req.body.nationality,
    religion = req.body.religion;
    fundingNeeded = req.body.funding_needed;
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
            res.redirect(previousPage);
          }
          else{
						var userFields =  ["username","profile_picture","description","past_work","date_of_birth","nationality","religion","funding_needed","organisation_or_user"];
						var wrapper = {};

						for (var i = 0; i < userFields.length ; i++) {
							wrapper[userFields[i]] = user[userFields[i]];
						}

						wrapper["suggest"] = { "input": user.username };
						models.es.create({
							index: 'users',
							type: 'user',
							id: user.id,
							body: wrapper
						}, function(error, response){
							res.render('signup/user-complete', {user: user, newUser: newUser, documents: documents, applications: false});
						})

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
        if(created){
          var fund_id = user.id;
          models.users.findById(fundId).then(function(user){
            user.update({
              organisation_or_user: fund_id
            }).then(function(user){
              res.render('signup/new-fund-profile', {user: user});
            })

          })
        }

        else{
          var fundTableId = user.id;
          user.update({
            email: email
          }).then(function(user){
            models.users.findById(fundId).then(function(user){
              user.update({
                organisation_or_user: fundTableId
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
		console.log(id);
    models.users.findById(id).then(function(user){
      models.organisations.findById(user.organisation_or_user).then(function(organisation){
        for (var attrname in organisation['dataValues']){
          if(attrname != "id" && attrname != "description" && attrname != "created_at" && attrname != "updated_at"){
            user["dataValues"][attrname] = organisation[attrname];
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
      models.funds.findById(user.organisation_or_user).then(function(user){
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
      models.funds.findById(user.organisation_or_user).then(function(user){
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
        models.funds.findById(user.organisation_or_user).then(function(fund){
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
      models.funds.findById(user.organisation_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){

            user["dataValues"][attrname] = fund[attrname];

          }
        }
        var fields= [];
        models.applications.find({where: {fund_id: fund.id, status: 'setup'}}).then(function(application){
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
			//description
      console.log("BIG TINGS", req.body);
      models.users.findById(userId).then(function(user){
        user.update(req.body).then(function(user){
          res.send(user);
        })
      })
    }
  },
	insertCharityNumber: function(req, res){
		var userId = req.params.id;
		var charityId = req.body.charity_number;
		console.log(charityId);
		models.users.findById(userId).then(function(user){
			var fundId = user.organisation_or_user;
			models.organisations.findById(fundId).then(function(fund){
				fund.update({
					charity_id: charityId
				}).then(function(fund){
					res.send(fund);
				})
			})
		})
	},
  insertFundData: function(req, res){
		//edit for organisations
    var userId = req.params.id;
    models.users.findById(userId).then(function(user){
        var fundId = user.organisation_or_user;
        console.log(fundId);
        models.funds.findById(fundId).then(function(user){
          user.update(req.body).then(function(user){
            console.log("ERROR");
            res.send(user);
          })
        })

    })
  },
  signupFundComplete: function(req, res){
    var id = req.params.id;
    models.users.findById(id).then(function(user){
      var fundUser = user;
      models.funds.findById(user.organisation_or_user).then(function(fund){
        for (var attrname in fund['dataValues']){
          if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at"){

            user["dataValues"][attrname] = fund[attrname];

          }
        }
        var fields= [];
        models.applications.find({where: {fund_id: fund.id, status: 'setup'}}).then(function(application){
            models.categories.findAll({where: {application_id: application.id}}).then(function(categories){
            // for (var category in categories){
            //   console.log(category);
            //   models.fields.findAll({where: {category_id : category['dataValues']['id']}}).then(function(fields){
            //     console.log(field)
            //   })
            user["dataValues"]["categories"] = categories;
            res.render('signup/fund-dashboard', {user: user, newUser: true});
           })


        })
      })

    })
  }
};
