$(document).ready(function(){
	console.log(fund);
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
			var startArray = fund.start_date.split("T");
			var start_date = startArray[0];
			var deadlineArray = fund.deadline.split("T");
			var deadline = deadlineArray[0];
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
			var advanced = true;
			var advanced_2 = true;
			$("#advanced-search").toggle(false);
			$("#advanced-search-2").toggle(false);
			$("#grants").click(function(){
      		$("#advanced-search").toggle(true);
      		$("#advanced-search-2").toggle(false);
      		$("#grants span").css("display","inline");
      		$("#users span").css("display","none");
      		$("#text_search").attr("name", "fund_tags");
      		advanced = false;
      		return true;
      	});


			$("#users").click(function(){
  
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
			this.clearRadio();
		},
		editAccount: function(){
		if(general== false){
			console.log("WHY YOU NO WORK");
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
  	clearRadio: function(){
  		$(document).on('click', '#clear1', function(){
  			$("#merit, #finance").prop("checked", false);
  			var parameters = {merit_or_finance: null};
  		});
  		$(document).on('click', '#clear2', function(){
  			$("#male, #female").prop("checked", false);
  			var parameters = {gender: null};
  
  		})
  	}

	})	
		var settingsInfo = new SettingsInfo()
})