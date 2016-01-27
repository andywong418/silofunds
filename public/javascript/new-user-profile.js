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
			if(counter == 0){
						$('#profile-figure').css("z-index", "4");
						$("#profile-picture").click(function() {
								console.log('HI');
						    $("input[id='my_file']").click();
						});
						$("input[id='my_file']").change(function(){
							
			        if (this.files && this.files[0]) {
			        	
		            var reader = new FileReader();

		            reader.onload = function (e) {
			            		
                $('#profile-picture')
                  .attr('src', e.target.result)
                  .width(250)
                  .height(250);
		            };

         		 		reader.readAsDataURL(this.files[0]);
        			}
    }) 

			}

			
			
			$("#next").click(function(){
				counter++;
					if(counter == 1){
						$('#add-profile').toggle(false)
						$('#profile-figure').css("z-index", "2")
						$("#previous").css("display", "inline");
						$('#description').css("z-index", "4");
						$("#description").attr("placeholder", "Please enter a description of youself- including any organisation you are part of, what you are currently seeking funding for and what you will do with the money granted.")
						$('#description').css("z-index", "4");	
					}
					else{
							$("#description").attr("placeholder","");
						$('#description').css("z-index", "2");
					}
					if(counter == 2){
						$('#past-work').css("z-index","4");
						$('html, body').animate({
			        scrollTop: $("#description").offset().top 
			    		}, 2000);
					}
						else{
						$('#past-work').css("z-index","2");
					}
					if(counter == 3){
					
						$('#age').css("z-index", "4");
					}
					else{
						
						$('#age').css("z-index", "2");
					}
					if(counter == 4){
						$('#nationality').css("z-index","4");
					}
					else{
						$('#nationality').css("z-index","2");
						
					}
					if(counter == 5){
						 $('html, body').animate({
			        scrollTop: $("#past-work").offset().top 
			    		}, 2000);
						$("#religion").css("z-index", "4");
					}
					else{
						$("#religion").css("z-index", "2");
					}		

					if (counter ==6){
						$("#applied-funds").css("z-index", "4")
						$("#finish").toggle(true);
						$("#next").toggle(false);
					}
					else{
						$("#applied-funds").css("z-index", "2");
						$("#finish").toggle(false);
						$("#next").toggle(true);
					}

			});

			$("#previous").click(function(){
				counter--;

				if(counter == 0){
						$('#add-profile').toggle(true);
						$('#profile-figure').css("z-index", "4")
						$('#previous').css('display','none');
					}
					else{
						$('#add-profile').toggle(false)
					}
				if(counter == 1){
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
				if(counter == 2){
					$('#past-work').css("z-index","4");
						$('html, body').animate({
			        scrollTop: $("#description").offset().top 
			    		}, 2000);
				}
				else{
					$('#past-work').css("z-index","2");
				}
				if(counter == 3){
						$('#age').css("z-index", "4");
				}
				else{
						$('#age').css("z-index", "2");
				}
				if(counter == 4){
					$('#nationality').css("z-index","4");
				}
				else{
					$('#nationality').css("z-index","2");
				}		
				if(counter == 5){
						$("#religion").css("z-index", "4");
						$("#applied-funds").css("z-index", "2");
						$("#finish").toggle(false);
						$("#next").toggle(true);
				}
				else{
						$("#religion").css("z-index", "2");
				}		
				
			});
			$("input[id='video']").change(function(e){
		
				var $input = $(this),
				$label = $input.next('label'),
				labelVal = $label.html()
				var fileName = '';
			
				if( e.target.value ){
					fileName = e.target.value.split( '\\' ).pop();
				}

				if( fileName ){
					$label.html( fileName );
				}
				else{
					$label.html( labelVal );
				}

				$input
					.on( 'focus', function(){ $input.addClass( 'has-focus' ); })
					.on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
						});

			$("input[id='work']").change(function(e){
				console.log("IS IT GETTING THROUGH?");
				var $input = $(this),
				$label = $input.next('label'),
				labelVal = $label.html()
				var fileName = '';
				console.log("CHECK HERE TOO");
				if( this.files && this.files.length > 1 ){
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
				}
				else if( e.target.value ){
					fileName = e.target.value.split( '\\' ).pop();
					console.log(fileName);
				}

				if( fileName ){
					$label.html( fileName );
				}
				else{
					$label.html( labelVal );
				}

				$input
					.on( 'focus', function(){ $input.addClass( 'has-focus' ); })
					.on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
						});
		
		},
		finishSignup: function(){
			$('#finish').click(function(){
				$('#profile-form').submit();
			})
		}
	})
		
	var userInfo = new UserInfo();

	
})