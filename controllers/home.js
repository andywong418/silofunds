module.exports = {
  index: function(req, res) {
    var user = req.user;
    delete req.session.redirect_user;
    if(user){
      if(user.organisation_or_user){
        try{
          console.log("something");
          res.redirect('/organisation/dashboard' );
        } catch(err) {
          console.log("redirecting", err);
          res.render('index', { title: 'Express', resultsPage: false });
        }

      }
      else{
        try{
          res.redirect('/user/dashboard');
        }
        catch(err) {
          console.log("redirecting", err);
          res.render('index', { title: 'Express', resultsPage: false });
        }

      }
    }

    else {
    res.render('index', { title: 'Express', resultsPage: false });
    }
  },

  subscribe: function(req, res) {
    mc.lists.subscribe({id: '075e6f33c2', email: {email: req.body.email}}, function(data) {
      console.log("Successfully subscribed!");
      console.log('ending AJAX post request...');
      res.status(200).end();
    }, function(error) {
      if (error.error) {
        console.log(error.code + error.error);
      } else {
        console.log('some other error');
      }
      console.log('ending AJAX post request...');
      res.status(400).end();
    });
  }
};
