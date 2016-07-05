$(document).ready(function(){

	var FundModel = Backbone.Model.extend({
		url: '/signup/fund_account/' + fund_setup.id
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
			//Turn off all events in case of ghost views
			$(document).unbind('*');
  		if(this.model.get('profile_picture')){
				this.$("#profile-picture").attr('src', this.model.get('profile_picture'));
			}
			if(this.model.get('description')){
				this.$("#description-area").val( this.model.get('description'));
				this.$("#description-area").css("border", "2px #16a085 solid")
			}
			if(this.model.get('charity_id')){
				this.$("#charity-input").val( this.model.get('charity_id'));
				this.$("#charity-input").css("border", "2px #16a085 solid");
			}
			var categoriesArray = this.model.get('categories');
			if(!categoriesArray){
				parameters = {title: "General", status: "setup" };
  			$.post('/signup/fund_signup/fund_application/' + fund_setup.fund_or_user, parameters, function(data){
  			});
			}

  		$(document).on('click', '#profile-picture', function(){
			    $("input[id='my_file']").click();
  		});
  		$(document).on('change', "input[id='my_file']", function(){
  			   if (this.files && this.files[0]) {

	          var reader = new FileReader();

	          reader.onload = function (e) {
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
  			if (code == 13){

  				parameters = {charity_number: $("#charity-input").val() };
  				$.post('/signup/fund_signup/charity_no/' + fund_setup.id, parameters, function(data){
  				console.log(data);
  			})
  			}
  		})
  		$(document).on('blur', '#charity-input', function(){

  				$("#charity-input").css("border", "2px #16a085 solid");
  				parameters = {charity_number: $("#charity-input").val() };
  				$.post('/signup/fund_signup/charity_no/' + fund_setup.id, parameters, function(data){
  				console.log(data);
  			})

  		})
  	}
  });

  var Router = Backbone.Router.extend({
	routes : {
		"" : "account",
		"account" : "account"
	},
	account : function() {
		// var link = window.location.hostname;
		var router = this;
		var accountModel = new FundModel();
		accountModel.fetch({
			success:function(){
				router.loadView(new AccountDisplay({model: accountModel}));
			}
		});
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
