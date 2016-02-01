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
		console.log("POOP");

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
	
}


}