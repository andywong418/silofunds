var passport = require('passport');
require('../controllers/passport')(passport);


module.exports = {
  loginFailure: function(req, res) {
    res.render('login-error');
  },

  redirectUser: function(req, res) {
  	res.redirect('/search');
  }
};
