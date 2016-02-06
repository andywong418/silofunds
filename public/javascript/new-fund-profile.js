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
  		
  		console.log(this.model.get('description'));
  		if(this.model.get('profile_picture')){
				this.$("#profile-picture").attr('src', this.model.get('profile_picture'));
			}
			if(this.model.get('description')){
				this.$("#description-area").val( this.model.get('description'));
			}
			if(this.model.get('charity_number')){
				this.$("#charity-input").val( this.model.get('charity_number'));
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
  				$.post('/signup/fund_signup/' + fund_setup.id, parameters, function(data){
  				console.log(data);
  			})
  			}
  		})
  		$(document).on('blur', '#charity-input', function(){


  				parameters = {charity_number: $("#charity-input").val() };
  				$.post('/signup/fund_signup/' + fund_setup.id, parameters, function(data){
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
  		if(this.model.get("nationality")){
  			this.$("#nationality-input").val(this.model.get("nationality"));
  		}
  		if(this.model.get("religion")){
  			this.$("#religion-input").val(this.model.get("religion"));
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

  		$(document).on('blur', '#nationality-input, #religion-input', function(){
	  		if($(this).val()){
	  			var field = $(this).siblings().attr('id');
	  			var value = $(this).val();
	  			var parameters = {};
	  			parameters[field] = value;
	  			$.post('/signup/fund_signup/' + fund_setup.id, parameters, function(data){
	  				console.log(data);
	  			})
  			}
  		});

  		// $(document).on('blur', '#min-age-input,#max-age-input,#min-amount-input,#max-amount-input'){
  		// 	var field = $(this).siblings().attr('id');
  		// }


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
		var applicationModel = new FundModel();
		applicationModel.fetch({
			success:function(){
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