// Controller for Mailchimp Section of Admin

module.exports = {
  index: function(req, res) {
    mc.lists.list({}, function(data) {
      res.render('admin/mc-index', { title: 'Your MailChimp Lists', lists: data.data });
    });
  }
};
