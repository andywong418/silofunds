$(document).ready(function(){
	var FundModel = Backbone.Model.extend({

	});
	$("#name").html(fund.username);
	var advanced = true;
	var advanced_2 = true;
	$("#advanced-search").toggle(false);
	$("#advanced-search-2").toggle(false);
	$("#grants").click(function(){
  		// $("#advanced-age").attr("value", age);
  		$("#advanced-search").toggle(true);
  		$("#advanced-search-2").toggle(false);
  		$("#grants span").css("display","inline");
  		$("#users span").css("display","none");
  		// $("#text_search").attr("name", "fund_tags");
  		advanced = false;
  		return true;
  	});
	
	$("#users").click(function(){
		// $("#advanced-age-2").attr("value", age);

  		$("#advanced-search-2").toggle(true);
  		$("#advanced-search").toggle(false);
  		$("#users span").css("display","inline");
  		$("#grants span").css("display","none");
  		// $("#text_search").attr("name", "user_tags")
  		advanced_2 = false; 
	});

	$(document).click(function(e) {
  if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null) {	       
      $("#advanced-search").toggle(false);      	
    	
  }
  else{
    		return true;
    	}

  if ( $(e.target).closest('#advanced-search-2').length == 0 && e.target.closest('#users') === null) {
    $("#advanced-search-2").toggle(false);      	     	
  }
  else{
    		return true;
  }
})

$("#profile-figure").hover(function(){
$("#add-profile").css("display", "inline");
}, function(){
$("#add-profile").css("display", "none");
});

$("#add-profile").click(function() {
    $("input[id='my_file']").click();
	});
	$("input[id='my_file']").change(function(){
		
    if (this.files && this.files[0]) {
    	
      var reader = new FileReader();

      reader.onload = function (e) {
        		
      $('#fund-picture')
        .attr('src', e.target.result)
        .width(250)
        .height(250);
      };

		 		reader.readAsDataURL(this.files[0]);
		}
		var file = this.files[0];
		var data = new FormData();
		data.append('profile_picture', file);
		data.append('fund', fund.id);
		$.ajax({
			type: "POST",
			url: "/user-edit/profile-picture",
			data: data,
			processData: false,
			contentType: false,
		}).then(function(data){
			console.log("SUCCESS", data);
		})
})
		


var OverviewView = Backbone.View.extend({
  	id: 'overview-setup',
  	template: _.template($('#overview-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
  });
var OverviewDisplay = Backbone.View.extend({
	tagName: 'div',
	id: 'overview-handler',
	initialize: function(){
		console.log(this.model.get('start_date'));
		var startArray = this.model.get('start_date').split("T");
		var start_date = startArray[0].split("-").reverse().join("-");
		var deadlineArray = this.model.get('deadline').split("T");
		var deadline = deadlineArray[0].split("-").reverse().join("-");
		console.log(deadline);
		var overview = new FundModel({
		fundName: this.model.get('username'),
		fundDescription: this.model.get('description'),
		fundStartDate: start_date,
		fundDeadline: deadline
		})
		var view = new OverviewView({model: overview});
		this.$el.append(view.render().el);
		console.log(this.model);
		$('#overview').addClass('chosen');
		$('#overview').css("background-color", "#36D7B7");
		$('#overview, #overview-paragraph').css("color", "white");
		$('#overview').css("border-right", "0");
		$('.switcher li').not("#overview").css("background-color", "white");
		$('#application-paragraph, #application').css("color", "black");
		$('#eligibility-paragraph, #eligibility').css("color", "black");
		$('.switcher li').not("#overview").css("border-right", "0");

		this.editDescription();
		this.editDates();
  },
  editDescription: function(){
  	 $(document).on('click', '#edit-description', function(){
  	 		var description = $("#description").html();
  	 		console.log(description);
  	 		$("#description").replaceWith("<textarea class = 'description-filler' id = '" + fund.id + "'>" + description + "</textarea>");
  	 });

  	 $(document).on('blur', ".description-filler", function(){
  	 	var newDescription = $(this).val();
  	 	console.log(newDescription);
  	 	var parameters = {description: newDescription};
  	 	$.post('/funds/edit_description/' + fund.id, parameters, function(data){
  	 		$('.description-filler').replaceWith("<p id = 'description'>" + newDescription + "</p>");
  	 	})
  	 })

  },
  editDates: function(){
  	$(document).on('click', '#edit-dates', function(){
  	 		var startArray = fund.start_date.split("T");
				var start_date = startArray[0];
				var deadlineArray = fund.deadline.split("T");
				var deadline = deadlineArray[0];
  	 		console.log(description);
  	 		$("#dates").replaceWith("<div class = 'date-container'><p class = 'start-date-filler'> Start date: <input class = 'date-filler' id = 'start_date' type = 'date' value = '" +start_date+ "'></input></p><p class = 'deadline-filler'>Deadline: <input class= 'date-filler' id = 'deadline' type = 'date' value = '" + deadline + "'></input></p></div>");
  	 });

  	 $(document).on('blur', ".date-filler", function(){
  	 	var newDates= $(this).val();
  	 	var dateId = $(this).attr("id");
  	 	console.log(newDates);
  	 	var parameters = {};
  	 	parameters[dateId] = newDates;
  	 	$.post('/funds/edit_dates/' + fund.id, parameters, function(data){
  	 		var startArray = data.start_date.split("T");
				var start_date = startArray[0].split("").reverse().join("-");;
				var deadlineArray = data.deadline.split("T");
				var deadline = deadlineArray[0].split("").reverse().join("-");;
  	 		console.log(description);
  	 		$('.date-container').replaceWith("<p id = 'dates> The applications for this fund starts on" + start_date +  " and deadline is on " + deadline +"</p>");
  	 	})
  	 })
  }
})


var EligibleView = Backbone.View.extend({
  	id: 'eligible-setup',
  	template: _.template($('#eligible-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
  });

var EligibleDisplay = Backbone.View.extend({
	tagName: "div", 
	id: "eligible-handler",
	initialize: function(){
		var eligible = new FundModel({
				name: fund.username,
				nationality: this.model.get("countries"),
				minAge: this.model.get("minimum_age"),
				maxAge: this.model.get("maximum_age"),
				minAmount: this.model.get("minimum_amount"),
				maxAmount: this.model.get("maximum_amount"),
				religion: this.model.get("religion"),
				charityNumber: this.model.get("charity_number"),
				gender: this.model.get("gender"),

		})
		var view = new EligibleView({model: eligible});
		this.$el.append(view.render().el);
		$('#application-paragraph, #application').css("color", "black");
		$('#overview-paragraph, #overview').css("color", "black");
		$('#eligibility').css("background-color", "#36D7B7");
		$('#eligibility, #eligibility-paragraph').css("color", "white");
		$('#eligibility').css("border-right", "0");
		$('.switcher li').not("#eligibility").css("border-right", "0");
		$('.switcher li').not("#eligibility").css("background-color", "white");
		

		this.checkCriteria();
	},
	checkCriteria: function(){
		console.log(fund.countries);
		if(fund.countries){
			for (var i = 0; i < fund.countries.length; i++){
				this.$("#countries").after("<span class = 'added-countries'>" + fund.countries[i] + "</p>")
			}
		}
		else{
			this.$("#countries").after("<span>This scholarship does not specify any eligible countries. <span>")
		}
		if(fund.minimum_age){
			this.$("#min_age").after("<span class = 'added-age'>" + fund.minimum_age + "</p>")
		}
		else{
			this.$("#min_age").after("<span>This scholarship does not specify a minimum age.<span>")
		}
		if(fund.maximum_age){
			this.$("#max_age").after("<span class = 'added-age'>" + fund.maximum_age + "</p>")
		}
		else{
			this.$("#max_age").after("<span>This scholarship does not specify a maximum age.<span>")
		}
		if(fund.minimum_amount){
			this.$("#min_amount").after("<span class = 'added-amount'>" + fund.minimum_amount + "</p>")
		}
		else{
			this.$("#min_amount").after("<span>This scholarship does not specify a minimum amount of funding given.<span>")
		}
		if(fund.maximum_amount){
			this.$("#max_amount").after("<span class = 'added-amount'>" + fund.maximum_amount + "</p>")
		}
		else{
			this.$("#max_amount").after("<span>This scholarship does not specify a maximum amount of funding given.<span>")
		}
		if(fund.religion){
			var religion = fund.religion;
			// religion = religion.split(",");
			for (var i = 0; i < religion.length; i++){
				this.$("#religion").after("<span class = 'added-religion'>" + religion[i] + "</p>")
			}
		}
		else{
			this.$("#religion").after("<span>This scholarship does not have any specific requirements for religion.<span>")
		}
		if(fund.gender){
			this.$("#gender").after("<span class = 'added-gender'>" + fund.gender + "</p>")
		}
		else{
			this.$("#gender").after("<span>This scholarship does not specify a certain gender.<span>")
		}
		if(fund.merit_or_finance){
			this.$("#merit_or_finance").after("<span class = 'added-merit'>" + fund.merit_or_finance + "</span>");
		}
		else{
			this.$("#merit_or_finance").after("<span>This scholarship caters for both financial situation and merit.<span>")
		}
	}
})

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
  			fundName: fund.username
  			})
  			var view = new ApplicationView({model: application});
  			this.$el.append(view.render().el);

  			$( window ).resize(function() {
				  var savedLength = $("ul.cd-switcher").width();
					$("ul.cd-switcher").width($("#application-info").width());
				
				});
		 		$('#application').css("background-color", "#36D7B7");
				$('#application, #application-paragraph').css("color", "white");
				$('#application').css("border-right", "0");
				$('#overview-paragraph, #overview').css("color", "black");
				$('#eligibility-paragraph, #eligibility').css("color", "black");
				$('.switcher li').not("#application").css("background-color", "white");
				$('.switcher li').not("#application").css("color", "black");
				$('.switcher li').not("#application").css("border-right", "0");

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
							$("ul.cd-switcher").width($("#application-info").width());
							var formLength = $("#application-info").width();
							console.log("-" + (formLength - savedLength) + "px");
							// $("ul.cd-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");
							
						}
						else{
						var savedLength = $("ul.cd-switcher").width();
							$("ul.cd-switcher").width($("#application-form").width());
							var formLength = $("#application-form").width();
							console.log("-" + (formLength - savedLength) + "px");
							$("ul.cd-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");
						}
					});

				$(document).on('click', '.category', function(){
					var categoryId = $(this).attr('id');
					$("#" + categoryId).css("background-color", "#BFBFBF");
					$("#" + categoryId).addClass("active");
					$(".cd-switcher li").not("#" + categoryId + ", #add-category").css("background-color", "white");
					$(".cd-switcher li").not("#" + categoryId + " , #add-category").removeClass("active");
					console.log($("#add-field").siblings());
					if($(this) != $("ul.cd-switcher").children(":first")){
						$("ul.cd-switcher").children(":first").css("border-bottom", "none");

					}
					else{
						$("ul.cd-switcher").children(":first").css("border-bottom-left-radius", "3px");
					}
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
				$(document).on('click', '#add-category', function(){
					var savedLength = $("ul.cd-switcher").width();
					$("ul.cd-switcher").width($("#application-form").width());
					var formLength = $("#application-form").width();
					if(formLength = savedLength != 0){
					$("ul.cd-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");
					}
					if($(this).prev("li").attr("id")){
					$(".active").removeClass("active");
					$(this).before("<li class = 'active'><input style = 'height: 20px;' id = 'addition', type = 'text'></input></li>");
					$("#add-field").siblings().not("#delete-category").remove();
					}

				})

				$(document).off('blur', "#addition");
				$(document).on('blur', "#addition", function(){
					var newTitle = $(this).val();		
					console.log($(this).parent());	
					if($(this).val()){
						var parent = $(this).parent();
						$(".cd-switcher li").not(this).removeClass("active");
						$(".cd-switcher li").not(this).not("#add-category").css("background-color", "white");
						var parameters = {title: newTitle};
						$.post('/signup/fund_signup/add_category/'+ fund.fund_or_user, parameters, function(data){
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
				$(document).on('click', '.add', function(){
						var fieldId = $(this).attr("id");
						var val = $(this).parent().prev().html();
						var question_or_description = $(this).parent().parent();
						console.log(question_or_description);
						console.log(fieldId);
						console.log(val);
					  if(question_or_description.attr('class') == 'paragraph-filler' || question_or_description.attr('class') == 'input-filler'){
						$(this).parent().prev().html("<input value = '" + val+ "' id = '" + fieldId + "' class = 'edit-text-question'></input>");
						}

						else{
							$(this).parent().prev().html("<input value = '" + val+ "' id = '" + fieldId + "' class = 'edit-text-description'></input>");
						
						}
				})

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
		"" : "overview",
		"overview" : "overview",
		"eligible" : "eligible",
		"application": "application"
	},
	overview: function() {
		// var link = window.location.hostname;
		var OverviewModel = Backbone.Model.extend({
			url: "/signup/fund/fund_account/" + fund.id
		})
		var overviewModel = new OverviewModel();
		overviewModel.fetch({
			success:function(){
				console.log(JSON.stringify(overviewModel));
				router.loadView(new OverviewDisplay({model: overviewModel }));
			}
		})
	},
	eligible : function() {
		var EligibleModel = Backbone.Model.extend({
			url: "/signup/fund/fund_account/" + fund.id
		})
		var eligibleModel = new EligibleModel();
		eligibleModel.fetch({
			success:function(){
				console.log(JSON.stringify(eligibleModel));
				router.loadView(new EligibleDisplay({model: eligibleModel }));
			}
		})
	},
	application: function() {
		var ApplicationModel = Backbone.Model.extend({
			url: "/signup/fund/fund_account/application/" + fund.id
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
		this.view && this.view.remove() && this.view.unbind();
		this.view = viewing;
		$('#overview-container').append(viewing.el);
	}
});


var router = new Router();
Backbone.history.start();

})