module.exports = {
  index: function(req, res) {
    res.render('messages', { title: 'Silo - Your messages' });
  }
};
