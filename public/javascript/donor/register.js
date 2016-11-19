$(document).ready(function() {


  $('#email').blur(function() {
    var email = $(this).val()
    var parameters = {email: email, loginEmail: email}
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(!re.test(email) && email.length !== 0) {
      $('.error.email').show();
    } else {
      $('.error.email').hide();
    }
  })

  $('#password, #password_confirmation').blur(function() {
    var password = $('#password').val()
    var confirmPassword = $('#password_confirmation').val()
    if(password !== confirmPassword && password.lenth !==0 && confirmPassword.length !==0) {
      $('.error.password_match').show();
    } else {
      $('.error.password_match').hide();
    }
  })

  $('#email').focus(function(){
    $('#emailError').empty()
  })
  $('#password, #password_confirmation').focus(function(){
    $('.error.password_match').hide();
  })

})
