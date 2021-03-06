$(document).ready(function(){
  //
  $('input[type="submit"]').prop('disabled', true);

  $('#user_type_dropdown').on('change', function() {
    $('input[type="submit"]').prop('disabled', false);
    if($('#user_type_dropdown').val() == 'student') {
      $('#donor_hidden').prop('value', 'false')
      $('#fundCheckbox').prop('checked', false)
      $('#signup-username').prop('placeholder', 'Full Name')
      $('#fb-social').css('display', 'block')
    } else if ($('#user_type_dropdown').val() == 'donor') {
      $('#donor_hidden').prop('value', 'true')
      $('#fundCheckbox').prop('checked', false)
      $('#signup-username').prop('placeholder', 'Full Name')
      $('#fb-social').css('display', 'none')
    } else if($('#user_type_dropdown').val() == 'organisation') {
      $('#donor_hidden').prop('value', 'false')
      $('#fundCheckbox').prop('checked', true)
      $('#signup-username').prop('placeholder', 'Institution Name')
      $('#fb-social').css('display', 'none')
    }
  })
  //
  //media queries
  var crowdfundingException = window.location.pathname;
  try{
    if(crowdfundingException.indexOf('public') > -1){
      //public crowdfunding page
      if(loggedInUser){
        showLoggedinNavbar();
      }
      else{
        console.log("IT's HERE");

        showNonLoggedInNavbar();
      }
    }
    else{
      if(user){
        showLoggedinNavbar();
      }
      else{
        showNonLoggedInNavbar();
      }
    }

  } catch(e){
    console.log(e);
  }


  var $form_modal = $('.cd-user-modal'),
   $form_login = $form_modal.find('#cd-login'),
   $form_signup = $form_modal.find('#cd-signup'),
   $form_forgot_password = $form_modal.find('#cd-reset-password'),
   $form_modal_tab = $('.cd-switcher'),
   $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
   $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
   $forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
   $back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a'),
   $main_nav = $('.pre-signin');


  $('#emailVerification').click(function() {
    $.get('/signup/verify');
  });


 //open modal
 $main_nav.on('click', function(event){
   $('.cd-switcher').css('display', 'inline');
   if($(event.target).is($main_nav) ) {
     //set body to be static
     $('html, body').css({
       'overflow': 'auto',
       'height': '100%'
      });
      // on mobile close submenu
     $main_nav.children('ul').removeClass('is-visible');
     //show modal layer
     $form_modal.addClass('is-visible');
     //set cd-modal to be static
     $form_modal.css({
       'overflow': 'auto',
       'height': '100%'
     });
     //show the selected form
     if($(event.target).is('.cd-signup')){
       signup_selected();
     }
     else if($(event.target).is('.cd-login')){
       login_selected();
     }
   } else {

 // on mobile open the submenu
     $(this).children('ul').toggleClass('is-visible');
   }
 });

 //close modal
 $('.cd-user-modal').on('click', function(event){
   if( $(event.target).is($form_modal) || $(event.target).is('.cd-close-form') ) {
     $form_modal.removeClass('is-visible');
     $('.cd-error-message').removeClass('is-visible');
     $('#terms-error').css('display', 'none');
     //restore scroll
     $('html, body').css({
     'overflow': 'visible'
     });

   }
 });

 //close modal when clicking the esc keyboard button
 $(document).keyup(function(event){
     if(event.which=='27'){
       $form_modal.removeClass('is-visible');
     }
   });

 //switch from a tab to another
 $form_modal_tab.on('click', function(event) {
   event.preventDefault();
   ( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
 });

 //hide or show password
 $('.hide-password').on('click', function(){
   var $this= $(this),
     $password_field = $this.prev('input');

   ( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
   ( 'Hide' == $this.text() ) ? $this.text('Show') : $this.text('Hide');
   //focus and move cursor to the end of input field
   $password_field.putCursorAtEnd();
 });

 $('#email-signup-option').on('click', function(){
     // signup_email_option_selected();  ADD BACK FOR SOCIAL SIGNUP
 });

 $('#email-option').on('click', function(){
     // login_email_option_selected();  ADD BACK FOR SOCIAL LOGIN
 });

 //show forgot-password form
 $forgot_password_link.on('click', function(event){
   event.preventDefault();
   forgot_password_selected();
 });

 //back to login from the forgot-password form
 $back_to_login_link.on('click', function(event){
   event.preventDefault();
   login_selected();
 });

 function login_selected(){
   mixpanel.track(
     "[/] Trigger homepage login modal tab"
   );

   $form_login.addClass('is-selected');
   $form_signup.removeClass('is-selected');
   $form_forgot_password.removeClass('is-selected');
   $tab_login.addClass('selected');
   $tab_signup.removeClass('selected');
   //remove for social login
   $('#email-login').css('display', 'block');
   $('#email-login-password').css('display', 'block');
   $('#email-login-btn').css('display', 'block');
     $('#remember').css('display', 'inline');
   $('.cd-form-bottom-message').css('display', 'inline');
 }

 function signup_selected(){
   mixpanel.track(
     "[/] Trigger homepage signup modal tab"
   );

   $form_login.removeClass('is-selected');
   $form_signup.addClass('is-selected');
   $form_forgot_password.removeClass('is-selected');
   $tab_login.removeClass('selected');
   $tab_signup.addClass('selected');
   //remove for social signup
   $('#email-username').css('display', 'block');
   $('#email-signup').css('display', 'block');
   $('#email-signup-password').css('display', 'block');
   $('#signup-terms').css('display', 'inline');
   $('#signup-btn').css('display', 'block');
 }

 $('#fund-signup').change(function() {
   $('#signup-username').attr('placeholder', $(this).is(':checked') ? 'Name of Institution' : 'Full Name');
   if($(this).is(':checked')){
     $('#fb-social').hide();
   }
   if(!$(this).is(':checked')){
     $('#fb-social').show();
   }

});

 function forgot_password_selected(){
   $form_login.removeClass('is-selected');
   $form_signup.removeClass('is-selected');
   $form_forgot_password.addClass('is-selected');
   $('#resend-email').css('display', 'block');
   $('#reset-password').css('display', 'block');
 }

 function signup_email_option_selected(){
   $('#email-username').css('display', 'block');
   $('#email-signup').css('display', 'block');
   $('#email-signup-password').css('display', 'block');
   $('.signup-social-btn').css('display', 'none');
   $('#signup-terms').css('display', 'inline');
   $('#signup-btn').css('display', 'block');
   $('#email-signup-option').css('display', 'none');

 }

 function login_email_option_selected(){
   $('#email-login').css('display', 'block');
   $('#email-login-password').css('display', 'block');
   $('#email-login-btn').css('display', 'block');
   $('#remember').css('display', 'inline');
   $('.cd-form-bottom-message').css('display', 'inline');
   $('.login-social-btn').css('display', 'none');
   $('#email-option').css('display', 'none');
 }


 //credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function() {
 return this.each(function() {
     // If this function exists...
     if (this.setSelectionRange) {
         // ... then use it (Doesn't work in IE)
         // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
         var len = $(this).val().length * 2;
         this.setSelectionRange(len, len);
     } else {
       // ... otherwise replace the contents with itself
       // (Doesn't work in Google Chrome)
         $(this).val($(this).val());
     }
 });
};

 function split( val ) {
     return val.split(" ");
 };

 $("input#text_search, input#subject_search, input#university, input#degree_level" ).autocomplete({
   source: "../autocomplete",
   minLength: 1,
   select: function( event, ui ) {
     var terms = split( this.value );
     // remove the current input
     terms.pop();
     // add the selected item
     terms.push( ui.item.value );
     // add placeholder to get the comma-and-space at the end
     terms.push( "" );
     this.value = terms.join(" ");
     return false;
   },
   focus: function() {
     // prevent value inserted on focus
     return false;
   }
 });



 $("#signup-username").focus(function(){
   $('#username-error').removeClass('is-visible');
});

 $("#signup-username").blur(function(){
   var checkForSpace = $(this).val().indexOf(" ");
   if (checkForSpace < 0){
     $("#username-error").addClass('is-visible');
     $("#username-error").text("Please enter your full name");
   }
 });

 $("#signup-email").focus(function(){
   $('#email-error').removeClass('is-visible');
   $('#signup-button').prop('disabled', false);
});

 $("#signup-email").blur(function(){
   var parameters = {email: $(this).val()};
   var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
   if (!re.test($(this).val())){
      $('#email-error').addClass('is-visible');
      $('#email-error').text('Please enter a valid email address');
      $('#signup-button').prop('disabled', true);
   }
   if(re.test($(this).val())){
     $('#email-error').removeClass('is-visible');
   }
   $.get('/validation', parameters, function(data){

     if(data){
       $('#email-error').addClass('is-visible');
       $('#email-error').text(data);
       $('#signup-button').prop('disabled', true);
     }
   });
 });

 $('#accept-terms').click(function(){
   if(this.checked){
     $('#terms-error').css('display', 'none');
   }
 });

 $("#signup-password").focus(function(){
   $('#password-error').removeClass('is-visible');

 });

 $("#signup-form").submit(function(e){
   e.preventDefault();
   var username = $('#signup-username');
   var email = $('#signup-email');
   var password = $('#signup-password');
   var checkbox = $('#accept-terms');
   var error = 0;
   if(!username.val()){
     $('#username-error').addClass('is-visible');
     $('#username-error').text('This is a required field.');
     error++;
   }
   if(!email.val()){
     $('#email-error').addClass('is-visible');
     $('#email-error').text('This is a required field.');
     error++;
   }
    if(!password.val()){
     $('#password-error').addClass('is-visible');
     $('#password-error').text('This is a required field');
     error++;
   }
   //  if($('#accept-terms').is(":not(:checked)")){
   //   $('#terms-error').css('display', 'inline');
   //   error++;
   //  } ADD AFTER WE HAVE LEGAL Terms
   if(error === 0){
     // start: mixpanel
     // check which signup flow
     var isFundSignupFlow = $('#fund-signup').is(':checked');

     if (isFundSignupFlow) {
       mixpanel.track(
         "[/] Create account as fund"
       );
     } else {
       mixpanel.track(
         "[/] Create account as student",
         { "method": "signup button"}
       );
     }
     // end: mixpanel

    this.submit();
   }
 });

 // start: mixpanel
 $("a.btn-facebook").click(function(e) {
   mixpanel.track(
     "[/] Create account as student",
     { "method": "facebook" }
   );
 });
 // end: mixpanel

 $("#signin-email").blur(function(){
   var parameters = {loginEmail: $(this).val()};
   var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
   if (!re.test($(this).val())){
      $('#login-email-error').addClass('is-visible');
      $('#login-email-error').text('Please enter a valid email address');
      $('#login-button').prop('disabled', true);
   }
   $.get('/validation', parameters, function(data){
     if(data){
       $('#login-email-error').addClass('is-visible');
       $('#login-email-error').text(data);
       $('#login-button').prop('disabled', true);
     }
   });
 });

$("#signin-email").focus(function(){
  $('#login-email-error').removeClass('is-visible');
  $('#login-button').prop('disabled', false);

});
$("#signin-password").focus(function(){
   $('#signin-password-error').removeClass('is-visible');
});

$("#login-form").submit(function(e){
   e.preventDefault();
   var email = $('#signin-email');
   var password = $('#signin-password');
   var parameters = {email: email.val(), password: password.val()};

   if(!email.val()){
     $('#login-email-error').addClass('is-visible');
     $('#login-email-error').text('Please enter your email address to login');
     $('#login-button').prop('disabled', false);
   }

   if(!password.val()){
     $('#signin-password-error').addClass('is-visible');
     $('#signin-password-error').text('Please enter your password');
     $('#login-button').prop('disabled', false);
   }

   $.post('/validation', parameters, function(data){
     if(data){
       if(data == 'There is no account under this email address'){
         $('#login-email-error').addClass('is-visible');
         $('#login-email-error').text(data);
       }
       else{
         $('#signin-password-error').addClass('is-visible');
         $('#signin-password-error').text(data);
       }
     }
     else{
       document.getElementById("login-form").submit();
     }
   });
 });

 var UserNav = Backbone.View.extend({
         el: ".nav li",

         initialize: function(){
           if(typeof user ==='undefined' || user ==false){

           }
           else{
             var crowdFundingPage = location.href.indexOf('public');
             var student = user.student;
             if(crowdFundingPage > -1){
               //public page
               $.get('/check-user/' + loggedInUser, function(user){
                 console.log(user);
                 if(user.organisation_or_user){
                   $("#dashboard").attr("href", '/organisation/dashboard');
                   $('#profile').hide();
                   $(".settings").attr("href", '/organisation/settings');
                   $(".logout").attr("href", '/organisation/logout');
                 }
                 else{
                  //  $("#home").attr("href", '/user/dashboard');
                  if(user.donor_id && !student){
                    $('#dashboard').hide();
                    $('#profile').attr('href', '/donor/profile');
                  }
                  if(user.institution_id){
                    $('#dashboard').attr('href', '/institution/dashboard');
                    $('#profile').hide();
                  }
                   $(".settings").attr("href", '/user/settings' );
                   $(".logout").attr("href", '/user/logout');
                 }
               });
             }
             else{
               if(user.organisation_or_user){
                 $("#dashboard").attr("href", '/organisation/dashboard');
                 $('#profile').hide();
                 $(".settings").attr("href", '/organisation/settings');
                 $(".logout").attr("href", '/organisation/logout');
               }
               else{
                 if(user.donor_id && !student){
                   $('#dashboard').hide();
                   $('#profile').attr('href', '/donor/profile');
                 }
                 if(user.institution_id){
                   $('#dashboard').attr('href', '/institution/dashboard');
                   $('#profile').hide();
                 }
                //  $("#home").attr("href", '/user/dashboard');
                 $(".settings").attr("href", '/user/settings' );
                 $(".logout").attr("href", '/user/logout');
               }
             }


          }

         // $('.pre-signin').css("display","none");
       }

   });
  var userNav = new UserNav();
});

function showLoggedinNavbar(){
  $('ul.navbar-nav').addClass('loggedin-nav');
  $('#brand-heading').addClass('loggedin-brand-heading');
  $('.advs-link').addClass('loggedin-advanced');
  $('#navbar-form').addClass('loggedin-form');
  $('#text_search').addClass('loggedin-search');
  $('#search_button').addClass('loggedin-button');
  $('.navbar-toggle').addClass('loggedin-collapse');
  var windowPortView = $(window).width();
  //resize
  $(window).resize(function(){
    var windowPortWidth = $(window).width();
    if(windowPortWidth < 991){
      $('a#advs-link').attr('href', '/advanced-search');
      $('#brand-heading').html("<img src='/images/silo-transparent-square.png' style='width: 50px; margin-top: -16px'></img>");
    }
    if(windowPortWidth < 767){
      $('nav.navbar-custom').hide();
      $('.navbar-desktop').show();
    }
    if(windowPortWidth < 550){
      $('.navbar-desktop').hide();
      $('.mobile').show();
    }
    if(windowPortWidth > 991){
      $('nav.navbar-custom').show();
      $('.mobile').hide();
      $('.navbar-desktop').hide();
      $('#brand-heading').html('<img id= "brand-image" src="/images/homepage-transparent-logo.png"></img>');
    }
    if(windowPortWidth > 767){
      $('nav.navbar-custom').show();
      $('.navbar-desktop').hide();
      $('.mobile').hide();
    }
    if(windowPortWidth > 550 && windowPortWidth < 767){
      $('.navbar-desktop').show();
      $('.mobile').hide();
    }
  });
  if(windowPortView < 767){
    $('nav.navbar-custom').hide();
    $('.navbar-desktop').show();
  }
  if(windowPortView < 550){
    $('.navbar-desktop').hide();
    $('.mobile').show();
  }
  $(document).on('click', '#mobile-search', function(){
    if($('.navbar-mobile-collapse').is(':visible')){
      $('.navbar-mobile-collapse').removeClass('in');
    }
  });
  $(document).on('click', '#home', function(){
    if($('.navbar-mobile-collapse').is(':visible')){
      $('.navbar-mobile-collapse').removeClass('in');
    }
    if($('.search-collapse').is(':visible')){
      $('.search-collapse').removeClass('in');
    }
  });
  $(document).on('click', '.toggle-mobile', function(){
    if($('.search-collapse').is(':visible')){
      $('.search-collapse').removeClass('in');
    }
  });
  $(document).on('click', '.search-mobile-option', function(){
    $('.active-mobile-item').removeClass('active-mobile-item');
    $(this).addClass('active-mobile-item');
    if($(this).hasClass('mobile-users')){
      $('#text-search-mobile').attr('placeholder', 'Search users');
      $('#advanced-search-mobile').attr('href', '/advanced-search');
    }
    else{
      $('#text-search-mobile').attr('placeholder', 'Search funds');
      $('#advanced-search-mobile').attr('href', '/advanced-search');
    }
  });
}
function showNonLoggedInNavbar(){
  var windowPortView = $(window).width();
  $(document).on('click', '.pre-signin', function(){
    $('.navbar-toggle').click();
  });
  if(windowPortView < 991){
    $('a#advs-link, #many-results').attr('href', '/advanced-search');
  }
  $('.cd-login, .cd-signup').click(function(){
    if(windowPortView < 767){
      $('.navbar-toggle').click();
    }
  });

  if(windowPortView < 644){
    if($('#search-form').attr('action') == '/results/users'){
      $('#text_search').attr('placeholder', 'Search users');
    }
    else{
      $('#text_search').attr('placeholder', 'Search funds');
    }
  }
  if(windowPortView< 450){
    $('a#advs-link').html("Advanced");
  }
  $(window).resize(function(){
    var windowPortView = $(window).width();
    if(windowPortView < 991){
      $('#brand-heading').html("<img src='/images/silo-transparent-square.png' style='width: 50px; margin-top: -16px'></img>");
      $('a#advs-link').attr('href', '/advanced-search');
    }
    if(windowPortView < 644){
      if($('#search-form').attr('action') == '/results/users'){
        $('#text_search').attr('placeholder', 'Search users');
      }
      else{
        $('#text_search').attr('placeholder', 'Search funds');
      }
    }
    if(windowPortView < 450){
      $('a#advs-link').html("Advanced");
    }
    if(windowPortView > 664){
      if($('#search-form').attr('action') == '/results/users'){
        $('#text_search').attr('placeholder', 'Search for users by name or by interest');
      }
      else{
        $('#text_search').attr('placeholder', 'Keywords - Subject, university, degree');
      }
    }
    if(windowPortView > 450){
      $('a#advs-link').html("Advanced search");
    }
    if(windowPortView > 991){
      $('a#advs-link').attr('href', '#');
    }
  });
}
