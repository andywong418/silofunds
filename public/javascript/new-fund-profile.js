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


  		if(this.model.get('profile_picture')){
				this.$("#profile-picture").attr('src', this.model.get('profile_picture'));
			}
			if(this.model.get('description')){
				this.$("#description-area").val( this.model.get('description'));
				this.$("#description-area").css("border", "2px #16a085 solid")
			}
			if(this.model.get('charity_number')){
				this.$("#charity-input").val( this.model.get('charity_number'));
				this.$("#charity-input").css("border", "2px #16a085 solid");
			}

			var categoriesArray = this.model.get('categories');
			if(!categoriesArray){
				parameters = {title: "General", status: "setup" };
  			$.post('/signup/fund_signup/fund_application/' + fund_setup.fund_or_user, parameters, function(data){
  			console.log(data);
  			});
			}
			$(document).off('click', '#profile-picture');
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
				$("#description-area").css("border", "2px #16a085 solid");
  			var description = $("#description-area").val();
  			var parameters = {description: description};
  			$.post('/signup/fund_signup/' + fund_setup.id, parameters, function(data){
  				console.log(data);
  			})
  		})
  	},
  	uploadCharityNumber: function(){
  		$(document).on('keypress', '#charity-input', function(e){
  			$("#charity-input").css("border", "2px #16a085 solid");
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

  				$("#charity-input").css("border", "2px #16a085 solid");
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
			if (!Modernizr.inputtypes.date) {
        // If not native HTML5 support, fallback to jQuery datePicker
            $('input[type=date]').datepicker({
                // Consistent format with the HTML5 picker
                    dateFormat : 'dd-mm-yy'
                },
                // Localization
                $.datepicker.regional['it']
            );
        };
  		if(this.model.get("tags")){
  			this.$("#tags-input").val(this.model.get("tags"));
				this.$("#tags-input").css("border", "2px #16a085 solid")
  		}
  		if(this.model.get("countries")){
  			this.$("#nationality-input").val(this.model.get("countries"));
				this.$("#nationality-input").css("border", "2px #16a085 solid");
  		}
  		if(this.model.get("religion")){
  			this.$("#religion-input").val(this.model.get("religion"));
				this.$("#religion-input").css("border", "2px #16a085 solid");
  		}
  		if(this.model.get("maximum_age")){
  			this.$("#maximum_age").val(this.model.get("maximum_age"));
				this.$("#maximum_age").css("border", "2px #16a085 solid");
  		}
  		if(this.model.get("minimum_age")){
  			this.$("#minimum_age").val(this.model.get("minimum_age"));
				this.$("#minimum_age").css("border", "2px #16a085 solid")
  		}
  		if(this.model.get("maximum_amount")){
  			this.$("#maximum_amount").val(this.model.get("maximum_amount"));
				this.$("#maximum_amount").css("border", "2px #16a085 solid")
  		}
  		if(this.model.get("minimum_amount")){
  			this.$("#minimum_amount").val(this.model.get("minimum_amount"));
				this.$("#minimum_amount").css("border", "2px #16a085 solid");
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
				this.$("#start_date").css("border", "2px #16a085 solid")
			}
			if(this.model.get('deadline')){
				var dateArray = this.model.get('deadline').split("T");
				var date = dateArray[0];
				this.$("#deadline").val(date);
				this.$("#deadline").css("border", "2px #16a085 solid")
			}
  		$(document).on('blur', '#tags-input', function(){
	  		if($(this).val()){
	  			$(this).css("border", "2px #16a085 solid");
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
	  			$(this).css("border", "2px #16a085 solid");
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
	  			$(this).css("border", "2px #16a085 solid");
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
  				$(this).css("border", "2px #16a085 solid");
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
  				$(this).css("border", "2px #16a085 solid");
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
				var firstInstructor = $(".instruction-pointer");
				var secondInstructor = $(".instruction-pointer-2");
				$(document).on('click', function(){
					console.log(counter);
					if(counter ==0){
						console.log("BITCH");
						$('.instruction-pointer').css('display', 'none');
						$('.instruction-pointer-2').css('display', 'none');

					}
					// if(counter == 1){
					// 	console.log("hey")
					// 	$('.instruction-pointer-2').css('display', 'none');
					// }

				});

  			$( window ).resize(function() {
				  var savedLength = $("ul.cd-switcher").width();
							$("ul.cd-switcher").width($("#application-form").width());
							var formLength = $("#application-form").width();
							console.log("-" + (formLength - savedLength) + "px");
							if(formLength = savedLength != 0){
								$("ul.cd-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");
							}
				});

  			this.editCategory();
  			this.editField();
			},
			editCategory: function(){

				categoriesArray= this.model.get("categories");
					for(var i = categoriesArray.length -1; i >= 0; i--){
					this.$(".cd-switcher").prepend("<li class = 'category' id = '" + categoriesArray[i].id + "'>" + categoriesArray[i].title + "</li>");
					}
					this.$(".cd-switcher li").first().css("background-color", "#BFBFBF");
					this.$(".cd-switcher li").first().addClass("active");
					var onLoadCategory = this.$(".cd-switcher li").first().attr("id");
					console.log(onLoadCategory);
					$.get('/signup/fund_signup/get_fields/' + onLoadCategory, function(data){
						console.log(data);
						if(data.length != 0){
							var parsedData = JSON.parse(data[0].html);
							console.log(parsedData.question_tag);
							console.log(parsedData);
							console.log(data[1]);
							for (var i = 0; i < data.length; i++){
								var parsed = JSON.parse(data[i].html);
								console.log(parsed);
								if(parsed.question_tag  && parsed.applicant_input_type == "textarea"){
									$("#add-field").before("<p class = 'paragraph-filler' id = '" + data[i].id + "'><span class = question-pointer>" + parsed.question + "</span><span><i class = 'fa fa-times delete' id= '" + data[i].id + "'></i><i class = 'fa fa-pencil add' id = '" + data[i].id + "'></i> </span></p><textarea placholder = 'The applicant will type their answer here' class = 'add-text' id= '" +  data[i].id + "'></textarea> <hr>");
								}
								else if(parsed.question_tag  && parsed.applicant_input_type == "file"){
									$("#add-field").before("<p class = 'input-filler' id = '" + data[i].id + "'><span class = question-pointer>" + parsed.question + "</span><span><i class = 'fa fa-times delete' id= '" + data[i].id + "'></i><i class = 'fa fa-pencil add' id = '" + data[i].id + "'></i> </span></p><input type = 'file' placholder = 'The applicant will type their answer here' class = 'add-file-answer' id= '" + data[i].id + "' /> <hr>");
								}
								else if (parsed.question_tag  && parsed.applicant_input_type == "checkbox"){
									$("#add-field").before("<p class = 'input-filler' id = '" +  data[i].id + "'><span class = question-pointer>" + parsed.question + "</span><span><i class = 'fa fa-times delete' id= '" + data[i].id + "'></i><i class = 'fa fa-pencil add' id = '" + data[i].id + "'></i> </span></p><input type = 'checkbox' class = 'add-checkbox-answer' id= '"+ data[i].id + "' /> <hr>");
								}
								else{
									$("#add-field").before("<p class = 'description-filler' id= '" +  data[i].id + "'><span class = question-pointer>" + parsed.description + "</span><span><i class = 'fa fa-times delete' id= '" + data[i].id + "'></i><i class = 'fa fa-pencil add' id = '" + data[i].id + "'></i> </span></p> <hr>");
								}
							}
							var savedLength = $("ul.cd-switcher").width();
							$("ul.cd-switcher").width($("#application-form").width());
							var formLength = $("#application-form").width();
							console.log("-" + (formLength - savedLength) + "px");
							$("ul.cd-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");

						}
						else{
						var savedLength = $("ul.cd-switcher").width();
							$("ul.cd-switcher").width($("#application-form").width());
							var formLength = $("#application-form").width();
							console.log("-" + (formLength - savedLength) + "px");
							$("ul.cd-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");
						}
					});
				$(document).off('click', '.category');
				$(document).on('click', '.category', function(){
					var categoryId = $(this).attr('id');
					$("#" + categoryId).css("background-color", "#BFBFBF");
					$("#" + categoryId).addClass("active");
					$(".cd-switcher li").not("#" + categoryId + ", #add-category").css("background-color", "white");
					$(".cd-switcher li").not("#" + categoryId + " , #add-category").removeClass("active");
					console.log($("#add-field").siblings());

					$.get('/signup/fund_signup/get_fields/' + categoryId, function(data){
						$("#add-field").siblings().not("#delete-category").remove();
						if(data){
							for (var i = 0; i < data.length; i++){
								var parsed = JSON.parse(data[i].html);
								console.log(parsed);
								if(parsed.question_tag  && parsed.applicant_input_type == "textarea"){
									$("#add-field").before("<p class = 'paragraph-filler' id = '" +  data[i].id + "'><span class = question-pointer>" + parsed.question + "</span><span><i class = 'fa fa-times delete' id= '" + data[i].id + "'></i><i class = 'fa fa-pencil add' id = '" + data[i].id + "'></i> </span></p><textarea placholder = 'The applicant will type their answer here' class = 'add-text' id= '" + data[i].id + "'></textarea> <hr>");
								}
								else if(parsed.question_tag  && parsed.applicant_input_type == "file"){
									$("#add-field").before("<p class = 'input-filler' id = '" +  data[i].id + "'><span class = question-pointer>" + parsed.question + "</span><span><i class = 'fa fa-times delete' id= '" + data[i].id + "'></i><i class = 'fa fa-pencil add' id = '" + data[i].id + "'></i> </span></p><input type = 'file' placholder = 'The applicant will type their answer here' class = 'add-file-answer' id= '" +  data[i].id + "' /> <hr>");
								}
								else if (parsed.question_tag  && parsed.applicant_input_type == "checkbox"){
									$("#add-field").before("<p class = 'input-filler' id= '" + data[i].id + "'><span class = question-pointer>" + parsed.question + "</span><span><i class = 'fa fa-times delete' id= '" + data[i].id + "'></i><i class = 'fa fa-pencil add' id = '" + data[i].id + "'></i> </span></p><input type = 'checkbox' class = 'add-checkbox-answer' id= '" + data[i].id + "' /> <hr>");
								}
								else{
									$("#add-field").before("<p class = 'description-filler' id = '" + data[i].id + "'><span class = question-pointer>" + parsed.description + "</span><span><i class = 'fa fa-times delete' id= '" + data[i].id + "'></i><i class = 'fa fa-pencil add' id = '" + data[i].id + "'></i> </span></p> <hr>");
								}
							}
						}
					})
				})
				$(document).off('click', '#add-category');
				$(document).on('click', '#add-category', function(){
					var savedLength = $("ul.cd-switcher").width();
					$("ul.cd-switcher").width($("#application-form").width());
					var formLength = $("#application-form").width();
					if(formLength = savedLength != 0){
					$("ul.cd-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");
					}
					console.log($(this).prev("li").attr("id"));
					// var w = 50/n;
					// if($(this).prev("li"))
					if($(this).prev("li").attr("id")){
					$(".active").removeClass("active");
					$(this).before("<li class = 'active'><input style = 'height: 20px;' id = 'addition', type = 'text'></input></li>");
					$("#add-field").siblings().not("#delete-category").remove();
					}
				})

				$(document).off('blur', '#addition');
				$(document).on('blur', "#addition", function(){
					var newTitle = $(this).val();
					console.log($(this).parent());
					if($(this).val()){
						var parent = $(this).parent();
						$(".cd-switcher li").not(this).removeClass("active");
						$(".cd-switcher li").not(this).css("background-color", "white");
						var parameters = {title: newTitle};
						$.post('/signup/fund_signup/add_category/'+ fund_setup.fund_or_user, parameters, function(data){
							console.log(data);
							parent.replaceWith("<li class = 'category active' style= 'background-color: #BFBFBF' id = '" + data.id + "'><span>" + data.title + "</span></li>");
						})
					}
				})
				$(document).on('click', '#delete-category', function(e){
					e.preventDefault();
					var categoryId = $(".active").attr("id");
					var closestCategory;
					if($(".active").prev("li").prop("tagName") != "LI"){
						closestCategory = $(".active").next("li");
					}
					else{
						closestCategory = $(".active").prev("li");
					}

						console.log(closestCategory);
						$(".active").remove();
						closestCategory.click();

					$.get('/signup/fund_signup/delete_category/'+ categoryId, function(data){

					})
				})
			},
			editField: function(){
				$(document).off('click', '#add-field');
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

				$(document).off('click', '#submit');
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
						$("#add-field").before("<input placeholder = 'Type your question here' id = '" + id + "' class = 'add-text-question'></input> <textarea placeholder = 'The applicant will type their answer here' id = '" + id + "' class = 'add-text-answer'></textarea>")
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
				$(document).off('blur', '.add-text-question, .add-file-question, .add-checkbox-question, .add-description-field');
				$(document).on('blur', '.add-text-question, .add-file-question, .add-checkbox-question, .add-description-field', function(){
						var categoryId = $(this).attr('id');
						var questionClass = $(this).attr('class');
						var classArray = questionClass.split("-");
						var classNeeded = classArray[1];
						var applicantInput = $(this).next().prop("tagName").toLowerCase();
						var applicantInputClass = $(this).next().attr('class');
						var applicantInputType = $(this).next().prop('type');
						var question = $(this).val();
						var saveInput = $(this);
						var saveApplicantInput = $(this).next();
						var parameters = {};
						if (classNeeded == "text" || classNeeded == "file" || classNeeded == 'checkbox' ){
							parameters = {
								question_tag: "input",
								question: question,
								applicant_input_type: applicantInputType
							}
							$.post('/signup/fund_signup/add_field/' + categoryId, parameters, function(data){
								console.log(data);
								saveInput.replaceWith("<p id = '" + data.id + "' class = 'paragraph-filler'><span class = question-pointer>" + question + "</span><span><i class = 'fa fa-times delete' id= '" + data.id + "'></i><i class = 'fa fa-pencil add' id = '" + data.id + "'></i> </span></p> <hr> ")
							})
						}
						else{
							parameters = {
								description_tag: "textarea",
								description: question
							}
							$.post('/signup/fund_signup/add_field/' + categoryId, parameters, function(data){
								console.log(data);
								saveInput.replaceWith("<p id = '" + data.id + "' class = 'description-filler'><span class = question-pointer>" + question + "</span><span><i class = 'fa fa-times delete' id= '" + data.id + "'></i><i class = 'fa fa-pencil add' id = '" + data.id + "'></i> </span></p> <hr>");
							})
						}
				})
				$(document).off('click', '.add');
				$(document).on('click', '.add', function(){
						var fieldId = $(this).attr("id");
						var val = $(this).parent().prev().html();
						var question_or_description = $(this).parent().parent();
						console.log(question_or_description);
						console.log(fieldId);
						console.log(val);
					  if(question_or_description.attr('class') == 'paragraph-filler' || question_or_description.attr('class') == 'input-filler'){
					  	if($(this).parent().prev().children('input').length >0){
					  		return true
					  	}
					  	else{
					  		$(this).parent().prev().html("<input value = '" + val+ "' id = '" + fieldId + "' class = 'edit-text-question'></input>");
					  	}
						}

						else{
					  	if($(this).parent().prev().children('input').length >0){
					  		return true
					  	}
					  	else{
					  		$(this).parent().prev().html("<input value = '" + val+ "' id = '" + fieldId + "' class = 'edit-text-question'></input>");
					  	}

						}
				})
				$(document).off('blur', '.edit-text-question, .edit-text-description');
				$(document).on('blur', '.edit-text-question, .edit-text-description', function(){
					var fieldId = $(this).attr("id");
					var value = $(this).val();
					var inputClass = $(this).attr("class");
					var applicantInputType = $(this).parent().parent().next().prop('type');
					console.log(applicantInputType);
					var saveInput = $(this);
					if(inputClass == 'edit-text-question'){
							var parameters = {
								question_tag: "input",
								question: value,
								applicant_input_type: applicantInputType
							}
							$.post('/signup/fund_signup/edit_field/' + fieldId, parameters, function(data){
								saveInput.replaceWith("<p id = '" + data.id + "' class = 'paragraph-filler'>" + value + "</p> ");
							})
					}
					else{
						var parameters = {
								description_tag: "textarea",
								description: value
							}
							$.post('/signup/fund_signup/edit_field/' + fieldId, parameters, function(data){
								saveInput.replaceWith("<p id = '" + fieldId + "' class = 'description-filler'>" + value + "</p> ")
							})
					}

				})

				$(document).on('click', '.delete', function(){
					var fieldId = $(this).attr("id");
					var question = $(this).parent().parent();
					var answer = $(this).parent().parent().next();
					var hr = $(this).parent().parent().next().next();

					$.get('/signup/fund_signup/delete_field/'+ fieldId, function(data){
						if(question == 'paragraph-filler' || question == 'input-filler'){
							question.remove();
							answer.remove();
							hr.remove();
						}
						else{
							question.remove();
							answer.remove();
						}

					})

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
