module.exports = {
  index: function(req, res) {
    res.render('index', { title: 'Express', resultsPage: false });
  },

  subscribe: function(req, res) {
    mc.lists.subscribe({ id: '075e6f33c2', email: {email: req.body.email}}, function(data) {
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
