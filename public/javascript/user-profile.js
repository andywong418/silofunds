$(document).ready(function(){

//setting up page view
console.log(user);
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
			console.log(age);
			console.log(newUser);
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
			var advanced = false;
			$("#advanced-search").toggle(advanced);

			$("#search-dropdown").click(function(e){
      		e.preventDefault();
      		$("#advanced-age").attr("value", age);
      		if(advanced == false){
      			advanced = true;
      		}
      		else{
      			advanced = false;
      		}
      		$("#advanced-search").toggle(advanced);
      	});
			this.workDisplay();
		},
		workDisplay: function(){
			var pastWork = user.past_work;
			for( var i = 0; i < pastWork.length; i++){
				var seekingExtension = pastWork[i].split(".");
				var extension = seekingExtension[3];
				console.log(extension);
				var seekingFilename = pastWork[i].split("/");
				var filename = seekingFilename[4];
				console.log(filename);
				if(extension == "pdf"){
					$("#work-display").append("<span><i class = 'fa fa-file-pdf-o pdf-file' ><a href = '" + pastWork[i] + "'>"+ filename + "</a></i></span>");
				}
				else if(extension == "jpg" || extension == "png"){
					$("#work-display").append("<span><i class = 'fa fa-file-photo-o photo-file'><a href = '" + pastWork[i] + "'>" + filename + "</a</i></span>");
				}

				else if (extension == "xls" || extension == "xlsx"){
					$("#work-display").append("<span><i class = 'fa fa-file-excel-o excel-file'><a href = '" + pastWork[i] + "'>" + filename + "</a></i></span>");
				}

				else if (extension == "ppt" || extension == "pptx"){
					$("#work-display").append("<span><i class = 'fa fa-file-powerpoint-o powerpoint-file<a href = '" + pastWork[i] + "'>"+ filename + "</a></i></span>");
				}

				else if(extension == "mp4" || extension == "avi" || extension == "mkv"){
					$("#work-display").append("<span><i class = 'fa fa-file-video-o video-file'><a href = '" + pastWork[i] + "'>" + filename + "</a></i></span>");
				}

				else if (extension == "doc" || extension == "docx"){
					$("#work-display").append("<span><i class = 'fa fa-file-word-o word-file'><a href = '" + pastWork[i] + "'>"+ filename + "</a></i></span>");
				}
				else{
					$("#work-display").append("<span><i class = 'fa fa-file filename'><a href = '" + pastWork[i] + "'>"+  filename + "</a> </span>");
				}
			}
		},
		newUser: function(){

		}

	})

	var userInfo = new UserInfo();

})
