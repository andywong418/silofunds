$(document).ready(function(){
	var UserNav = Backbone.View.extend({
        el: "nav",

        initialize: function(){
        this.searchDropdown();
      },
      searchDropdown: function(){
      	$("#search-dropdown").click(function(e){
      		e.preventDefault();
      	});
      }

  });
	var userNav = new UserNav();
//setting up the user in signup

	var UserModel = Backbone.Model.extend({
		defaults:{
			username: "",
		}

	});

	var UserView = Backbone.View.extend({
		id: 'user-setup',
		template: _.template($('#profile-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
	})
	var UserInfo = Backbone.View.extend({
		el: 'body',
		initialize: function(){
			var user = new UserModel({
          username: user_setup.username
        });

        var view = new UserView({ model: user });

        this.$el.append(view.render().el);
		}
	})

	var userInfo = new UserInfo();
})