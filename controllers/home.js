module.exports = {
  index: function(req, res) {
<<<<<<< HEAD
    if(req.user){
      if(req.user.organisation_or_user){
=======
    var user = req.user;
    delete req.session.redirect_user;
    if(user){
      if(user.organisation_or_user){
>>>>>>> 3831d317365ec74cc4c74fa12bbef93a039e8dd6
        try{
          res.redirect('/organisation/dashboard');
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
