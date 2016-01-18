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
        this.phaseStepping();
        this.finishSignup();
		},
		phaseStepping: function(){
			var counter = 0;
			$('#add-profile').toggle(false);
			$("#next").click(function(){
				counter++;
					if(counter == 1){
						$('#add-profile').toggle(true);
						$('#user-modal').css("background-color", "rgba(52, 54, 66, 0.9)")
						$('#profile-figure').css("z-index", "4")
					}
					else{
						$('#add-profile').toggle(false)
						$('#profile-figure').css("z-index", "2")
					}
					if(counter == 2){
						$("#previous").css("display", "inline");
						$('#description').css("z-index", "4");
						$("#description").attr("placeholder", "Please enter a description of youself- including your age, any organisation you are part of and what you are currently seeking funding for.")
						$('#description').css("z-index", "4");
					}
					else{
						$("#description").attr("placeholder","");
						$('#description').css("z-index", "2");
					}
					if(counter == 3){
						$('html, body').animate({
			        scrollTop: $("#video-intro").offset().top
			    		}, 2000);
						$('#video-intro').css("z-index", "4");
					}
					else{
						$('#video-intro').css("z-index", "2");
					}
					if(counter == 4){
						$('#past-work').css("z-index","4");
					}
					else{
						$('#past-work').css("z-index","2");
					}
					if(counter == 5){
						$('#applied-funds').css("z-index","4");
						$('#next').toggle(false);
						$('#finish').css('display','inline');
					}
					else{
						$('#applied-funds').css("z-index","2");
						$('#finish').css('display','none');
					}		

			});

			$("#previous").click(function(){
				counter--;

				if(counter == 1){
						$('#add-profile').toggle(true);
						$('#profile-figure').css("z-index", "4")
						$('#previous').css('display','none');
					}
					else{
						$('#add-profile').toggle(false)
					}
				if(counter == 2){
					$('html, body').animate({
    		    scrollTop: 0
			    }, 2000);
			    $('#description').css("z-index", "4");
					$("#description").attr("placeholder", "Please enter a description of youself- including your age, any organisation you are part of and what you are currently seeking funding for.")
				}
				else{
					$('#description').css("z-index", "2");
					$("#description").attr("placeholder","");
				}
				if(counter == 3){
					$('#video-intro').css("z-index", "4");
				}
				else{
					$('#video-intro').css("z-index", "2");
				}
				if(counter == 4){
						$('#past-work').css("z-index","4");
					}
					else{
						$('#past-work').css("z-index","2");
					}
				if(counter == 5){
					$('#applied-funds').css("z-index","4");
				}
				else{
					$('#applied-funds').css("z-index","2");
				}		
				
			})
		},
		finishSignup: function(){
			$('#finish').click(function(){
				$('#profile-form').submit();
			})
		}
	})

	var userInfo = new UserInfo();
})