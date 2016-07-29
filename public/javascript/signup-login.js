$(document).ready(function(){
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

 //open modal
 $main_nav.on('click', function(event){
   $('.cd-switcher').css('display', 'inline');
   if($(event.target).is($main_nav) ) {
     //set body to be static
     $('html, body').css({
       'overflow': 'hidden',
       'height': '100%'
      });
      // on mobile close submenu
     $main_nav.children('ul').removeClass('is-visible');
     //show modal layer
     $form_modal.addClass('is-visible');
     //set cd-modal to be static
     $form_modal.css({
       'overflow': 'hidden',
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

 $("input#text_search" ).autocomplete({
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
    this.submit();
   }
 });

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
         console.log("TELL ME NOW", data);
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
             if(user.organisation_or_user){
               $("#home").attr("href", '/organisation/home');
               $(".settings").attr("href", '/organisation/settings');
               $(".logout").attr("href", '/organisation/logout');
             }
             else{

               $("#home").attr("href", '/user/profile');
               $(".settings").attr("href", '/user/settings' );
               $(".logout").attr("href", '/user/logout');
             }

          }

         // $('.pre-signin').css("display","none");
       }

   });
  var userNav = new UserNav();
})
