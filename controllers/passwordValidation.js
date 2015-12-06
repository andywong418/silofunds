var models = require('../models');
var bcrypt = require('bcrypt');

module.exports = {
	passwordValidator: function(req, res){
		var email = req.body.email;
		console.log(email);
		var password = req.body.password;
		console.log(password);
		models.users.find({where:{email: email}}).then(function(user){
			if(!user){
				res.send('There is no account under this email address');
			}
			else{
				bcrypt.compare(password, user.password,function(err, result){
					if(!result){
						res.send('The password is incorrect');
					}
					else{
						res.send(200, null);
					}
				})
			}
		})
	}

}