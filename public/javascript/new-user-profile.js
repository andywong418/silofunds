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


})