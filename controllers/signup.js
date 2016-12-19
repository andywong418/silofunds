var models = require('../models');
var url = require('url');
var AWS = require('aws-sdk');
var fs = require('fs');
var async = require('async');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// require('./passport/strategies')(passport);
var passportFunctions = require('./passport/functions');
var aws_keyid;
var aws_key;
var sequelize = require('sequelize');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');
var crypto = require('crypto');
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
var es = require('../elasticsearch');
var EmailTemplate = require('email-templates').EmailTemplate;

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
	subscribe: function(req, res, next) {
		var username = "";
		if(req.body.fundName !== "") {
			username = req.body.fundName
		}
		if(req.body.firstName && req.body.lastName) {
			username = req.body.firstName + ' ' + req.body.lastName
		}
		if(req.body.username){
			username = req.body.username;
		}
		var email = req.body.email;
		var name = username.split(" ");
		var firstName = name[0];
		var lastName = name[1];
		// previousPage = url.parse(req.headers.referer).path; // Commented out for testing reasons
		Logger.info("PREVIOUS", firstName);
		Logger.info("HI", lastName);
		Logger.info("EMAIL", email);
		next();
		// mc.lists.subscribe({ id: '075e6f33c2', email: {email: email}, merge_vars: {
		// 		EMAIL: email,
		// 		FNAME: firstName,
		// 		LNAME: lastName
		// 		}}, function(data) {
		// 	next();
		// }, function(error) {
		// 	if (error.error) {
		// 		Logger.info(error.code + error.error);
		//
		// 	} else {
		// 		Logger.info('some other error');
		// 	}
		// 	Logger.info('ending AJAX post request...');
		// 	res.status(400);
		// 	res.redirect('/');
		// });
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
	saveUserSignup: function(req, res) {
		var userId = req.user.id;
		var arrayFields = ['country_of_residence','subject', 'target_degree', 'previous_degree', 'target_university', 'previous_university','college'];
		req.body = changeArrayfields(req.body, arrayFields);
		req.body = moderateObject(req.body);
		Logger.info(userId);
		models.users.findById(userId).then(function(user){
			user.update(req.body).then(function(user){
				if (req.body['breakdown']){
					console.log("breakdown", req.body.breakdown);
					var breakdownArray = JSON.parse(req.body.breakdown);
					console.log("breakdown again", breakdownArray);
					async.each(breakdownArray, function(breakdown, callback) {
						breakdown.user_id = userId;
						console.log("breakdwon", breakdown);
						models.cost_breakdowns.findOrCreate({where: {segment: breakdown.segment}}).spread(function(individualBreakdown, created){
							if(created){
								individualBreakdown.update({user_id: userId, cost: breakdown.cost}).then(function(){
									callback();
								});
							} else {
								console.log("COST", breakdown.cost);
								if(breakdown.cost){
									individualBreakdown.update({cost: breakdown.cost}).then(function(){
										callback();
									});
								} else {
									callback();
								}
							}
						}, function done(){
							res.send(user);
						});
					});
				} else {
					res.send(user);
				}
			});
		});
	},
	removeBreakdown:function(req, res){
		var breakdownId = req.params.id;
		models.cost_breakdowns.findById(breakdownId).then(function(breakdown){
		breakdown.destroy().then(function(){
			res.send(breakdown);
		})
		});
	},
 getSignupInfo: function(req, res){
	 var userId = req.params.id;
	 models.users.findById(userId).then(function(user){
		 user = user.get();
		 models.documents.findAll({where:{user_id: user.id} }).then(function(documents){
			 user.documents = documents;
			 res.json(user);
		 });
	 });
 },
	uploadPicture: function(req,res){
		var userId = req.params.id;
		var idString = req.params.id.toString();
		var folderString = "silo-user-profile-" + userId + '/';
		var bucketName = "silo-user-profiles";
		AWS.config.update({
		accessKeyId: aws_keyid,
		secretAccessKey: aws_key
		});
		var s3 = new AWS.S3();
		var params = {Bucket: bucketName, Key: folderString + req.file.originalname, ACL: 'public-read', Body: req.file.buffer, ContentType: req.file.mimetype};
			s3.putObject(params, function(err, data){
					if(err){
						console.log("ERR", err);
					}
					else{
						console.log("DATA", data);
					}
					models.users.findById(userId).then(function(user){
						user.update({
							profile_picture: "https://s3-us-west-2.amazonaws.com/" + bucketName + "/" + folderString+ encodeURIComponent(req.file.originalname)
						});
					});
					Logger.info('uploaded picture');
					res.end();
			});
	},

	uploadWork: function(req, res){
		var userId = req.params.id;
		var bucketName = "silo-user-profiles";
		var folderString = "silo-user-profile-" + userId + '/';

		AWS.config.update({
			accessKeyId: aws_keyid,
			secretAccessKey: aws_key
		});
		async.eachSeries(req.files, function iterator(item, callback){
				var s3 = new AWS.S3();
				var params = {Bucket: bucketName, Key: folderString + item.originalname, ACL: 'public-read', Body: item.buffer, ContentType: item.mimetype};
				s3.putObject(params, function(){
					models.documents.upsert({
						link: "https://s3-us-west-2.amazonaws.com/" + bucketName + "/" + folderString +  encodeURIComponent(item.originalname),
						user_id: userId,
						title: item.originalname
					}).then(function(document){

						callback();
					});
				});
		}, function done() {
				res.end();
			});
	},

	uploadInfo: function(req, res){
		var userId = req.user.id,
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
					Logger.info("REDIRECT USER", req.session.redirect_user)
					if(req.session.redirect_user){
						Logger.info(req.session.redirect_user);
						Logger.info("PREVIOUS PAGE AGAIN", previousPage);
						res.redirect(previousPage);

					}
					else{
						var userFields =  ["username","profile_picture","description","past_work","date_of_birth","nationality","religion","funding_needed","organisation_or_user"];
						var wrapper = {};

						for (var i = 0; i < userFields.length ; i++) {
							wrapper[userFields[i]] = user[userFields[i]];
						}

						wrapper["suggest"] = { "input": user.username };
						es.create({
							index: 'users',
							type: 'user',
							id: user.id,
							body: wrapper
						}, function(error, response){
							res.redirect('/user/profile');
						});
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
		Logger.info(id);
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
		Logger.info(req.body);
		var tagArray;
		var tags = req.body["tags[]"];
		if(Array.isArray(tags)){
			tagArray = tags;
		} else {
			tagArray= [];
			tagArray.push(tags);
		}
		Logger.info(tagArray);
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
		Logger.info(req.body);
		var countriesArray;
		var countries = req.body["countries[]"];
		if(Array.isArray(countries)){
			countriesArray = countries;
	 } else {
			countriesArray = [];
			countriesArray.push(countries);
		}
		Logger.info(countriesArray);
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
	} else {
			religionArray = [];
			religionArray.push(religion);
		}
		Logger.info(religionArray);
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
				for (var attrname in fund['dataValues']) {
					if(attrname != "id" && attrname != "description" && attrname != "religion" && attrname != "created_at" && attrname != "updated_at") {
						user["dataValues"][attrname] = fund[attrname];
					}
				}
				var fields= [];
				models.applications.find({where: {fund_id: fund.id, status: 'setup'}}).then(function(application){
					if(application){
						models.categories.findAll({where: {application_id: application.id}}).then(function(categories){
						// for (var category in categories){
						//   Logger.info(category);
						//   models.fields.findAll({where: {category_id : category['dataValues']['id']}}).then(function(fields){
						//     Logger.info(field)
						//   })
						user["dataValues"]["categories"] = categories;
						res.json(user);
					 })
					} else {
						res.json(user);
					}
				})
			})
		})
	},
	verifyEmail: function(req, res){
		var userId = req.user.id;
		Logger.info("REQ USER 2", userId);
		async.waterfall([
			function(done){
				crypto.randomBytes(20, function(err, buf){
					var token = buf.toString('hex');
					done(err, token);
				})
			},
			function(token, done){
				models.users.findById(userId).then(function(user){
					if(!user){
						req.flash('error', 'No account with email ' + req.body.email + ' exists.');
						res.redirect('/');
					}
					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // Token becomes invalid after 1 hour
					Logger.info("NEED TO KNOW THE USER", user);
					user.update({email: user.email, email_verify_token: token}).then(function(user){
						var transporter = nodemailer.createTransport(smtpTransport({
						 service: 'Gmail',
						 auth: {user: 'notifications@silofunds.com',
									 pass: 'notifaccount'}
						}));
						var templatePath = path.join(process.cwd(), 'email-templates');
						resetLink = 'http://' + req.headers.host + '/signup/verify/' + token
						var locals = {
							resetLink: resetLink,
							unsubscribe_link: "http://silofunds.com/user/email-unsubscribe/" + user.id
						};
						var templatePath = path.join(process.cwd(), 'email-verification-templates');
						var template = new EmailTemplate(templatePath);
						template.render(locals, function(err, results) {
							if (err) {
								 firstCallback();
								 return console.error(err);
							}
							transporter.sendMail({
								from: 'Silofunds <andros@silofunds.com>',
								to: user.email,
								subject: 'Email verification',
								html: results.html
							}, function(err, responseStatus){
							// if (err) {
							// 	console.log(err);
							// 	console.log('Here is the error')
							// 	transporter.close();
							// 	res.end("Email send failed");
							// }
							// else {
							if(err) {
								console.log(err)
								console.log('Be aware, there is an error here.')
							}
							var message = "Awesome! An email has been sent to " + user.email + " for verification.";
							transporter.close();
							if(user.student == 'TRUE' || user.organisation_or_user !== null) {
								if(user.organisation_or_user == null) {
									Logger.info('hello')
									req.flash('emailSuccess', message)
									res.redirect('/user/create')
								} else {
									req.flash('emailSuccess', message)
									res.redirect('/organisation/create')
								}
							} else {
								res.redirect('/donor/profile')
							}
						})
					})
				})
			})
		}
		])
	},
	verifyEmailConfirm: function(req, res){
		var token = req.params.token
		models.users.find({where: {email_verify_token: token}}).then(function(user) {
			if(user){
				user.update({email_is_verified: true}).then(function(user){
					req.flash('success', 'You have been verified');
					res.redirect('/user/dashboard')
				})
			}
			else {
				req.flash('error', 'Wrong verification details')
				res.redirect('/register');
			}
		})
	},
	verifyAddress: function(req, res){
		var userId = req.user.id;
		var heard_from = req.body.heard_from;
		models.users.findById(userId).then(function(user){
			user.update(req.body).then(function(user){
				models.heard_froms.find({where: {user_id: userId}}).then(function(row) {
					if(row) {
						res.send(row)
					} else {
						models.heard_froms.create({
							user_id: userId
						}).then(function(row) {
							if(heard_from !== 'other' && heard_from !== '') {
								row.update({heard_from: true}).then(function() {
									res.send(user)
								})
							} else if (heard_from == 'other') {
								row.update({heard_from: req.body.heard_other}).then(function() {
									res.send(user)
								})
							} else {
								res.send(user)
							}
						})
					}
				})
			})
		})
	},
	fundAccount: function(req, res){
		var userId = req.params.id;
		var bucketName = "silo-fund-profiles";
		var folderString = "silo-fund-profile-" + userId + '/';
		if (req.file){
			AWS.config.update({
				accessKeyId: aws_keyid,
				secretAccessKey: aws_key
			});
			var s3 = new AWS.S3();
			var params = {Bucket: bucketName, Key: folderString + req.file.originalname, ACL: 'public-read', Body: req.file.buffer, ContentType: req.file.mimetype};
			s3.putObject(params, function(){
					models.users.findById(userId).then(function(user){
						user.update({
							profile_picture: "https://s3-us-west-2.amazonaws.com/" + bucketName + "/" + folderString + encodeURIComponent(req.file.originalname)
						}).then(function(user){
							res.send("GOT HIMMMMMMMM");
						});
					});
			});
			// s3.headBucket(bucketName, function(err, data) {
			//   if (err) {
			//     s3.createBucket(function(err){
			//       if (err) { Logger.info("Error:", err); }
			//       else{
			//         s3.upload({Body: req.file.buffer, ContentType: req.file.mimetype}, function(){
			//             models.users.findById(userId).then(function(user){
			//               user.update({
			//                 profile_picture: "https://s3.amazonaws.com/" + bucketName + "/" + encodeURIComponent(req.file.originalname)
			//               }).then(function(user){
			//                 res.send("GOT HIMMMMMMMM");
			//               });
			//             });
			//         });
			//       }
			//     });
			//   } else { // an error occurred so bucket doesn't exist
			//     s3.upload({Body: req.file.buffer, ContentType: req.file.mimetype}, function(){
			//       Logger.info("Uploaded picture.");
			//          models.users.findById(userId).then(function(user){
			//               user.update({
			//                 profile_picture: "https://s3.amazonaws.com/" + bucketName + "/" + encodeURIComponent(req.file.originalname)
			//               }).then(function(user){
			//                 res.send("GOT HIMMMMMMMM");
			//               });
			//         });
			//     });
			//   }          // successful response- bucket exists
			// });
		}
		else{
			//description
			Logger.info("BIG TINGS", req.body);
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
		Logger.info(charityId);
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
				Logger.info(fundId);
				models.funds.findById(fundId).then(function(user){
					user.update(req.body).then(function(user){
						Logger.info("ERROR");
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
						//   Logger.info(category);
						//   models.fields.findAll({where: {category_id : category['dataValues']['id']}}).then(function(fields){
						//     Logger.info(field)
						//   })
						user["dataValues"]["categories"] = categories;
						res.render('signup/fund-dashboard', {user: user, newUser: true});
					 })


				})
			})

		})
	}
};
