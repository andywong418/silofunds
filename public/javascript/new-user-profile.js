$(document).ready(function(){


	var reformatDate = function(date) {
    if(date){
      date = date.split('T')[0];
      date = new Date(date);
      return date.toDateString();
    }

  };
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
			'change input[id="my_file"]': 'changePicture'
		},
		initialize: function(){
			var aboutModel = this.model;
			var aboutView = new AboutView({model: aboutModel});
			this.$el.append(aboutView.render().el);
			this.$('input#country-input').tokenInput('/autocomplete/countries', { "theme": "facebook" });
			var arrayFields = ['profile_picture', 'funding_needed', 'date_of_birth', 'country_of_residence','religion'];
			var prePopulateModel = this.model;
			for(var i = 0; i< arrayFields.length; i++){
				if(prePopulateModel.get(arrayFields[i])){
					var value = prePopulateModel.get(arrayFields[i]);
					if(value){
						switch (arrayFields[i]) {
							case 'profile_picture':
								this.$('#profile-picture span').hide();
								this.$('#placeholder-picture')
									.attr('src', value)
									.width(250)
									.height(250);
								break;
							case 'date_of_birth':
								$('input#date-input').val(reformatDate(value));
								break;
							case 'country_of_residence':
								//logic
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

		}
	})
	var EducationDisplay = Backbone.View.extend({
		tagName: 'div',
		id: 'education-handler',
		template: _.template($('#education-template').html()),
		render: function() {
				this.$el.html(this.template(this.model.toJSON()));
				return this; // enable chained calls
			},
		initialize: function(){
			var educationModel = this.model;
			this.el = this.render().el;
		}

	})
	var StoryDisplay = Backbone.View.extend({
		tagName: 'div',
		id:'story-handler',
		template:_.template($('#story-template').html()),
		render:function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		initialize: function(){
			var storyModel = this.model;
			this.el = this.render().el;
      // this.$el.detach();
		},
		initTextArea: function(){



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
					 tinymce.EditorManager.execCommand('mceAddEditor',true, "story-text");

				}
			})
		},
		loadView: function(viewing){
			if(this.view){
				this.view.stopListening();
				this.view.off();
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
