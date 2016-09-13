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
  howToContactSizeChanger();
  $(window).resize(function() {
    makeButtonsInline();
    howToContactSizeChanger();
  })
})




// Functions used above
function makeButtonsInline() {
  // // Send button
  // var contactFormHeight = $('.contact_form').height()
  // var messageFormHeight = $('#message_form').height()
  // if(contactFormHeight !== messageFormHeight) {
  //   var buttonMargin = (contactFormHeight - messageFormHeight)
  //   $('.send').css('margin-top', buttonMargin)
  // }
}

function howToContactSizeChanger() {
  var $contact = $('.contact-info span.class-change')
  $contact.css('padding', 0)
  if($(window).width() < 737) {
    $contact.addClass('col-xs-8');
    $contact.removeClass('col-xs-5');
  } else if(737 < $(window).width() < 850) {
    $contact.removeClass('col-xs-8');
    $contact.addClass('col-xs-7');
  }
}
