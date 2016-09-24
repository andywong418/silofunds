$(document).ready(function(){
	if(!general){
		$('#account a').click();
	}
	var SettingsModel = Backbone.Model.extend({
		url: '/organisation/get-organisation-info'
	});
	var GeneralSettingsView = Backbone.View.extend({
		tagName: 'div',
		id: 'general-handler',
		template: _.template($('#general-template').html()),
		events:{
			'click .save': 'saveGeneral'
		},
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
    },
		initialize: function(){
			this.el = this.render().el;
			var emailUpdates = this.model.get('email_updates');
			var username = this.model.get('username');
			var email = this.model.get('email');
			var charity_id = this.model.get('charity_id');
			var array = ["username", "email", "charity_id"];
			var values = [username, email, charity_id];

			prePopulate(array, values, this);
			if(emailUpdates){
				this.$('input#email_updates').attr('checked', true);
			}
			this.checkPassword();
		},
		checkPassword: function(){
			var previousPassword = this.$('#previous-password');
			var newPassword = this.$('#new-password');
			var confirmPassword = this.$('#confirm-password');
			var email = this.model.get('email');
			previousPassword.on('blur', function(){
				var formData = {
					email: email,
					password: previousPassword.val()
				};
				$.post('/validation', formData, function(data){
					if(data == 'The password is incorrect'){
						$('#password-check').css('color', 'red');
						$('#password-check').html(data);
					}
					else{
						$('#password-check').css('color', 'green');
						$('#password-check').html("This password is correct");
					}
				});
			});
			confirmPassword.on('blur', function(){
				if(confirmPassword.val() != newPassword.val() ){
					$('#password-match').css('color', 'red');
					$('#password-match').html('The passwords do not match');
				}
				else{
					$('#password-match').css('color', 'green');
					$('#password-match').html('The passwords match');
				}
			});
		},
		saveGeneral: function(e){
			e.preventDefault();
			var previousPassword = this.$('#previous-password');
			var newPassword = this.$('#new-password');
			var confirmPassword = this.$('#confirm-password');
			var email = this.model.get('email');
			var newEmail = $('#email').val();
			if(!previousPassword.val() && (newPassword.val() || confirmPassword.val())){
				$('#password-check').css('color', 'red');
				$('#password-check').html("You must enter your previous password for a new password.");
			}
			if(previousPassword.val()){
				var formData = {
					email: email,
					password: previousPassword.val()
				};
				$.post('/validation', formData, function(data){
					if(data == 'The password is incorrect'){
						$('#password-check').css('color', 'red');
						$('#password-check').html(data);
					}
					else{
						if(newPassword.val() || confirmPassword.val()){
							if(confirmPassword.val() != newPassword.val() ){
								$('#password-match').css('color', 'red');
								$('#password-match').html('The passwords do not match');
							}
							else{
								// Okay to post data
								if(checkEmail(newEmail)){
									$('form#change-settings').submit();
								}
							}
						}

					}
				});
			}
			if(!previousPassword.val() && !newPassword.val() && !confirmPassword.val()){
				//okay to post data again;
				$('form#change-settings').submit();
			}


		}

	});

	var AccountSettingsView = Backbone.View.extend({
		tagName: 'div',
		id: 'account-handler',
		events:{
			'click #userImage': 'changePicture',
			"change input[id='my_file']": 'savePicture'
		},
		template: _.template($('#account-settings').html()),
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		initialize: function(){
			this.el = this.render().el;
		},
		changePicture: function(){
			$("input[id='my_file']").click();
		},
		savePicture: function(e){
			if (e.currentTarget.files && e.currentTarget.files[0]) {

				var reader = new FileReader();

				reader.onload = function (e) {

				$('#userImage')
					.attr('src', e.target.result);
				};

				reader.readAsDataURL(e.currentTarget.files[0]);
			}
			var file = e.currentTarget.files[0];
			var data = new FormData();
			data.append('profile_picture', file);
			data.append('user', user.id);
			$.ajax({
				type: "POST",
				url: "/user-edit/profile-picture",
				data: data,
				processData: false,
				contentType: false,
			}).then(function(data){
			})
		}
	});

	var Router = Backbone.Router.extend({
		routes: {
			"": "general",
			"general": "general",
			"account": "account"
		},
		general: function(){
			var router = this;
			var generalModel = new SettingsModel();
			generalModel.fetch({
				success: function(){
					$('.active-link').removeClass('active-link');
					$('#general-settings a').addClass('active-link');
					router.loadView(new GeneralSettingsView({model: generalModel}));
				}
			});
		},
		account: function(){
			var router = this;
			var accountModel = new SettingsModel();
			accountModel.fetch({
				success: function(){
					$('.active-link').removeClass('active-link');
					$('#account a').addClass('active-link');
					router.loadView(new AccountSettingsView({model: accountModel}));
				}
			});
		},
		loadView: function(viewing){
			if(this.view){
				this.view.stopListening();
				this.view.off();
				this.view.unbind();
				this.view.remove();
			}
			this.view = viewing;
			$('#change-settings').append(viewing.el);
		}
	});

	var router = new Router();
  Backbone.history.start();
	//helper Functions
	function prePopulate(array, values, context){
		for(var i =0; i < array.length; i++){
			context.$('input#' + array[i]).val(values[i]);
		}
	}
	function checkEmail(email){
		 var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		 if(!re.test(email)){
			 $('#email-check').html('Please enter a valid email address');
			 return false;
		 }
		 else{
			 return true;
		 }
	}

	$('#delete').click(function() {
		$('.modal-delete.modal.fade').modal('toggle')
	})

	hashchange();
	$(window).bind('hashchange', hashchange);
});


// Functions
function hashchange() {
	if(window.location.hash == '#account') {
		$('#delete-account').show()
	} else {
		$('#delete-account').hide()
	}
}
