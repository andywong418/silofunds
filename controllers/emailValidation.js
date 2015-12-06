var models = require('../models');


module.exports ={
   emailValidator: function(req,res){
     var email = req.query.email;
     var loginEmail = req.query.loginEmail;
     console.log('testing',email);
     if(email)
     {
     models.users.find({where: {email: email}}).then(function(user){
 				if(user){
 					console.log(user);
 					res.send('There is already an account under this email address');
 				}
     });
   	 }
   	 else{
       models.users.find({where:{email:loginEmail}}).then(function(user){
 					if(!user){
 						res.send('There is no account under this email address');
 					}

       })

   	 }
   	 
   }

}