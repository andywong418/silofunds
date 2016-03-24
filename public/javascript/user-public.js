$(document).ready(function(){

	var UserModel = Backbone.Model.extend({
		defaults: {
			name: "",
			age: 0,
			description: "",
			nationality: "",
			funding_needed: 0
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
			console.log(user);
			var myDate = user.date_of_birth.split("-");
			var yearFix= myDate[2].split("T");
			var day = yearFix[0];
			var newDate = myDate[1]+"/"+day+"/"+ myDate[0];
			var birthDate = new Date(newDate).getTime();
			var nowDate = new Date().getTime();
			var age = Math.floor((nowDate - birthDate) / 31536000000 );
			var user_model = new UserModel({
				name: user.username,
				age: age,
				description: user.description,
				nationality: user.nationality,
				funding_needed: user.funding_needed,
				religion: user.religion
			});
			var view = new UserView({model: user_model});
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
      function split( val ) {
      	return val.split(" ");
 			};
		  $("input#text_search" ).autocomplete({
		    source: "../autocomplete",
		    minLength: 1,
		    select: function( event, ui ) {
		      var terms = split( this.value );
		      // remove the current input
		      terms.pop();
		      // add the selected item
		      terms.push( ui.item.value );
		      // add placeholder to get the comma-and-space at the end
		      terms.push( "" );
		      this.value = terms.join(" ");
		      return false;
		    },
		    focus: function() {
		      // prevent value inserted on focus
		      return false;
		    }
		  });

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
			$(document).on('click', '#refine-search', function(){
			  console.log("REFINE");
			  $("#advanced-search").slideDown();
			   advanced = false;
			    return true;
			});
			$(document).click(function(e) {
			  if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null && e.target.closest('#refine-search') === null  && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
			      $("#advanced-search").toggle(false);

			  }
			  else{
			        return true;
			      }

        if ( $(e.target).closest('#advanced-search-2').length == 0 && e.target.closest('#users') === null && e.target.closest('#refine-search') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
          $("#advanced-search-2").toggle(false);
        }
        else{
              return true;
        }
			});

			this.workDisplay();
			this.loginStatus();
			this.applicationDisplay();
		},
		workDisplay: function(){
			console.log(documents)
			for( var i = 0; i < documents.length; i++){
				var document = documents[i].link;
				var seekingExtension = document.split(".");
				var extension = seekingExtension[seekingExtension.length-1];
				var seekingFilename = document.split("/");
				var filename = seekingFilename[seekingFilename.length-1];
				var id = documents[i].id;
        if(extension == "pdf"){
					$("#work-display").append("<span><i class = 'fa fa-file-pdf-o pdf-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i>");
				}
				else if(extension == "jpg" || extension == "png"){
					$("#work-display").append("<span><i class = 'fa fa-file-photo-o photo-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i>");
				}

				else if (extension == "xls" || extension == "xlsx"){
					$("#work-display").append("<span><i class = 'fa fa-file-excel-o excel-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i>");
				}

				else if (extension == "ppt" || extension == "pptx"){
					$("#work-display").append("<span><i class = 'fa fa-file-powerpoint-o powerpoint-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i>");
				}

				else if(extension == "mp4" || extension == "avi" || extension == "mkv"){
					$("#work-display").append("<span><i class = 'fa fa-file-video-o video-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i>");
				}

				else if (extension == "doc" || extension == "docx"){
					$("#work-display").append("<span><i class = 'fa fa-file-word-o word-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i>");
				}
				else{
					$("#work-display").append("<span><i class = 'fa fa-file filename " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i>");
				}
				if(documents[i].description){
					$("#add-work-description" + id).after("<p id = 'work-description" + id + "' class = 'work-description'>" + documents[i].description + "</p> ")
				}
			}
		},
    loginStatus: function(){
      console.log(loggedInUser);
      if(loggedInUser){
        $('.pre-signin').css("display", "none");
        $('.post-signin').css("display","inline");
        $('.post-signin').css("z-index", "11");
        if(loggedInUser.fund_or_user){
          $("#home").attr("href", '/funds/' + loggedInUser.id );
          $(".settings").attr("href", '/funds/settings/' +loggedInUser.id);
          $(".logout").attr("href", 'funds/logout');
        }
        else{
          $("#home").attr("href", '/users/' + loggedInUser.id);
          $(".settings").attr("href", '/users/settings/' +loggedInUser.id );
          $(".logout").attr("href", 'users/logout/' + loggedInUser.id);
        }
      }
      else{
        $('.post-signin').css("display","none");
      }
    },
		applicationDisplay: function(){
			console.log(applications);
			if(applications.length > 0){
				$('#not-applied').css("display", "none");
				$("#applied-funds").show();
				for(var i = 0; i < applications.length; i++){
					$("#applied-funds").append("<tr class='fund-entry'><td class = fund-name>" + applications[i].title + "</td><td class= 'fund-status'>" + applications[i].status + "</td><td class= 'fund-amount'> - </td></tr>");
				}

			}
			else{
				$("#applied-funds").hide();
				$('#not-applied').css("display", "inline");
			}
		}
	});

	var userInfo = new UserInfo();
})
