$(document).ready(function() {
// Initially hide the error divs
  $('.checker').hide();

// Verification
  $('#email').focus(function() {
    $('.error.email').hide();
  });
  $('#password').focus(function() {
    $('#passwordError').empty();
  });
  
  $('#email').blur(function() {
    var email = $(this).val();
    $('#passwordError').empty();
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(!re.test(email)) {
      $('.error.email').show();
    } else {
      var parameters = {email: email};
      $.post('/validation/login', parameters, function(data) {
        if(data) {
          $('.error.email').show();
        }
      });
    }
  });

  $('#password').blur(function() {
    var password = $(this).val();
    var email = $('#email').val();
    var parameters = {email: email, password: password};
    $.post('/validation', parameters, function(data) {
      var string = data;
      var substring = 'email';
      if(data.indexOf('email') !== -1) {
        $('#emailError').empty();
        $('#emailError').show();
        $('#emailError').append(data);
      } else {
        $('#passwordError').empty();
        $('#passwordError').show();
        $('#passwordError').append(data);
      }
    });
  });
});
