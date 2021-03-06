var models = require("../models");
var AWS = require('aws-sdk');
var sharp = require('sharp');
var fs = require('fs');
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
	addWork: function(req, res){
		var file = req.file;
		var userId = req.body.user;
		var bucketName = "silo-user-profile-" + userId;

		AWS.config.update({
	    accessKeyId: aws_keyid,
	    secretAccessKey: aws_key
	  });

		var s3 = new AWS.S3({params: {Bucket: bucketName, Key: file.originalname, ACL: 'public-read'}});
		s3.upload({Body: file.buffer, ContentType: file.mimetype}, function(){
	      Logger.info("uploaded file successfully");
	      models.documents.upsert({
	      	link: "https://s3.amazonaws.com/" + bucketName + "/" + file.originalname,
	      	user_id: userId
				}).then(function(){
					models.documents.find({where: {link: "https://s3.amazonaws.com/" + bucketName + "/" + file.originalname }
				}).then(function(document){
					Logger.info('yo yo yo', document);
					res.send(document);
				});
			});
	  });
	},
	addDescription: function(req, res){
		var description = req.body.description;
		var id = req.body.user;

		models.documents.findById(id).then(function(document){
			document.update({
				description: description
			}).then(function(document){
				res.send(document.description);
			});
		});
	},

	deleteWork: function(req, res){
		var id = req.body.id;

		models.documents.findById(id).then(function(document){
			document.destroy().then(function(document){
				res.send("Deleted work!");
			});
		});
	},
	changePicture: function(req, res){
		var file = req.file;
		var cropSettings = JSON.parse(req.body.crop_settings);
		if (!(cropSettings && cropSettings.x && cropSettings.y && cropSettings.width && cropSettings.height)) {
			cropSettings = false;
		}
		var userId;
		var bucketName;
		var folderString;
		Logger.info("CHECKING USER OR FUND", req.body);
		var newFileName = 'profile-picture-' + Math.random().toString().slice(2, 14) + '.jpg';
		var newFilePath = file.destination + '/' + newFileName;
		(cropSettings ?
			sharp(file.path)
			.extract({
				left: 0|cropSettings.x,
				top: 0|cropSettings.y,
				width: 0|cropSettings.width,
				height: 0|cropSettings.height
			})
			.resize(750, 750, {
				kernel: sharp.kernel.lanczos3,
				interpolator: sharp.interpolator.bicubic
			})
		:
			sharp(file.path)
				.resize(750, 750)
				.crop(sharp.strategy.attention)
		)
		.quality(90)
		.toFile(newFilePath, function(err) {
			fs.unlink(file.path);

			if(!req.user.organisation_or_user) {
				userId = req.user.id;
				bucketName = "silo-user-profiles";
				folderString = "silo-user-profile-" + userId + '/';
			} else {
				userId = req.user.id;
				bucketName = "silo-fund-profiles";
				folderString = "silo-fund-profile-" + userId + '/';
			}
			AWS.config.update({
				accessKeyId: aws_keyid,
				secretAccessKey: aws_key
			});
			var s3 = new AWS.S3();
			fs.readFile(newFilePath, function(err, data) {
				var params = {
					Bucket: bucketName,
					Key: folderString + newFileName,
					ACL: 'public-read',
					Body: data,
					ContentType: "image/jpeg"
				};
				var profilePicturePath = "https://s3-us-west-2.amazonaws.com/" + bucketName + "/" + folderString + encodeURIComponent(newFileName);
				s3.putObject(params, function(){
					models.users.findById(userId).then(function(user){
						user.update({
							profile_picture: profilePicturePath
						}).then(function(user){
							res.send(profilePicturePath);
							fs.unlink(newFilePath);
						});
					});
				});
			});
		});
	}
};
