$(document).ready(function(){
		var SettingsModel = Backbone.Model.extend({

		});
	var SettingsView = Backbone.View.extend({
		id: 'fund-settings',
		template: _.template($('#settings-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
    }
	});


	var SettingsInfo = Backbone.View.extend({
		el: 'body',
		initialize: function(){
			var deadline;
			if(fund.start_date){
				var startArray = fund.start_date.split("T");
				var start_date = startArray[0];
				var deadlineArray = fund.deadline.split("T");
				deadline = deadlineArray[0];
			}

			var settings_model = new SettingsModel({
				name: fund.username,
				description: fund.description,
				nationality: fund.countries,
				minAge: fund.minimum_age,
				maxAge: fund.maximum_age,
				minAmount: fund.minimum_amount,
				maxAmount: fund.maximum_amount,
				nationality: fund.countries,
				religion: fund.religion,
				charityNumber: fund.charity_number,
				gender: fund.gender,
				merit_or_finance: fund.merit_or_finance,
				startDate: start_date,
				deadline: deadline
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
			if(fund.email_updates == true){
				$("#email_updates").prop("checked", true);
			}
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
			  if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
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
			var seekid = id.split("-");
			var element = seekid[0];
			Logger.info(element);
			var value = $("#" + id + " #grey").html();
			Logger.info(value);
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
      Logger.info(id);
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
			Logger.info("WHAT?")
			$("#email_updates").change(function(){
				if(!this.checked){
					var parameters = {email_updates: false};
					$.post('/user/email-settings/'+ fund.id, parameters, function(data){
						Logger.info(data);
					})
				}
				else{
					var parameters = {email_updates: true};
					$.post('/user/email-settings/'+ fund.id, parameters, function(data){
						Logger.info(data);
					})
				}
			})
		}
	})
		var settingsInfo = new SettingsInfo()
})
