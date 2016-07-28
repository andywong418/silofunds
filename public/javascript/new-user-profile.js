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
		console.log(this);
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
			var arrayFields = ['profile_picture', 'funding_needed', 'country_of_residence','completion_date', 'date_of_birth', 'religion'];
			var prePopulateModel = this.model;
			console.log(prePopulateModel);
			if(!this.model.get('country_of_residence')){
				this.$('input#country_of_residence').tokenInput('/autocomplete/countries', { "theme": "facebook", "allowFreeTagging": true });
			}
			for(var i = 0; i< arrayFields.length; i++){
				console.log(prePopulateModel.get(arrayFields[i]));
				if(prePopulateModel.get(arrayFields[i])){
					var value = prePopulateModel.get(arrayFields[i]);
					if(value){
						switch (arrayFields[i]) {
							case 'profile_picture':
								console.log("PROF PIC");
								this.$('#profile-picture span').hide();
								this.$('#placeholder-picture')
									.attr('src', value)
									.width(250)
									.height(250);
								break;
							case 'country_of_residence':
								var savedCountryOfRes = [];
								savedCountryOfRes = tokenArrayPopulate(value, savedCountryOfRes);
								console.log("HERE");
								this.$('input#country_of_residence').tokenInput('/autocomplete/countries', {
									"theme": "facebook",
									"prePopulate": savedCountryOfRes,
									"allowFreeTagging": true
								});
								this.$('ul.token-input-list-facebook').css('padding', '0');
								this.$('li.token-input-token-facebook').css('margin-top', '1px');
								break;
							case 'date_of_birth':
								console.log(reformatDate(value));
								this.$('input#date-input').val(reformatDate(value));
								break;
							case 'funding_needed':
								this.$('input#input-amount').val(value);
								break;
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
					console.log('HI');
					this.$("input[id='my_file']").click();
		},
		changePicture: function(e){
			console.log(e);
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
					console.log(data);

				});
					reader.readAsDataURL(e.currentTarget.files[0]);
				}

		},
		saveAbout: function(e){
			var countries = $('input#country_of_residence').val().split(',');
			var formData = {
				'funding_needed': $('input[name=funding_needed]').val(),
				'completion_date': $('input[name=completion_date]').val(),
				'date_of_birth': $('input[name=date_of_birth]').val(),
				'country_of_residence': countries,
				'religion': $('select[name=religion]').val()
			}
			$.post('/signup/user/save', formData, function(data){
				console.log(data);
				$('a[href="#about"]').removeClass('active');
				$('a[href="#education"]').addClass('active');
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
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/subjects', { "theme": "facebook", "allowFreeTagging": true });
					}
					if(arrayFields[i] == 'target_university' || arrayFields[i] == 'previous_university'){
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/universities', { "theme": "facebook", "allowFreeTagging": true });
					}
					if(arrayFields[i] =='target_degree' || arrayFields[i] == 'previous_degree'){
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/degrees', { "theme": "facebook", "allowFreeTagging": true });
					}
				}
				else{
					value = this.model.get(arrayFields[i]);
					if(arrayFields[i] == 'subject'){
						var savedSubject = [];
						savedSubject = tokenArrayPopulate(value, savedSubject);
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/subjects', { "theme": "facebook","prePopulate": savedSubject, "allowFreeTagging": true });
						this.$('ul.token-input-list-facebook').css('padding', '0');
						this.$('li.token-input-token-facebook').css('margin-top', '1px');
					}
					if(arrayFields[i] == 'target_university' || arrayFields[i] == 'previous_university'){
						var savedUniversity = [];
						savedUniversity = tokenArrayPopulate(value, savedUniversity);
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/universities', { "theme": "facebook", "prePopulate": savedUniversity, "allowFreeTagging": true });
						this.$('ul.token-input-list-facebook').css('padding', '0');
						this.$('li.token-input-token-facebook').css('margin-top', '1px');
					}
					if(arrayFields[i] =='target_degree' || arrayFields[i] == 'previous_degree'){
						var savedDegree = [];
						savedDegree = tokenArrayPopulate(value, savedDegree);
						this.$('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/degrees', { "theme": "facebook","prePopulate": savedDegree, "allowFreeTagging": true });
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
				console.log(data);
				$('a[href="#education"]').removeClass('active');
				$('a[href="#story"]').addClass('active');

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
		},
		saveStory: function(){
			var story = tinymce.activeEditor.getContent();
			var formData = {
				'description': story
			}
			$.post('/signup/user/save', formData, function(data){
				console.log(data);
				$('a[href="#story"]').removeClass('active');
				$('a[href="#account"]').addClass('active');

			})

		},
		saveFiles: function(e){
			console.log(e);
			var $input = $(e.target);
			console.log($input);
			$label = $input.next('label');
			labelVal = $label.html();
			var fileName = '';
			console.log("CHECK HERE TOO");
			if( $input.files && $input.files.length > 1 ){
			fileName = ( $input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', $input.files.length );
			console.log(fileName);
			}
			else if( e.target.value ){
				fileName = e.target.value.split( '\\' ).pop();
				console.log(fileName);
			}

			if( fileName ){
				$label.html( fileName );
			}
			else{
				$label.html( labelVal );
			}

				var files = e.target.files;
				console.log(files);
				console.log(files[0]);
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
					console.log(data);
				});

			$input
				.on( 'focus', function(){ $input.addClass( 'has-focus' ); })
				.on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
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
					console.log(storyModel.get('description'));
					if(!storyModel.get('description')){
						$('#story-text').html("<span> HELLO </span>");
					}
					else{
						$('#story-text').html(storyModel.get('description'));
					}
					 tinymce.EditorManager.execCommand('mceAddEditor',true, "story-text");

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
