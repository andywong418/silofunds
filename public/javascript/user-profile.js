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
			$("#grants").click(function(){
			    $("#advanced-search").slideDown();
			    $("#advanced-search-2").toggle(false);
			    $("#grants span").css("display","inline");
			    $("#users span").css("display","none");
			    advanced = false;
			    $("#search-form").attr('action', '/results');
			    $("#text_search").attr('placeholder', 'Keywords - Subject, University, Degree level');
			    $("input#text_search" ).autocomplete({
			      source: "/autocomplete",
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
			    return true;
			  });
			$(document).on('click', '#advs-link', function(){

			  $("#advanced-search").slideDown();
			   advanced = false;
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
			    $("input#text_search" ).autocomplete({
			      source: "/autocomplete/users",
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
			this.workDisplay();
			this.newUser();
			this.addWork();
			this.addDescription();
			this.deleteWork();
			this.changePicture();
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
					$("#work-display").append("<span><i class = 'fa fa-file-pdf-o pdf-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
				}
				else if(extension == "jpg" || extension == "png"){
					$("#work-display").append("<span><i class = 'fa fa-file-photo-o photo-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
				}

				else if (extension == "xls" || extension == "xlsx"){
					$("#work-display").append("<span><i class = 'fa fa-file-excel-o excel-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
				}

				else if (extension == "ppt" || extension == "pptx"){
					$("#work-display").append("<span><i class = 'fa fa-file-powerpoint-o powerpoint-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
				}

				else if(extension == "mp4" || extension == "avi" || extension == "mkv"){
					$("#work-display").append("<span><i class = 'fa fa-file-video-o video-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
				}

				else if (extension == "doc" || extension == "docx"){
					$("#work-display").append("<span><i class = 'fa fa-file-word-o word-file " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
				}
				else{
					$("#work-display").append("<span><i class = 'fa fa-file filename " + id + "' ><a href = '" + document + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
				}
				$('.delete').attr("title", "Delete this piece of work from profile");
				$('.add').attr("title", "Add/edit the description for this piece of work");
				if(documents[i].description){
					$("#add-work-description" + id).after("<p id = 'work-description" + id + "' class = 'work-description'>" + documents[i].description + "</p> ")
				}
			}
		},
		newUser: function(){
			var allowed = false;
			var newTutorial = newUser;
			$(".get-started").click(function(){
				console.log(newTutorial);
				if(newTutorial){
					$("#user-modal").css("display", "inline");
					$('html, body').animate({
    		    scrollTop: 0
			    }, 2000);
			    $("#instruction-footer").css("display", "inline");
			    $(".instruction-pointer").css("display","inline")
			    allowed = true;
				}
				else{
					$('html, body').animate({
    		    scrollTop: 0
			    }, 2000);
			    $("#text_search").focus();
				}
			});

				if(newTutorial){
					var counter = 0;
					var down = {};
				  $(document).keypress(function(e){
				    	var key = (e.keyCode ? e.keyCode : e.which);
				    	if(key == '13' && allowed){
				    				e.preventDefault();
				    				if(counter == 0){

							    		$(".instruction-pointer").css("display","none");
							    		$(".instruction-pointer-2").css("display","inline");
							    		counter++;
							    		return;
						    		}
						    		if(counter == 1){
						    			$(".instruction-pointer-2").css("display", "none");
						    			$("#instruction-footer").css("display","none");
						    			$("#user-modal").css("display","none");
						    			$("#text_search").focus();
						    			counter++;
						    			newTutorial = false;
						    			allowed = false;
						    			return
						    		}

				    	}

				  })
			};
			$(document).keyup(function(event) {
		     var keycode = (event.keyCode ? event.keyCode : event.which);
		     down[keycode] = null;
			});
		},
		addWork: function(){
			$('#add-work label, #add-work i').hover(function(){
				$('#add-work').css('border', '3px #19B5FE dashed');
				$('#add-work').css('color', '#19B5FE');
			}, function(){
				$('#add-work').css('border', '3px #337ab7 dashed');
				$('#add-work').css('color', '#337ab7');
			});
			$('#add-work i').click(function(){
				$("input[id='work-file']").click();
			});
			$("input[id='work-file']").change(function(e){
				var file = this.files[0];
				var data = new FormData();
				data.append('file', file);
				data.append('user', user.id);
				console.log(file);
				$.ajax({
				  type: "POST",
				  url: '/user-edit/add-work',
				  data: data,
				  processData: false,
					contentType: false
				}).done(function(data) {
					if(data){
						console.log(data);
						var file = data.link;
						var seekingExtension = file.split(".");
						var extension = seekingExtension[seekingExtension.length-1];
						var seekingFilename = file.split("/");
						var filename = seekingFilename[seekingFilename.length-1];
						var id = data.id;
						console.log(extension);
						if(extension == "pdf"){
							$("#work-display").prepend("<span><i class = 'fa fa-file-pdf-o pdf-file " + id + "' ><a href = '" + file + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id = 'add-work-description" + id + "'></i></span>");
						}
						else if(extension == "jpg" || extension == "png"){
							$("#work-display").prepend("<span><i class = 'fa fa-file-photo-o photo-file " + id + "' ><a href = '" + file + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
						}

						else if (extension == "xls" || extension == "xlsx"){
						$("#work-display").prepend("<span><i class = 'fa fa-file-excel-o excel-file " + id + "' ><a href = '" + file + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
						}

						else if (extension == "ppt" || extension == "pptx"){
							$("#work-display").prepend("<span><i class = 'fa fa-file-powerpoint-o powerpoint-file " + id + "' ><a href = '" + file + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
						}

						else if(extension == "mp4" || extension == "avi" || extension == "mkv"){
							$("#work-display").prepend("<span><i class = 'fa fa-file-video-o video-file " + id + "' ><a href = '" + file + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
						}

						else if (extension == "doc" || extension == "docx"){
							$("#work-display").prepend("<span><i class = 'fa fa-file-word-o word-file " + id + "' ><a href = '" + file + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
						}
						else{
							$("#work-display").prepend("<span><i class = 'fa fa-file filename " + id + "' ><a href = '" + file + "'>"+ filename + "</a></i><i class = 'fa fa-times delete' id= 'delete-work" + id + "'></i><i class = 'fa fa-plus-circle add' id= 'add-work-description" + id + "'></i></span>");
						}
						$('.delete').attr("title", "Delete this piece of work from profile");
						$('.add').attr("title", "Add/edit the description for this piece of work");
					}
				});
			});

		},
		addDescription: function(){

			var savedDescription = '';
			var textareaAdded = false;
			var user;
			$(document).on('click', '.add', function(){
						var seekId = $(this).attr("id");
						var idArray = seekId.split("n");
						var id = idArray[idArray.length-1];
						if($("#add-work-description" + id).next().length == 0){
							$("#add-work-description" + id).after("<textarea placeholder = 'Add a description for this piece of work. Press enter to save it.' class = 'edit-work' id = 'edit-work" + id + "'></textarea>");
							if($("#add-work-description" + user).next().length == 0){
								$("textarea").not("#edit-work"+id).remove();
							}
							else{
								$("#edit-work" + id).replaceWith("<p id = 'work-description" + user + "' class = 'work-description'>" + savedDescription + "</p> ");
								$("textarea").not("#edit-work"+id).remove();
							}
							return true;
						}
						else{
							console.log($('.edit-work'));
							var description = $("#work-description" + id).html();
							if($('.edit-work').attr('id')){
								var saveTextDescription = $('.edit-work').html();
								var saveTextIdArray = $('.edit-work').attr('id').split('k');
								var saveTextId = saveTextIdArray[1];
								$("#edit-work" + saveTextId).replaceWith("<p id = 'work-description" + saveTextId + "' class = 'work-description'>" + saveTextDescription + "</p> ");
							};
							$("#work-description" + id).replaceWith("<textarea class = 'edit-work' id = 'edit-work" + id + "'>" + description + "</textarea>");
							user = id;
							savedDescription = description;
						}

				});

				$(document).on('keypress',".edit-work", function(event){
					var html = $(".edit-work");
					if(event.which == 13 || event.keyCode == 13){
						var description = $(this).val();
						var seekId1 = html.attr("id");
						console.log(seekId1);
						var idArray1 = seekId1.split("k");
						var id1 = idArray1[idArray1.length-1];
						console.log(id1);
						var parameters = {description: description, user: id1};
						$.post('/user-edit/add-description', parameters, function(data){
							console.log("SUCCESS", data);
							$("textarea").replaceWith("<p id = 'work-description" + id1 + "' class = 'work-description'>" + data + "</p> ");
						})
					}
				});

				$(document).click(function(e) {

				if(!$.trim($(".edit-work").val())){
				    if ( $(e.target).closest('textarea').length == 0 && e.target.closest('.add') === null) {
				        $(".edit-work").remove();

				    }

				}
				else{
					if ( $(e.target).closest('textarea').length == 0 && e.target.closest('.add') === null) {
						var savedText = $(".edit-work").html();
						var idArray = $(".edit-work").attr('id').split('k');
						var id = idArray[1];
						console.log("ID", id);
						$("textarea").replaceWith("<p id = 'work-description" + id + "' class = 'work-description'>" + savedText + "</p> ");

					}


					}
				});
		},
		deleteWork: function(){
			$(document).on('click', '.delete', function(){
				var seekId = $(this).attr("id");
				var idArray = seekId.split("k");
				var id = idArray[idArray.length-1];
				console.log(id);
				$("#delete-work" + id).parent('span').remove();
				var parameters = {id: id};
				$.post('/user-edit/delete-work', parameters, function(data){
					console.log(data);
				})

			})
		},
		changePicture: function(){
				$("#profile-figure").hover(function(){
					$("#add-profile").css("display", "inline");
				}, function(){
					$("#add-profile").css("display", "none");
				});

				$("#add-profile").click(function() {
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
        			var file = this.files[0];
							var data = new FormData();
							data.append('profile_picture', file);
							data.append('user', user.id);
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
