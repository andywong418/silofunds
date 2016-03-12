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

			if(user.email_updates == true){
				$("#email_updates").prop("checked", true);
			}
			var advanced = true;
			var advanced_2 = true;
			$("#advanced-search").toggle(false);
			$("#advanced-search-2").toggle(false);
			$("#grants, #refine-search").click(function(){
			    $("#advanced-search").slideDown();
			    $("#advanced-search-2").toggle(false);
			    $("#grants span").css("display","inline");
			    $("#users span").css("display","none");
			    advanced = false;
			    return true;
			  });

			$("#users").click(function(){
			    $("#advanced-search-2").toggle(true);
			    $("#advanced-search").toggle(false);
			    $("#users span").css("display","inline");
			    $("#grants span").css("display","none");
			    advanced_2 = false;
			});

			$(document).click(function(e) {
			  if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#refine-search') === null && e.target.closest('#grants') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
			      $("#advanced-search").toggle(false);

			  }
			  else{
			        return true;
			      }

			  if ( $(e.target).closest('#advanced-search-2').length == 0 && e.target.closest('#users' && e.target.closest('#search_button') === null) && e.target.closest('#text_search') === null) {
			    $("#advanced-search-2").toggle(false);
			  }
			  else{
			        return true;
			  }
			});
			this.editAccount();
			this.editEmailSettings();
		},

		editAccount: function(){

		if(general== false){
			$('.general').css("display", "none");
			$('.profile-edit').css("display", "inline");
			$('#general-settings').css("color", "grey");
			$('#account').css("color", "black")
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
				$("#" + id + " #grey").replaceWith("<textarea class= 'change-input' form = 'change-settings' id = 'input" + element+ "' name = 'description'>" + value + "</textarea>");
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
		},
		editEmailSettings: function(){
			$("#email_updates").change(function(){
				if(!this.checked){
					var parameters = {email_updates: false};
					$.post('/users/email-settings/'+ user.id, parameters, function(data){
						console.log(data);
					})
				}
				else{
					var parameters = {email_updates: true};
					$.post('/users/email-settings/'+ user.id, parameters, function(data){
						console.log(data);
					})
				}
			})
		}

	})

	var settingsInfo = new SettingsInfo();

})
