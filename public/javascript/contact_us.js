$(document).ready(function() {
  // Jquery for a non logged in user.
  $('#user_box').click(function() {
    $('.non-user').hide();
    $('#user_contact').show();
    $('.textarea').focus()
  })
  $('#organisation_box').click(function() {
    $('.non-user').hide();
    $('#organisation_contact').show();
    $('.textarea').focus()
  })

  $('.textarea').focus()
  $('.textarea').keyup(function() {
    var message = $('.textarea').text()
    $('#message').val(message)
  })

  makeButtonsInline();
  $(window).resize(function() {
    makeButtonsInline();
  })
})


function makeButtonsInline() {
  var contactFormHeight = $('.contact_form').height() // Minus padding top/bottom
  var messageFormHeight = $('#message_form').height()
  if(contactFormHeight !== messageFormHeight) {
    var buttonMargin = (contactFormHeight - messageFormHeight)
    $('.send').css('margin-top', buttonMargin)
  }
}
