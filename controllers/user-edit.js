var models = require("../models");
var AWS = require('aws-sdk');

module.exports = {
addWork: function(req, res){

	console.log(req.file);
	var file = req.file
	console.log(file);
	console.log(req.body);
	var userId = req.body.user;
	console.log(userId);

	var bucketName = "silo-user-profile-" + userId;

	AWS.config.update({
    accessKeyId: 'AKIAJAZVDFTFRHXLNUOA',
    secretAccessKey: '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'
  });

	var s3 = new AWS.S3({params: {Bucket: bucketName, Key: file.originalname, ACL: 'public-read'}});
	s3.upload({Body: file.buffer, ContentType: file.mimetype}, function(){
              console.log("uploaded picture successfully");   
              models.documents.upsert({
              	link: "https://s3.amazonaws.com/" + bucketName + "/" + file.originalname,
              	user_id: userId
							}).then(function(){
								models.documents.find({where: {link: "https://s3.amazonaws.com/" + bucketName + "/" + file.originalname }
							}).then(function(document){
								res.send(document);
							})
								
							})
  });
	
},
addDescription: function(req, res){
	console.log("HEREEEEEE", req.body);
	var description = req.body.description;
	var id = req.body.user;
	console.log('description', description);
	console.log('user', id);
	models.documents.findById(id).then(function(document){
		document.update({
			description: description
		}).then(function(document){
			res.send(document.description);
		})
	})
},
deleteWork: function(req, res){
	var id = req.body.id;
	models.documents.findById(id).then(function(document){
		document.destroy().then(function(document){
			res.send("Deleted work!");
		})
	})

},
changePicture: function(req, res){
	console.log("HELLO B");
	console.log(req);
	console.log(req.file);
	var file = req.file;
	var userId = req.body.user;

	var bucketName = "silo-user-profile-" + userId;

	AWS.config.update({
    accessKeyId: 'AKIAJAZVDFTFRHXLNUOA',
    secretAccessKey: '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'
  });

	var s3 = new AWS.S3({params: {Bucket: bucketName, Key: file.originalname, ACL: 'public-read'}});
	s3.upload({Body: file.buffer, ContentType: file.mimetype}, function(){
      console.log("uploaded picture successfully");   
      models.users.findById(userId).then(function(user){
      	user.update({
      	profile_picture: "https://s3.amazonaws.com/" + bucketName + "/" + file.originalname,
				}).then(function(){
					res.send("YOU GOT THIS");

        })								
			})
	});

}


}