module.exports = {
  index: function(req, res) {
    if(req.user){
      if(req.user.organisation_or_user){
        try{
          res.redirect('/organisation/dashboard');
        } catch(err) {
          Logger.info("redirecting", err);
          res.render('index', { title: 'Express', resultsPage: false });
        }

      }
      else{
        try{
          res.redirect('/user/dashboard');
        }
        catch(err) {
          Logger.info("redirecting", err);
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
      Logger.info("Successfully subscribed!");
      Logger.info('ending AJAX post request...');
      res.status(200).end();
    }, function(error) {
      if (error.error) {
        Logger.info(error.code + error.error);
      } else {
        Logger.info('some other error');
      }
      Logger.info('ending AJAX post request...');
      res.status(400).end();
    });
  }

};
