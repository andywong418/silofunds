$(document).ready(function(){

	var FundModel = Backbone.Model.extend({
		url: 'fund_account/' + fund_setup.id
	});

	var AccountView = Backbone.View.extend({
		id: 'account-setup',
		template: _.template($('#account-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
       
        return this; // enable chained calls
      }

	});

  var AccountDisplay = Backbone.View.extend({
  	tagName: 'div',
  	id: "account-handler",
  	initialize: function(){
  		var account = new FundModel({
  			fundName: fund_setup.username
  		});
  		var model = this.model;
  		var view = new AccountView({model: account});
  		this.$el.append(view.render().el);
  		
  		console.log(this.model);
  		if(this.model.get('profile_picture')){
				this.$("#profile-picture").attr('src', this.model.get('profile_picture'));
			}
			if(this.model.get('description')){
				this.$("#description-area").val( this.model.get('description'));
			}
			if(this.model.get('charity_number')){
				this.$("#charity-input").val( this.model.get('charity_number'));
			}
			
			var categoriesArray = $.map(this.model.get("categories"), function(value, index) {
   				 return [value];
				});

			if(categoriesArray.length == 0){
				parameters = {title: "General", status: "setup" };
  			$.post('/signup/fund_signup/fund_application/' + fund_setup.fund_or_user, parameters, function(data){
  			console.log(data);
  			});
			}
			
  		$(document).on('click', '#profile-picture', function(){
  			console.log('HI');
			    $("input[id='my_file']").click();
  		});
  		$(document).on('change', "input[id='my_file']", function(){
  			   if (this.files && this.files[0]) {

	          var reader = new FileReader();

	          reader.onload = function (e) {
	          console.log(model);
	          model.set({imageLink: e.target.result});
	          $('#profile-picture')
	            .attr('src', e.target.result)
	            .width(250)
	            .height(250);
	          };
	          var file = this.files[0];
						var data = new FormData();
						data.append('profile_picture', file);
						data.append('user', fund_setup.id);
						$.ajax({
							type: 'POST',
							url: "/signup/fund_signup/" + fund_setup.id,
							data: data,
						  processData: false,
							contentType: false
						}).done(function(data){
							console.log(data);

						});
	          console.log(this.files[0].name);
	   		 		reader.readAsDataURL(this.files[0]);
	   		 		$("#add-profile").css("display", "none");
  				}
			});
  		this.uploadtextArea();
  		this.uploadCharityNumber();
  	},
  	uploadtextArea: function(){
  		$(document).on('blur', '#description-area', function(){
  			var description = $("#description-area").val();
  			var parameters = {description: description};
  			$.post('/signup/fund_signup/' + fund_setup.id, parameters, function(data){
  				console.log(data);
  			})
  		}) 	
  	},
  	uploadCharityNumber: function(){
  		$(document).on('keypress', '#charity-input', function(e){
  			var code = e.keycode || e.which;
  			console.log($("#charity-input").val());
  			console.log(code);
  			if (code == 13){

  				parameters = {charity_number: $("#charity-input").val() };
  				$.post('/signup/fund_signup/fund_data/' + fund_setup.id, parameters, function(data){
  				console.log(data);
  			})
  			}
  		})
  		$(document).on('blur', '#charity-input', function(){


  				parameters = {charity_number: $("#charity-input").val() };
  				$.post('/signup/fund_signup/fund_data/' + fund_setup.id, parameters, function(data){
  				console.log(data);
  			})
  			
  		})
  	}
  });

  var EligibleView = Backbone.View.extend({
  	id: 'eligible-setup',
  	template: _.template($('#eligible-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
  });

  var EligibleDisplay = Backbone.View.extend({
  	tagName: 'div',
  	id: "eligible-handler",
  	initialize: function(){
  		var eligible = new FundModel({
  			fundName: fund_setup.username
  		})
  		var view = new EligibleView({model: eligible});
  		this.$el.append(view.render().el);
  		if(this.model.get("tags")){
  			this.$("#tags-input").val(this.model.get("tags"));
  		}
  		if(this.model.get("countries")){
  			this.$("#nationality-input").val(this.model.get("countries"));
  		}
  		if(this.model.get("religion")){
  			this.$("#religion-input").val(this.model.get("religion"));
  		}
  		if(this.model.get("maximum_age")){
  			this.$("#maximum_age").val(this.model.get("maximum_age"));
  		}
  		if(this.model.get("minimum_age")){
  			this.$("#minimum_age").val(this.model.get("minimum_age"));
  		}
  		if(this.model.get("maximum_amount")){
  			this.$("#maximum_amount").val(this.model.get("maximum_amount")); 			
  		}
  		if(this.model.get("minimum_amount")){
  			this.$("#minimum_amount").val(this.model.get("minimum_amount")); 			
  		}
			if(this.model.get('merit_or_finance')){
				if(this.model.get('merit_or_finance') == "merit"){
					console.log(this.model.get('merit_or_finance'));
					this.$("#merit").prop("checked", true);
				}
				else{
					this.$("#finance").prop("checked", true);
				}
			}
			if(this.model.get('gender')){
				if(this.model.get('gender') == "male"){
					this.$("#male").prop("checked", true);
				}
				else{
					this.$("#female").prop("checked", true);
				}
			}

			if(this.model.get('start_date')){
				console.log(this.model.get('start_date'));
				var dateArray = this.model.get('start_date').split("T");
				var date = dateArray[0];
				this.$("#start_date").val(date);
			}
			if(this.model.get('deadline')){
				var dateArray = this.model.get('deadline').split("T");
				var date = dateArray[0];
				this.$("#deadline").val(date);
			}
  		$(document).on('blur', '#tags-input', function(){
	  		if($(this).val()){
	  			var field = $(this).siblings().attr('id');
	  			var value = $(this).val();
	  			var tagArray = value.split(',');
	  			var parameters = {};
	  			parameters["tags"] = tagArray;
	  			$.post('/signup/fund_signup/tags/' + fund_setup.id, parameters, function(data){
	  				console.log(data);
	  			})
  			}
  		});
  			$(document).on('blur', '#nationality-input', function(){
	  		if($(this).val()){
	  			var field = $(this).siblings().attr('id');
	  			var value = $(this).val();
	  			var countriesArray = value.split(',');
	  			var parameters = {};
	  			parameters["countries"] = countriesArray;
	  			$.post('/signup/fund_signup/countries/' + fund_setup.id, parameters, function(data){
	  				console.log(data);
	  			})
  			}
  		});

  		$(document).on('blur', '#religion-input', function(){
	  		if($(this).val()){
	  			var field = $(this).siblings().attr('id');
	  			var value = $(this).val();
	  			var religionArray = value.split(',');
	  			var parameters = {};
	  			parameters[field] = religionArray;
	  			console.log(religionArray);
	  			$.post('/signup/fund_signup/religion/' + fund_setup.id, parameters, function(data){
	  				console.log(data);
	  			})
  			}
  		});

  		$(document).on('blur', '#maximum_age, #minimum_age, #maximum_amount, #minimum_amount, #start_date, #deadline', function(){
  			if($(this).val()){
  				var field = ($(this).attr('id'))
  				var value = $(this).val();
  				var parameters = {};
  				parameters[field] = value;
  				console.log(field);
  				$.post('/signup/fund_signup/fund_data/' + fund_setup.id, parameters, function(data){
  					console.log(data);
  				})
  			}
  		})

  		$(document).on('click', '#merit, #finance, #male, #female', function(){
  			if($(this).val()){
  				var field = $(this).attr("name");
  				var value = $(this).val();
  				console.log(value);
  				var parameters = {};
  				parameters[field] = value;
  				console.log(parameters);
  				$.post('/signup/fund_signup/fund_data/' + fund_setup.id, parameters, function(data){
  					console.log(data);
  				})
  			}
  		})

  		this.clearRadio();
  	},
  	clearRadio: function(){
  		$(document).on('click', '#clear1', function(){
  			$("#merit, #finance").prop("checked", false);
  			var parameters = {merit_or_finance: null};
  			$.post('/signup/fund_signup/fund_data/' + fund_setup.id, parameters, function(data){
  					console.log(data);
  				})
  		});
  		$(document).on('click', '#clear2', function(){
  			$("#male, #female").prop("checked", false);
  			var parameters = {gender: null};
  			$.post('/signup/fund_signup/fund_data/' + fund_setup.id, parameters, function(data){
  					console.log(data);
  				})
  		})
  	}
  });
	
	var ApplicationView = Backbone.View.extend({
  	id: 'application-setup',
  	template: _.template($('#application-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
  });

  var ApplicationDisplay = Backbone.View.extend({
  		tagName: 'div',
  		id: "application-handler",
  		initialize: function(){
  			var application = new FundModel({
  			fundName: fund_setup.username
  			})
  			var view = new ApplicationView({model: application});
  			this.$el.append(view.render().el);
  			var counter = 0;
  			$(document).on('click', function(){
  				if(counter == 0){
	  				$(".instruction-pointer").css("display", "none");
	  				$(".instruction-pointer-2").css("display", "inline");
	  				counter++
  				}
  				else if(counter == 1){
  				$(".instruction-pointer-2").css("display", "none");
  					counter++;
  				}
  			})
  			this.editCategory();
  			this.editField();
			},
			editCategory: function(){
				categoriesArray= this.model.get("categories");

		
					for(var i = categoriesArray.length -1; i >= 0; i--){
					this.$(".cd-switcher").prepend("<li class = 'replacer' id = '" + categoriesArray[i].id + "'>" + categoriesArray[i].title + "</li>");
					}
					this.$(".cd-switcher li").first().css("background-color", "#BFBFBF");
					this.$(".cd-switcher li").first().addClass("active");

				// $(document).on('click', '.replacer', function(){
				// 	 var categoryId = $(this).attr("id"); 
				// 	 if($(this).children().prop('tagName') == 'INPUT'){
				// 	 	return true;
				// 	 }
				// 	 else{
				// 	 	$(this).html("<input class = 'categoryReplacer' id = '"+ categoryId + "', type = 'text'></input>");// REPLACE WITH TEXT AREA
				// 	 }

				// })


				$(document).on('click', '.replacer', function(){
					var categoryId = $(this).attr('id');
					$("#" + categoryId).css("background-color", "#BFBFBF");
					$("#" + categoryId).addClass("active");
					$(".cd-switcher li").not("#" + categoryId + ",#add-category").css("background-color", "white");
					$(".cd-switcher li").not("#" + categoryId + ",#add-category").removeClass("active");

				})
				$(document).on('click', '#add-category', function(){
					$(this).before("<li><input id = 'addition', type = 'text'></input></li>");
				})
				// $(document).on('blur', '.categoryReplacer', function(){
				// 	console.log($(this).val());
				// 	var newTitle = $(this).val();
				// 	var categoryId = $(this).attr("id");
				// 	console.log("ID", categoryId);
				// 	var parameters = {title: newTitle, category_id: categoryId};
				// 	$.post('/signup/fund_signup/change_category/' + fund_setup.fund_or_user, parameters, function(data){
				// 		console.log(data);
				// 	})
				// });
				$(document).on('blur', "#addition", function(){
					var newTitle = $(this).val();
					var parameters = {title: newTitle};
					$.post('/signup/fund_signup/add_category/'+ fund_setup.fund_or_user, parameters, function(data){
						console.log(data);
					})
				})
			},
			editField: function(){
				$(document).on('click', '#add-field', function(){
					$("#application-info").css("z-index", "-1");

					$("#field-modal").css("display", "block");
				});

				$(document).on('click', '.close', function(){
					$("#application-info").css("z-index", "5");
					$("#field-modal").css("display", "none");
				});

				$(document).on('click', '#description-text', function(){
					$("#text, #upload, #checkbox").attr('disabled', true);
				});

				$(document).on('click', '#questions', function(){
					$("#text, #upload, #checkbox").attr('disabled', false);
				});


				$(document).on('click', '#submit', function(){
					var questions = $("#questions").prop("checked");
					var descriptionText = $("#description-text").prop("checked");
					var text = $("#text").prop("checked");
					var upload = $("#upload").prop("checked");
					var checkbox = $("#checkbox").prop("checked");
					console.log(questions);
					var id = $(".active").attr("id");
					console.log("ID FOUND", id);
					if(questions && text ){
						$("#application-info").css("z-index", "5");
						$("#field-modal").css("display", "none");
						$("#add-field").before("<input placeholder = 'Type your question here' id = '" + id + "' class = 'add-text-question'></input> <textarea placeholder = 'The applicant will type their answer here' id = '" + id + "' class = 'add-question-area'></textarea>")
					}
					else if (questions && upload){
						$("#application-info").css("z-index", "5");
						$("#field-modal").css("display", "none");
						$("#add-field").before("<input placeholder = 'Type your question here' id = '" + id + "' class = 'add-file-question'></input> <input type = 'file' class = 'add-file-answer' id = '" + id + "' class = 'add-file-answer'></input>")
					}
					else if (questions && checkbox){
							$("#application-info").css("z-index", "5");
						$("#field-modal").css("display", "none");
						$("#add-field").before("<input placeholder = 'Type your question here' id = '" + id + "' class = 'add-checkbox-question'></input> <input type = 'checkbox' class = 'add-file-answer' id = '" + id + "' class = 'add-checkbox-answer'></input>")
					}
					else if (descriptionText){
						$("#application-info").css("z-index", "5");
						$("#field-modal").css("display", "none");
						$("#add-field").before("<textarea placeholder = 'Type your description here' id = '" + id + "' class = 'add-description-field'></textarea> ")
					}
				})
			}
  })
	

  var Router = Backbone.Router.extend({
	routes : {
		"" : "account",
		"account" : "account",
		"eligible" : "eligible",
		"application": "application"
	},
	account : function() {
		console.log(fund_setup.id);
		// var link = window.location.hostname;
		var router = this;
		var accountModel = new FundModel();
		accountModel.fetch({
			success:function(){
				console.log(JSON.stringify(accountModel));
				router.loadView(new AccountDisplay({model: accountModel}));
			}
		});
	},
	eligible : function() {
		var eligibleModel = new FundModel();
		eligibleModel.fetch({
			success:function(){
				console.log(JSON.stringify(eligibleModel));
				router.loadView(new EligibleDisplay({model: eligibleModel}));
			}

		})
	},
	application: function() {
		var ApplicationModel = Backbone.Model.extend({
			url: "fund_account/application/" + fund_setup.id
		})
		var applicationModel = new ApplicationModel();
		applicationModel.fetch({
			success:function(){
				console.log(JSON.stringify(applicationModel));
				router.loadView(new ApplicationDisplay({model: applicationModel }));
			}
			
		})
	},
	loadView : function(viewing) {
	
		this.view && this.view.remove();
		this.view = viewing;
		$('body').append(viewing.el);
	}
});

var router = new Router();
Backbone.history.start();
  // var accountDisplay = new AccountDisplay();
  // var eligibleDisplay = new EligibleDisplay();

})