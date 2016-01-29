$(document).ready(function(){

//setting up page view

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
				console.log(e.target.closest('#grants'));
				console.log($(e.target).closest('#advanced-search').length);
		    if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null) {
		        // cancel highlighting 
		        console.log("Is it still getting in here?");
		       
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
			this.editProfile();
		},
		workDisplay: function(){
			var pastWork = user.past_work;
			for( var i = 0; i < pastWork.length; i++){
				var seekingExtension = pastWork[i].split(".");
				var extension = seekingExtension[seekingExtension.length-1];			
				var seekingFilename = pastWork[i].split("/");
				var filename = seekingFilename[seekingFilename.length-1];
				if(extension == "pdf"){
					$("#work-display").append("<span><i class = 'fa fa-file-pdf-o pdf-file' ><a href = '" + pastWork[i] + "'>"+ filename + "</a></i><i class = 'fa fa-times delete-work pdf'></i><i class = 'fa fa-plus-circle add-work-description pdf'></i><</span>");
				}
				else if(extension == "jpg" || extension == "png"){
					$("#work-display").append("<span><i class = 'fa fa-file-photo-o photo-file'><a href = '" + pastWork[i] + "'>" + filename + "</a></i><i class = 'fa fa-times delete-work photo'></i><i class = 'fa fa-plus-circle add-work-description photo'></i></span>");
				}

				else if (extension == "xls" || extension == "xlsx"){
					$("#work-display").append("<span><i class = 'fa fa-file-excel-o excel-file'><a href = '" + pastWork[i] + "'>" + filename + "</a></i><i class = 'fa fa-times delete-work excel'></i><i class = 'fa fa-plus-circle add-work-description excel'></i></span>");
				}

				else if (extension == "ppt" || extension == "pptx"){
					$("#work-display").append("<span><i class = 'fa fa-file-powerpoint-o powerpoint-file<a href = '" + pastWork[i] + "'>"+ filename + "</a></i><i class = 'fa fa-times delete-work powerpoint'></i><i class = 'fa fa-plus-circle add-work-description powerpoint'></i></span>");
				}

				else if(extension == "mp4" || extension == "avi" || extension == "mkv"){
					$("#work-display").append("<span><i class = 'fa fa-file-video-o video-file'><a href = '" + pastWork[i] + "'>" + filename + "</a></i><i class = 'fa fa-times delete-work video'></i><i class = 'fa fa-plus-circle add-work-description video'></i></span>");
				}

				else if (extension == "doc" || extension == "docx"){
					$("#work-display").append("<span><i class = 'fa fa-file-word-o word-file'><a href = '" + pastWork[i] + "'>"+ filename + "</a></i><i class = 'fa fa-times delete-work word'></i><i class = 'fa fa-plus-circle add-work-description word'></i></span>");
				}
				else{
					$("#work-display").append("<span><i class = 'fa fa-file filename'><a href = '" + pastWork[i] + "'>"+  filename + "</a></i><i class = 'fa fa-times delete-work other'></i><i class = 'fa fa-plus-circle add-work-description other'></i></span>");
				}
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
			});
				
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
						
			  });
			$(document).keyup(function(event) {
		     var keycode = (event.keyCode ? event.keyCode : event.which);
		     down[keycode] = null;
			});
		},
		editProfile: function(){
			$("input[id='work-file']").change(function(e){
				var file = this.value;
				var array = this.value.split("\\");
				var filename = array[array.length-1];
				console.log(filename);
				var extensionArray = filename.split(".");
				var extension = extensionArray[extensionArray.length -1];
				console.log(extension);
				var parameter = {work_file: file };
				$.post('/add-work', parameter, function(data){
					
				}) 
			
			})
		}

	})

	var userInfo = new UserInfo();

})
