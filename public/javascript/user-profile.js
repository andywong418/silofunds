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
			var advanced = true;
			var advanced_2 = true;
			$("#advanced-search").toggle(false);
			$("#advanced-search-2").toggle(false);
			$("#grants").click(function(){
      		$("#advanced-age").attr("value", age);
      		$("#advanced-search").toggle(true);
      		$("#advanced-search-2").toggle(false);
      		$("#grants span").css("display","inline");
      		$("#users span").css("display","none");
      		$("#text_search").attr("name", "fund_tags");
      		advanced = false;
      		return true;
      	});
			
			$("#users").click(function(){
				$("#advanced-age-2").attr("value", age);
  
      		$("#advanced-search-2").toggle(true);
      		$("#advanced-search").toggle(false);
      		$("#users span").css("display","inline");
      		$("#grants span").css("display","none");
      		$("#text_search").attr("name", "user_tags")
      		advanced_2 = false; 
			});
			$(document).click(function(e) {
		    if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null) {	       
		        $("#advanced-search").toggle(false);      	
		      	
		    }
		    else{
		      		return true;
		      	}

		    if ( $(e.target).closest('#advanced-search-2').length == 0 && e.target.closest('#users') === null) {
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
			}
		},
		newUser: function(){
			var allowed = false;
			$(".get-started").click(function(){
				if(newUser){
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
				
				if(newUser){
					var counter = 0;
					var down = {};
				  $(document).keydown(function(e){
				    	var key = (e.keyCode ? e.keyCode : e.which);
				    	if(key == '13' && allowed){		
				    			if(down['13'] == null){	  
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
						    			counter = 0;
						    		}
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
			$("input[id='work-file']").change(function(e){				
				var file = this.files[0];
				var data = new FormData();
				data.append('file', file);
				data.append('user', user.id);
				$.ajax({
				  type: "POST",
				  url: '/user-edit/add-work',
				  data: data,
				  processData: false,
					contentType: false,
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
			var existingDescription = false;
			var savedDescription = '';
			var textareaAdded = false;
			$(".add").click(function(){
					console.log(existingDescription);
						if(existingDescription == false){
						var seekId = $(this).attr("id");
						var idArray = seekId.split("n");
						var id = idArray[idArray.length-1];
						console.log("This it", $("#add-work-description" + id).next());
						if($("#add-work-description" + id).next().length == 0){
							$("#add-work-description" + id).first().after("<textarea placeholder = 'Add a description for this piece of work. Press enter to save it.' class = 'edit-work' id = 'edit-work" + id + "'></textarea>");
							$("textarea").not("#edit-work"+id).remove();	
							return true;
						}
						else{
							return false;
						}
					}

					else{
						console.log("WHAT DID IT SAVE", savedDescription);
						var seekId = $(".work-description").attr("id");
						var idArray = seekId.split("n");
						var id = idArray[idArray.length-1];
						$(".work-description").replaceWith("<textarea class = 'edit-work' id = 'edit-work" + id + "'>" + savedDescription + "</textarea>");
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
							existingDescription = true;
							savedDescription = data;
						})
					}
				});			

				$(document).click(function(e) {
		    if ( $(e.target).closest('textarea').length == 0 && e.target.closest('.add') === null) {	       
		        $("textarea").toggle(false);      	
		      	
		    }
		    else{
		      		return true;
		      	}
				});	
		},
		deleteWork: function(){
			$(".delete").click(function(){
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
		}
	});

	var userInfo = new UserInfo();
})
