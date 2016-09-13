$(document).ready(function() {
  $('#user_box').click(function() {
    $('.non-user').hide();
    $('#user_contact').show();
  })
  $('#organisation_box').click(function() {
    $('.non-user').hide();
    $('#organisation_contact').show();
  })

  $('.textarea').focus()
  $('.textarea').keyup(function() {
    var message = $('.textarea').text()
    $('#message').val(message)
  })
})
