$(document).ready(function(){

	var FundModel = Backbone.Model.extend({});

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
  		})
  		var view = new AccountView({model: account});
  		this.$el.append(view.render().el);
  		console.log("BUM");
  		console.log($("body"));
  		$('body').on('click', '#profile-picture', function(){
  			console.log('HI');
			    $("input[id='my_file']").click();
  		});
  		$('body').on('change', "input[id='my_file']", function(){
  			   if (this.files && this.files[0]) {

	          var reader = new FileReader();

	          reader.onload = function (e) {

	          $('#profile-picture')
	            .attr('src', e.target.result)
	            .width(250)
	            .height(250);
	          };

	   		 		reader.readAsDataURL(this.files[0]);
	   		 		$("#add-profile").css("display", "none");
  				}
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
  })

  var EligibleDisplay = Backbone.View.extend({
  	tagName: 'div',
  	id: "eligible-handler",
  	initialize: function(){
  		var eligible = new FundModel({
  			fundName: fund_setup.username
  		})
  		var view = new EligibleView({model: eligible});
  		this.$el.append(view.render().el);
  	}
  })

  var Router = Backbone.Router.extend({
	routes : {
		"" : "account",
		"account" : "account",
		"eligible" : "eligible"
	},
	account : function() {
		this.loadView(new AccountDisplay());
	},
	eligible : function() {
		this.loadView(new EligibleDisplay());
	},
	loadView : function(viewing) {
		console.log(this);
		console.log(viewing.$el.context.firstChild);
		this.view && this.view.remove();
		$('body').append(viewing.el);
	}
});

var router = new Router();
Backbone.history.start();
  // var accountDisplay = new AccountDisplay();
  // var eligibleDisplay = new EligibleDisplay();

})