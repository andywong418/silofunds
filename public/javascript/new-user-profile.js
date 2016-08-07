$(document).ready(function(){


	var reformatDate = function(date) {
    if(date){
      date = date.split('T')[0];
      return date;
    }

  };
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};
var tokenArrayPopulate = function(value, emptyArray){
	for (var j = 0; j < value.length; j++) {
		var wrapper = {};
		wrapper.id = value[j].capitalize();
		wrapper.name = value[j].capitalize();

		emptyArray.push(wrapper);
	}
	return emptyArray
}

	$('.process').click(function(){
		Logger.info(this);
		$('.active').removeClass('active');
		$(this).addClass('active');
	})
	var UserModel = Backbone.Model.extend({
		url: '/signup/user_signup/' + user_setup.id,
	})
	var AboutView = Backbone.View.extend({
		id: 'about-form',
		template: _.template($('#about-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
	})

	var AboutDisplay = Backbone.View.extend({
		tagName: 'div',
		id: 'about-handler',
		events: {
			'click #profile-picture': 'addProfilePicture',
			'change input[id="my_file"]': 'changePicture',
			'click #save': 'saveAbout'
		},
		initialize: function(){
			var aboutModel = this.model;
			var aboutView = new AboutView({model: aboutModel});
			this.$el.append(aboutView.render().el);
			var arrayFields = ['profile_picture', 'funding_needed', 'country_of_residence','gender','completion_date', 'date_of_birth', 'religion'];
			var prePopulateModel = this.model;
			Logger.info(prePopulateModel);
			if(!this.model.get('country_of_residence')){
				Logger.info("what");
				this.$('input#country_of_residence').tokenInput('/autocomplete/countries', { "theme": "facebook", "allowFreeTagging": true});
			}
			for(var i = 0; i< arrayFields.length; i++){
				Logger.info(prePopulateModel.get(arrayFields[i]));
				if(prePopulateModel.get(arrayFields[i])){
					var value = prePopulateModel.get(arrayFields[i]);
					if(value){
						switch (arrayFields[i]) {
							case 'profile_picture':
								Logger.info("PROF PIC");
								this.$('#profile-picture span').hide();
								this.$('#placeholder-picture')
									.attr('src', value)
									.width(250)
									.height(250);
								break;
							case 'country_of_residence':
								var savedCountryOfRes = [];
								savedCountryOfRes = tokenArrayPopulate(value, savedCountryOfRes);
								Logger.info("HERE");
								this.$('input#country_of_residence').tokenInput('/autocomplete/countries', {
									"theme": "facebook",
									"prePopulate": savedCountryOfRes,
									"allowFreeTagging": true
								});
								this.$('ul.token-input-list-facebook').css('padding', '0');
								this.$('li.token-input-token-facebook').css('margin-top', '1px');
								break;
							case 'date_of_birth':
								Logger.info(reformatDate(value));
								this.$('input#date-input').val(reformatDate(value));
								break;
							case 'funding_needed':
								this.$('input#input-amount').val(value);
								break;
							case 'gender':
								Logger.info('what', this.$('input[value=' + value +']'));
								this.$('input[value=' + value +']').prop("checked", true);
							case 'completion_date':
								this.$('input#completion-input').val(reformatDate(value));
								break;
							case 'religion':
								this.$('#religion-select').val(value);
								break;
						}
					}

				}
			}
		},
		addProfilePicture: function(){
					Logger.info('HI');
					this.$("input[id='my_file']").click();
		},
		changePicture: function(e){
			Logger.info(e);
			if (e.currentTarget.files && e.currentTarget.files[0]) {

					var reader = new FileReader();

					reader.onload = function (e) {
					$('#profile-picture span').hide();
					$('#placeholder-picture')
						.attr('src', e.target.result)
						.width(250)
						.height(250);
				};
				var file = e.currentTarget.files[0];
				var data = new FormData();
				data.append('profile_picture', file);
				data.append('user', user_setup.id);
				$.ajax({
					type: 'POST',
					url: "/signup/user_signup/profile_picture/" + user_setup.id,
					data: data,
					processData: false,
					contentType: false
				}).done(function(data){
					Logger.info(data);

				});
					reader.readAsDataURL(e.currentTarget.files[0]);
				}

		},
		saveAbout: function(e){
			Logger.info( $('input[name=gender]').val());
			var countries = $('input#country_of_residence').val().split(',');
			var formData = {
				'funding_needed': $('input[name=funding_needed]').val(),
				'completion_date': $('input[name=completion_date]').val(),
				'date_of_birth': $('input[name=date_of_birth]').val(),
				'gender': $('input[name=gender]').val(),
				'country_of_residence': countries,
				'religion': $('select[name=religion]').val()
			}
			$.post('/signup/user/save', formData, function(data){
				Logger.info(data);
				$('a[href="#about"]').removeClass('active');
				$('a[href="#education"]').addClass('active');
				$('html, body').animate({scrollTop:0}, 'slow')
			})
		}
	})
	var EducationDisplay = Backbone.View.extend({
		tagName: 'div',
		id: 'education-handler',
		template: _.template($('#education-template').html()),
		events: {
			'click #save': 'saveEducation'
		},
		render: function() {
				this.$el.html(this.template(this.model.toJSON()));
				return this; // enable chained calls
			},
		initialize: function(){
			var educationModel = this.model;
			this.el = this.render().el;
			var arrayFields = ['subject', 'target_degree', 'previous_degree', 'target_university', 'previous_university'];
			for(var i =0; i< arrayFields.length; i++){
				if(!this.model.get(arrayFields[i])){
					if(arrayFields[i] == 'subject'){
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/subjects', { "theme": "facebook", "allowFreeTagging": true, "placeholder": 'E.g. English literature, Chemical Engineering, History' });
					}
					if(arrayFields[i] == 'target_university' || arrayFields[i] == 'previous_university'){
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/universities', { "theme": "facebook", "allowFreeTagging": true, "placeholder": "E.g. University of Oxford" });
					}
					if(arrayFields[i] =='target_degree' || arrayFields[i] == 'previous_degree'){
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/degrees', { "theme": "facebook", "allowFreeTagging": true ,"placeholder": 'E.g. Bachelor, Master of Arts, Dphil' });
					}
				}
				else{
					value = this.model.get(arrayFields[i]);
					if(arrayFields[i] == 'subject'){
						var savedSubject = [];
						savedSubject = tokenArrayPopulate(value, savedSubject);
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/subjects', { "theme": "facebook","prePopulate": savedSubject, "allowFreeTagging": true});
						this.$('ul.token-input-list-facebook').css('padding', '0');
						this.$('li.token-input-token-facebook').css('margin-top', '1px');
					}
					if(arrayFields[i] == 'target_university' || arrayFields[i] == 'previous_university'){
						var savedUniversity = [];
						savedUniversity = tokenArrayPopulate(value, savedUniversity);
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/universities', { "theme": "facebook", "prePopulate": savedUniversity, "allowFreeTagging": true});
						this.$('ul.token-input-list-facebook').css('padding', '0');
						this.$('li.token-input-token-facebook').css('margin-top', '1px');
					}
					if(arrayFields[i] =='target_degree' || arrayFields[i] == 'previous_degree'){
						var savedDegree = [];
						savedDegree = tokenArrayPopulate(value, savedDegree);
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/degrees', { "theme": "facebook","prePopulate": savedDegree, "allowFreeTagging": true});
						this.$('ul.token-input-list-facebook').css('padding', '0');
						this.$('li.token-input-token-facebook').css('margin-top', '1px');
					}

				}
			}

		},
		saveEducation: function(){
			var subject = $('input[name=subject]').val().split(',');
			var targetDegree = $('input[name=target_degree]').val().split(',');
			var previousDegree = $('input[name=previous_degree]').val().split(',');
			var targetUniversity = $('input[name=target_degree]').val().split(',');
			var previousUniversity = $('input[name=previous_university]').val().split(',');
			var formData = {
				'subject': subject,
				'target_degree': targetDegree,
				'previous_degree': previousDegree,
				'target_university': targetUniversity,
				'previous_university': previousUniversity
			}
			$.post('/signup/user/save', formData, function(data){
				Logger.info(data);
				$('a[href="#education"]').removeClass('active');
				$('a[href="#story"]').addClass('active');
				$('html, body').animate({scrollTop:0}, 'slow')
			})
		}

	})
	var StoryDisplay = Backbone.View.extend({
		tagName: 'div',
		id:'story-handler',
		template:_.template($('#story-template').html()),
		events: {
			'click #save': 'saveStory',
			'change input[id="work"]': 'saveFiles'
		},
		render:function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		initialize: function(){
			var storyModel = this.model;
			this.el = this.render().el;
      // this.$el.detach();
			if(this.model.get('link')){
				var link = this.model.get('link')
				this.$('input#work-link').val(link);
			}
			if(this.model.get('documents')){
				var documents = this.model.get('documents');
				var fileName;
				if(documents.length > 1){
					fileName =  (this.$('input#work').attr( 'data-multiple-caption') || '' ).replace( '{count}', documents.length );
				}
				else{
					if(documents.length == 1){
						fileName = documents[0].title;
						Logger.info(fileName);

					}
				}
				Logger.info(fileName);
				if(fileName){
					this.$('input#work').next('label').html(fileName);
				}

			}
		},
		saveStory: function(){
			var story = tinymce.activeEditor.getContent();
			var formData = {
				'description': story,
				'link': $('input#work-link').val()
			}
			$.post('/signup/user/save', formData, function(data){
				Logger.info(data);
				$('a[href="#story"]').removeClass('active');
				$('a[href="#account"]').addClass('active');
				$('html, body').animate({scrollTop:0}, 'slow')
			})

		},
		saveFiles: function(e){
			Logger.info(e);
			var $input = e.target;
			Logger.info($input);
			$label = $($input).next('label');
			labelVal = $($input).html();
			var fileName = '';
			if(e.target.files.length < 5 & e.target.files.length > 0){
				$('#file-error').hide();
				if( e.target.files && e.target.files.length > 1 ){
				fileName = ( $input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', e.target.files.length );
				}
				else if( e.target.value ){
					fileName = e.target.value.split( '\\' ).pop();
				}

				if( fileName ){
					$label.html( fileName );
				}
				else{
					$label.html( labelVal );
				}

					var files = e.target.files;
					var fileArray = [];

					var data = new FormData();
					for(var i = 0; i < files.length; i++){
						data.append('past_work', files[i]);
					};
					data.append('user', user_setup.id);
					$.ajax({
						type: 'POST',
						url: "/signup/user_signup/work/" + user_setup.id,
						data: data,
						processData: false,
						contentType: false
					}).done(function(data){
						Logger.info(data);
					});
			}
			else{
				$('#file-error').show();
			}


		}
	});
	var AccountDisplay = Backbone.View.extend({
		tagName: 'div',
		id: 'account-handler',
		template: _.template($('#account-template').html()),
		events:{
			'click #verify': 'emailVerify'
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this
		},
		initialize: function(){
			this.el = this.render().el;
			this.$('#email-verify').val(user.email);
		},
		emailVerify: function(){
			var emailData = {
				"email": $('input#email-verify').val()
			};
			$.post('/signup/verify', emailData, function(data){
				$('#verify-text').show();
				$('#verify-text').html(data);
			})
		}
	})
	var Router = Backbone.Router.extend({
		routes:{
			"": "about",
			"about": "about",
			"education": "education",
			"story": "story",
			"account": "account"
		},
		about: function(){
			var router = this;
			var aboutModel = new UserModel();
			aboutModel.fetch({
				success:function(){
					router.loadView(new AboutDisplay({model: aboutModel}));
				}
			});
		},
		education: function(){
			var educationModel = new UserModel();
			var router = this;
			educationModel.fetch({
				success: function(){
					router.loadView(new EducationDisplay({model: educationModel}));
				}
			})
		},
		story: function(){
			var storyModel = new UserModel();
			var router= this;
			storyModel.fetch({
				success: function(){
					router.loadView(new StoryDisplay({model: storyModel}));
					Logger.info(storyModel.get('description'));
					if(!storyModel.get('description')){
						$('#story-text').html("<h3>Introduce yourself &nbsp;<em>**change header name**</em></h3><p>Give people a brief introduction to you and your story. Take an opportunity to address those that will support you.</p><h3>What are your aims?&nbsp;<em>**change header name**</em></h3><p>e.g. I'm raising £X to pursue this degree because I want to do Y. In the future I hope I can help/make/do Z.</p><h3>&nbsp;Tell your story.&nbsp;<em>**change header name**</em></h3><p>This is your chance to give people a bit of insight into your journey.</p><ul><li>Why is this important to you? How long have you been interested in your subject?</li><li>How long have you been looking for funding?</li><li>Have you tried to fund yourself?</li><li>Why should it be important to a donor? What impact will they have by giving money?</li></ul><h3>&nbsp;How will you spend your time and money? **<strong><em>change header name**</em></strong></h3><ul><li>What will you do If you exceed your target? Will &nbsp;you use your&nbsp;generosity and donate to another campaign?</li><li>Try and offer a rough breakdown of costs, something like this:</li><ul><li>Accommodation: £5300</li><li>Food: £2000</li><li>Books: £250</li><li>Travel: £300</li></ul></ul><p><em>N.B The above numbers are merely examples!</em></p><ul><li>Are there other goals you hope to accomplish? Eg &nbsp;.Societies, Hobbies etc.</li></ul>");
					}
					else{
						$('#story-text').html(storyModel.get('description'));
					}
					 tinymce.EditorManager.execCommand('mceAddEditor',true, "story-text");

				}
			})
		},
		account: function(){
			var accountModel = new UserModel();
			var router = this
			accountModel.fetch({
				success: function(){
					router.loadView(new AccountDisplay({model: accountModel }))
				}
			})
		},
		loadView: function(viewing){
			if(this.view){
				this.view.stopListening();
				this.view.off();
				this.view.unbind();
				this.view.remove();
				tinymce.EditorManager.execCommand('mceRemoveEditor',true, "story-text");
			}
			this.view = viewing;
			$('#signup-form').append(viewing.el);
		}
	})
	tinymce.init({
		selector: 'textarea#story-text',
		height: 200,
		theme: 'modern',
		plugins: [
			'advlist autolink lists link image charmap print preview hr anchor pagebreak',
			'searchreplace wordcount visualblocks visualchars code fullscreen',
			'insertdatetime media nonbreaking save table contextmenu directionality',
			'emoticons template paste textcolor colorpicker textpattern imagetools'
		],
		toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link forecolor backcolor emoticons preview',
		image_advtab: true,
		templates: [
			{ title: 'Test template 1', content: 'Test 1' },
			{ title: 'Test template 2', content: 'Test 2' }
		],
		content_css: [
			'//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
			'//www.tinymce.com/css/codepen.min.css'
		],

	 });
	var router = new Router();
	Backbone.history.start();
});
