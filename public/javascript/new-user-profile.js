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
	});
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
			if(counter === 0){
						$('#profile-figure').css("z-index", "4");
						$("#profile-picture, #add-profile").click(function() {
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
  	          var file = this.files[0];
							var data = new FormData();
							data.append('profile_picture', file);
							data.append('user', user_setup.id);
							$.ajax({
								type: 'POST',
								url: "/signup/user_signup/profile_picture/" + user_setup.id,
								data: data,
							  processData: false,
								contentType: false
							}).done(function(data){
								console.log(data);

							});
	          		console.log(this.files[0].name);
         		 		reader.readAsDataURL(this.files[0]);
        			}
    				});

			}
			$("#next").click(function(){
				counter++;
					if(counter == 1){
						$('#add-profile').toggle(false);
						$('#profile-figure').css("z-index", "2");
						$("#previous").css("display", "inline");
						$('#description').css("z-index", "4");
						$("#description").attr("placeholder", "Please enter a description of youself- including any organisation you are part of, what you are currently seeking funding for and what you will do with the money granted.");
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
						$("#applied-funds").css("z-index", "4");
						$("#finish").toggle(true);
						$("#next").toggle(false);
					}
					else{
						$("#applied-funds").css("z-index", "2");
						$("#finish").toggle(false);
						$("#next").toggle(true);
					}
					if(counter == 7){
						$("#finish").toggle(true);
						$("#next").toggle(false);
					}
			});

			$(document).on('keypress', function(e){
				if (e.which == 13 || e.keyCode == 13){
					counter++;
					if(counter == 1){
						$('#add-profile').toggle(false);
						$('#profile-figure').css("z-index", "2");
						$("#previous").css("display", "inline");
						$('#description').css("z-index", "4");
						$("#description").attr("placeholder", "Please enter a description of youself- including any organisation you are part of, what you are currently seeking funding for and what you will do with the money granted.");
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
						$("#applied-funds").css("z-index", "4");
						$("#finish").toggle(true);
						$("#next").toggle(false);
					}
					else{
						$("#applied-funds").css("z-index", "2");
						$("#finish").toggle(false);
						$("#next").toggle(true);
					}
					if(counter == 7){

						e.preventDefault();
						$("#finish").toggle(true);
						$("#next").toggle(false);
						var preloader = $('.se-pre-con');
						var finalInput = $('#applied-funds');
						var profileSrc = $('#profile-picture').attr('src');
						var description = $('textarea#description').val();
						var workInput = $('#work-span label').html();
						var birthday = $('#date_of_birth').val();
						var country = $('#country-select option:selected').val();
						var religion = $('#religion-select option:selected').val();
						var fundingNeeded = $('.progress').val();
	
						if(profileSrc == '../../images/fund_img_placeholder.jpg' || !description || !birthday || !country || !religion || !fundingNeeded){
							$("#applied-funds").css("z-index", "4");
							console.log("ERROR");
							$('.alert').css("display", "block");
							counter--;
						}
						else{
							finalInput.css("z-index", "0");
							preloader.css('display', 'inline');
							$('#profile-form').submit();
						}
					}
					if(counter > 7){
						counter = 7;
						console.log(counter);
					}
				}
			});

			$("#previous").click(function(){
				counter--;
				if(counter === 0){
						$('#add-profile').toggle(true);
						$('#profile-figure').css("z-index", "4");
						$('#previous').css('display','none');
					}
					else{
						$('#add-profile').toggle(false);
					}
				if(counter == 1){
					$('html, body').animate({
    		    scrollTop: 0
			    }, 2000);
			    $('#description').css("z-index", "4");
					$("#description").attr("placeholder", "Please enter a description of youself- including any organisation you are part of, what you are currently seeking funding for and what you will do with the money granted.");
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
				if(counter == 6){
						$("#applied-funds").css("z-index", "4");
				}

			});

			// $("input[id='video']").change(function(e){

			// 	var $input = $(this),
			// 	$label = $input.next('label'),
			// 	labelVal = $label.html();
			// 	var fileName = '';

			// 	if( e.target.value ){
			// 		fileName = e.target.value.split( '\\' ).pop();
			// 	}

			// 	if( fileName ){
			// 		$label.html( fileName );
			// 	}
			// 	else{
			// 		$label.html( labelVal );
			// 	}

			// 	$input
			// 		.on( 'focus', function(){ $input.addClass( 'has-focus' ); })
			// 		.on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
			// });

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

				$("input[id='work']").change(function(e){
					var $input = $(this),
					$label = $input.next('label'),
					labelVal = $label.html();
					var fileName = '';
					console.log("CHECK HERE TOO");
					if( this.files && this.files.length > 1 ){
					fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
					console.log(fileName);
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

	          var files = this.files;
	          console.log(files[0]);
	          var fileArray = [];
	         
						var data = new FormData();
						for(var i = 0; i < files.length; i++){
	          	data.append('past_work', files[i]);
	          };
						data.append('user', user_setup.id);
						$.ajax({
							type: 'POST',
							url: "/signup/user_signup/work/" + user_setup.id,
							data: data,
						  processData: false,
							contentType: false
						}).done(function(data){
							console.log(data);
						});

					$input
						.on( 'focus', function(){ $input.addClass( 'has-focus' ); })
						.on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
				});
			

		},
		finishSignup: function(){
			$('#finish').click(function(){
				var preloader = $('.se-pre-con');
				var finalInput = $('#applied-funds');
				var profileSrc = $('#profile-picture').attr('src');
				var description = $('textarea#description').val();
				var workInput = $('#work-span label').html();
				var birthday = $('#date_of_birth').val();
				var country = $('#country-select option:selected').val();
				var religion = $('#religion-select option:selected').val();
				var fundingNeeded = $('.progress').val();

				console.log(profileSrc);
				console.log(description);
				console.log(workInput);
				console.log(birthday);
				console.log(country);
				console.log(religion);
				console.log(fundingNeeded);

		
				if(profileSrc == '../../images/fund_img_placeholder.jpg' || !description || workInput == 'Choose up to 5 files' || !birthday || !country || !religion || !fundingNeeded){
					console.log("ERROR");
					$('.alert').css("display", "block");
					counter--;
				}
				else{
					finalInput.css("z-index", "0");
					preloader.css('display', 'inline');
					$('#profile-form').submit();
				}				
			});
		}
	});

	var userInfo = new UserInfo();
});


