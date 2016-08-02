$(document).ready(function(){
  $('#fund').hide()
  $('#fundCheckbox').click(function(){
    if($(this).is(':checked')) {
      $('#user').hide();
      $('#firstName').val('');
      $('#lastName').val('');
      $('#fund').show();
    } else {
      $('#user').show();
      $('#fundName').val('');
      $('#fund').hide();
    }
  })
});


// Validation
$(document).ready(function(){
  $('#email').blur(function() {
    var email = $(this).val()
    var parameters = {email: email, loginEmail: email}
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(!re.test(email) && email.length !== 0) {
      $('#emailError').empty()
      $('#emailError').show()
      $('#emailError').append('Please enter a valid email address')
    }
    if(re.test(email)) {
      $.get('/validation', parameters, function(data) {
        if(data) {
          $('#emailError').empty();
          $('#emailError').show();
          $('#emailError').append(data)
        }
        if(!data) {
          $('#emailSuccess').empty();
          $('#emailError').hide();
          $('#emailSuccess').show();
          $('#emailSuccess').append('This email is valid')
        }
      })
    }
  })

  $('#password, #password_confirmation').blur(function() {
    var password = $('#password').val()
    var confirmPassword = $('#password_confirmation').val()
    if(password !== confirmPassword && password.lenth !==0 && confirmPassword.length !==0) {
      $('#passwordError').empty();
      $('#passwordError').show();
      $('#passwordError').append('Passwords do not match')
    }

  })



  $('#email').focus(function(){
    $('#emailError').empty()
  })
  $('#password').focus(function(){
    $('#passwordError').empty()
  })
})
