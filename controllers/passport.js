var models = require('../models');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

module.exports = function(passport) {
      
      //simple way to set req.user and to persist user's session via a cookie
      passport.serializeUser(function(user, done){
         done(null, user);
      });

      passport.deserializeUser(function(obj, done){
         done(null, obj);
      });

      passport.use('local-login', new LocalStrategy({
      //By default, local strategy uses username and password.
          usernameField: 'useremail',
          passwordField: 'password'
      },
      function(username, password, done){
        console.log(password);
        models.users.find({
          where: {email: username}
        }).then(function(user){
            if (!user){
            return done(null, false, { message: 'There is no account under this name.'} );
            }
            bcrypt.compare(password, user.password, function(err, res){
              if (!res){
                 return done(null, false, { message: 'Wrong password'} );
              }
              else{
                return done(null, { username: user.email });
              }
            })
            
          })
      }

    ));
//     passport.use(new FacebookStrategy({
//             clientID: '506830149486287',
//             clientSecret: '45b00c46d1cf3d9396fd24fe99ea0e3d',
//             callbackURL: "http://www.localhost:3001/auth/facebook/callback",
//             enableProof: false
//     },
//     function(accessToken, refreshToken, profile, done) {
//       models.users.find({
//         where: {email: profile[0].email.value}
//       }).then(function(user)){
//            if(user){
//             return done(null, user); // user found, return that user
//            }
//            else{
//             var accessToken = accessToken;
//             models.users.create({
//             username: profile.name.givenName + profile.name.familyName,
//             email: profile[0].email.value
//            }).then(function(newUser){
//               return done(null, newUser);
//            });
              
//            }

//       }
          
//   }
// ));

     
    

}

