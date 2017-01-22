$(document).ready(function() {
  $('input[type="submit"]').prop('disabled', true);

  $('#user_type_dropdown').on('change', function() {
    $('input[type="submit"]').prop('disabled', false);
    $('.initial_hide').css('display', 'block')
    $('.late_hide').css('display', 'none')
    if($('#user_type_dropdown').val() == 'student') {
      $('#donor_hidden').prop('value', 'false')
      $('#fundCheckbox').prop('checked', false)
      $('.fund_only input').val(null)
      $('.fund_only').css('display', 'none')
      $('.non_fund').css('display', 'flex')
    } else if ($('#user_type_dropdown').val() == 'donor') {
      $('#donor_hidden').prop('value', 'true')
      $('#fundCheckbox').prop('checked', false)
      $('.fund_only').css('display', 'none')
      $('.non_fund').css('display', 'flex')
      $('.fund_only input').val(null)
    } else if($('#user_type_dropdown').val() == 'organisation' || $('#user_type_dropdown').val() == 'affiliated_institutions') {
      $('#donor_hidden').prop('value', 'false')
      $('#fundCheckbox').prop('checked', true)
      $('.non_fund input').val(null)
      $('.fund_only').css('display', 'block')
      $('.non_fund').css('display', 'none')
    }
  })
})

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
  $(document).click(function(e){
    if($(e.target).hasClass('btn-success')){
      //track array and page
      mixpanel.track(
        "Pre Signup Action",
        {"page": "register"}
      );
    }
  });
  $('#email').blur(function() {
    var email = $(this).val()
    var parameters = {email: email, loginEmail: email}
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(!re.test(email) && email.length !== 0) {
      $('#emailSuccess').empty();
      $('#emailError').empty()
      $('#emailError').show()
      $('#emailError').append('Please enter a valid email address')
    }
    if(re.test(email)) {
      $.post('/validation/register', parameters, function(data) {
        if(data) {
          $('#emailSuccess').empty();
          $('#emailError').empty();
          $('#emailError').show();
          $('#emailError').append(data)
        }
        if(!data) {
          $('#emailError').empty();
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
