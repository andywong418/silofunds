$(document).ready(function(){
	var SettingsModel = Backbone.Model.extend({
			defaults: {
				name: "",
				age: 0,
				description: "",
				nationality: "",
				religion: "",
				funding_needed: 0
			}

		});
	var SettingsView = Backbone.View.extend({
		id: 'user-setup',
		template: _.template($('#settings-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
    }
	});


	var SettingsInfo = Backbone.View.extend({
		el: 'body',
		initialize: function(){
			var myDate = user.date_of_birth.split("-");
			var yearFix= myDate[2].split("T");
			var day = yearFix[0];
			var newDate = myDate[1]+"/"+day+"/"+ myDate[0];
			var birthDate = new Date(newDate).getTime();
			var nowDate = new Date().getTime();
			var age = Math.floor((nowDate - birthDate) / 31536000000 );
			var settings_model = new SettingsModel({
				name: user.username,
				age: age,
				description: user.description,
				nationality: user.nationality,
				funding_needed: user.funding_needed,
				religion: user.religion
			});
			var view = new SettingsView({model: settings_model});
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
			})
			this.editAccount();
			this.redirectHome();
		},

		editAccount: function(){
		console.log("COLONEL",general);
		if(general== false){
			$('.general').css("display", "none");
			$('.profile-edit').css("display", "inline");
			$('#general-settings').css("color", "black");
			$('#account').css("color", "grey")
		}
		

			(function( $ ){
   $.fn.displaySave = function() {
      var id = $(this).attr("id");
      console.log(id);
			var seekid = id.split("-");
			var element = seekid[0];
			console.log(element);
			var value = $("#" + id + " #grey").html();
			console.log(value);
			if(element == "description"){
				$("#" + id + " #grey").replaceWith("<textarea class= 'change-input' form = 'change-settings' id = 'input" + element+ "' name = 'description' placeholder = '"+ value + "'></textarea>");
				$("#save-" + element).css("display","inline");
				$(".save").not("#save-" + element).css("display", "none");
			}
			else{
			$("#" + id + " #grey").replaceWith("<input type = 'text' class= 'change-input' id = 'input" +element+ "' name = '"+ element +"' value = '"+ value + "'> </input>");
			$("#save-" + element).css("display","inline");
		  $(".save").not("#save-" + element).css("display", "none");
			}
			return this;
   		}; 
		})( jQuery );

		(function( $ ){
   $.fn.saveInfo= function() {
      var id = $(this).attr("id");
      console.log(id);
			var seekid = id.split("-");
			var element = seekid[1];
			return this;
   		}; 
		})( jQuery );

			$(".row").click(function(){
				$(this).displaySave();
			});

			$(".save").click(function(){
				$(this).saveInfo();
			})

				$("#account").click(function(){
				$('.general').css("display", "none");
				$('.profile-edit').css("display", "inline");
				$('#general-settings').css("color", "grey");
			$('#account').css("color", "black")
			})

			$("#general-settings").click(function(){
				$('.general').css("display", "inline");
				$('.profile-edit').css("display", "none");
				$('#general-settings').css("color", "black");
				$('#account').css("color", "grey")
			})
		}

	})

	var settingsInfo = new SettingsInfo();

})