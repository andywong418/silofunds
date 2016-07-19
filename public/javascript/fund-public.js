$(document).ready(function(){
	var FundModel = Backbone.Model.extend({

	});
	$("#name").html(fund.username);

  var advanced = true;
  var advanced_2 = true;
  $("#advanced-search").toggle(false);
  $("#advanced-search-2").toggle(false);
  $("#grants").click(function(){
      $("#advanced-search").slideDown();
      $("#advanced-search-2").toggle(false);
      $("#grants span").css("display","inline");
      $("#users span").css("display","none");
      advanced = false;
      $("#search-form").attr('action', '/results');
      $("#text_search").attr('placeholder', 'Keywords - Subject, University, Degree level')
      return true;
    });

  $("#users").click(function(){
      $("#advanced-search-2").toggle(true);
      $("#advanced-search").toggle(false);
      $("#users span").css("display","inline");
      $("#grants span").css("display","none");
      advanced_2 = false;
      $("#search-form").attr('action', '/results/users');
      $("#text_search").attr('placeholder', 'Search for users by name or by interests')
  });
  $(document).on('click', '#advs-link', function(){
    console.log("REFINE");
    $("#advanced-search").slideDown();
     advanced = false;
      return true;
  });
  $(document).click(function(e) {
    if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null && e.target.closest('#advs-link') === null  && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
        $("#advanced-search").toggle(false);

    }
    else{
          return true;
        }

    if ( $(e.target).closest('#advanced-search-2').length == 0 && e.target.closest('#users') === null && e.target.closest('#advs-link') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
      $("#advanced-search-2").toggle(false);
    }
    else{
          return true;
    }
  });

  if(loggedInUser){
    $('.pre-signin').css("display", "none");
    $('.post-signin').css("display","inline");
    $('.post-signin').css("z-index", "11");
    if(loggedInUser.organisation_or_user){
      $("#home").attr("href", '/funds/' + loggedInUser.id );
      $(".settings").attr("href", '/funds/settings/' +loggedInUser.id);
      $(".logout").attr("href", '/funds/logout');
    }
    else{
      $("#home").attr("href", '/users/' + loggedInUser.id);
      $(".settings").attr("href", '/users/settings/' +loggedInUser.id );
      $(".logout").attr("href", '/users/logout/' + loggedInUser.id);
    }
  }
  else{
    $('.post-signin').css("display","none");
  };




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
  			$(document).ready(function(){
  				var savedLength = $("ul.category-switcher").width();
					$("ul.category-switcher").width($("#application-info").width());
  			})
  			$( window ).resize(function() {
				  var savedLength = $("ul.category-switcher").width();
					$("ul.category-switcher").width($("#application-info").width());

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
			},
			editCategory: function(){

				categoriesArray= this.model.get("categories");
					for(var i = categoriesArray.length -1; i >= 0; i--){
					this.$(".category-switcher").prepend("<li class = 'category' id = '" + categoriesArray[i].id + "'>" + categoriesArray[i].title + "</li>");
					}
					this.$(".category-switcher li").first().css("background-color", "#BFBFBF");
					this.$(".category-switcher li").first().addClass("active");
					var onLoadCategory = this.$(".category-switcher li").first().attr("id");
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
									$("#add-field").before("<p class = 'paragraph-filler' id = '" + data[i].id + "'><span class = question-pointer>" + parsed.question + "</span></p><textarea placholder = 'The applicant will type their answer here' class = 'add-text' id= '" +  data[i].id + "'></textarea> <hr>");
								}
								else if(parsed.question_tag  && parsed.applicant_input_type == "file"){
									$("#add-field").before("<p class = 'input-filler' id = '" + data[i].id + "'><span class = question-pointer>" + parsed.question + "</span></p><input type = 'file' placholder = 'The applicant will type their answer here' class = 'add-file-answer' id= '" + data[i].id + "' /> <hr>");
								}
								else if (parsed.question_tag  && parsed.applicant_input_type == "checkbox"){
									$("#add-field").before("<p class = 'input-filler' id = '" +  data[i].id + "'><span class = question-pointer>" + parsed.question + "</span></p><input type = 'checkbox' class = 'add-checkbox-answer' id= '"+ data[i].id + "' /> <hr>");
								}
								else{
									$("#add-field").before("<p class = 'description-filler' id= '" +  data[i].id + "'><span class = question-pointer>" + parsed.description + "</span></p> <hr>");
								}
							}
							var savedLength = $("ul.category-switcher").width();
							$("ul.category-switcher").width($("#application-info").width());
							var formLength = $("#application-info").width();
							console.log("-" + (formLength - savedLength) + "px");
							// $("ul.category-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");

						}
						else{
						var savedLength = $("ul.category-switcher").width();
							$("ul.category-switcher").width($("#application-form").width());
							var formLength = $("#application-form").width();
							console.log("-" + (formLength - savedLength) + "px");
							$("ul.category-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");
						}
					});

				$(document).on('click', '.category', function(){
					var categoryId = $(this).attr('id');
					$("#" + categoryId).css("background-color", "#BFBFBF");
					$("#" + categoryId).addClass("active");
					$(".category-switcher li").not("#" + categoryId + ", #add-category").css("background-color", "white");
					$(".category-switcher li").not("#" + categoryId + " , #add-category").removeClass("active");
					console.log($("#add-field").siblings());
					if($(this) != $("ul.category-switcher").children(":first")){
						$("ul.category-switcher").children(":first").css("border-bottom", "none");

					}
					else{
						$("ul.category-switcher").children(":first").css("border-bottom-left-radius", "3px");
					}
					$.get('/signup/fund_signup/get_fields/' + categoryId, function(data){
						$("#add-field").siblings().not("#delete-category").remove();
						if(data){
							for (var i = 0; i < data.length; i++){
								var parsed = JSON.parse(data[i].html);
								console.log(parsed);
								if(parsed.question_tag  && parsed.applicant_input_type == "textarea"){
									$("#add-field").before("<p class = 'paragraph-filler' id = '" +  data[i].id + "'><span class = question-pointer>" + parsed.question + "</span></p><textarea placholder = 'The applicant will type their answer here' class = 'add-text' id= '" + data[i].id + "'></textarea> <hr>");
								}
								else if(parsed.question_tag  && parsed.applicant_input_type == "file"){
									$("#add-field").before("<p class = 'input-filler' id = '" +  data[i].id + "'><span class = question-pointer>" + parsed.question + "</span></p><input type = 'file' placholder = 'The applicant will type their answer here' class = 'add-file-answer' id= '" +  data[i].id + "' /> <hr>");
								}
								else if (parsed.question_tag  && parsed.applicant_input_type == "checkbox"){
									$("#add-field").before("<p class = 'input-filler' id= '" + data[i].id + "'><span class = question-pointer>" + parsed.question + "</span></p><input type = 'checkbox' class = 'add-checkbox-answer' id= '" + data[i].id + "' /> <hr>");
								}
								else{
									$("#add-field").before("<p class = 'description-filler' id = '" + data[i].id + "'><span class = question-pointer>" + parsed.description + "</span></p> <hr>");
								}
							}
						}
					})
				})
				// $(document).off('click', '#add-category');
				// $(document).on('click', '#add-category', function(){
				// 	var savedLength = $("ul.category-switcher").width();
				// 	$("ul.category-switcher").width($("#application-form").width());
				// 	var formLength = $("#application-form").width();
				// 	if(formLength = savedLength != 0){
				// 	$("ul.category-switcher").css("margin-left", "-" + (formLength - savedLength) + "px");
				// 	}
				// 	if($(this).prev("li").attr("id")){
				// 	$(".active").removeClass("active");
				// 	$(this).before("<li class = 'active'><input style = 'height: 20px;' id = 'addition', type = 'text'></input></li>");
				// 	$("#add-field").siblings().not("#delete-category").remove();
				// 	}
        //
				// })
        //
				// $(document).off('blur', "#addition");
				// $(document).on('blur', "#addition", function(){
				// 	var newTitle = $(this).val();
				// 	console.log($(this).parent());
				// 	if($(this).val()){
				// 		var parent = $(this).parent();
				// 		$(".category-switcher li").not(this).removeClass("active");
				// 		$(".category-switcher li").not(this).not("#add-category").css("background-color", "white");
				// 		var parameters = {title: newTitle};
				// 		$.post('/signup/fund_signup/add_category/'+ fund.organisation_or_user, parameters, function(data){
				// 			console.log(data);
				// 			parent.replaceWith("<li class = 'category active' style= 'background-color: #BFBFBF' id = '" + data.id + "'><span>" + data.title + "</span></li>");
				// 		})
				// 	}
				// })
				// $(document).on('click', '#delete-category', function(e){
				// 	e.preventDefault();
				// 	var categoryId = $(".active").attr("id");
				// 	var closestCategory;
				// 	if($(".active").prev("li").prop("tagName") != "LI"){
				// 		closestCategory = $(".active").next("li");
				// 	}
				// 	else{
				// 		closestCategory = $(".active").prev("li");
				// 	}
        //
				// 		console.log(closestCategory);
				// 		$(".active").remove();
				// 		closestCategory.click();
        //
				// 	$.get('/signup/fund_signup/delete_category/'+ categoryId, function(data){
        //
				// 	})
				// })
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
