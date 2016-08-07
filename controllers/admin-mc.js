// Controller for Mailchimp Section of Admin

module.exports = {
  index: function(req, res) {
    mc.lists.list({}, function(data) {
      res.render('admin/mc-index', { title: 'Your MailChimp Lists', lists: data.data });
    });
  },

  view: function(req, res) {
    mc.lists.list({filters:{list_id: req.params.id}}, function(listData) {
    var list = listData.data[0];
    mc.lists.members({id: req.params.id}, function(memberData) {
      res.render('admin/mc-view', { title: list.title, list: list, members:memberData.data });
    }, function (error) {
      Logger.info(error);
      if (error.name == "List_DoesNotExist") {
        req.session.error_flash = "The list does not exist";
      } else if (error.error) {
        req.session.error_flash = error.code + ": " + error.error;
      } else {
        req.session.error_flash = "An unknown error occurred";
      }
      res.redirect('admin/mc-index');
    });
  });
  }
};
