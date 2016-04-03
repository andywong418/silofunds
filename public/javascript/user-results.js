$(document).ready(function(){

  var bool = false;
  console.log(userData);
  for(var field in query){
    $('.' + field).attr('value', query[field]);
    // if(field == 'merit_or_finance'){
    //     $('#' + query[field]).attr("checked", "true");
    // }
    // if(field == 'gender'){
    //   $('#' + query[field]).attr("checked", "true");
    // }
  }
  var advanced = true;
  var advanced_2 = true;

  function split( val ) {
      return val.split(" ");
  };
  $("#grants").click(function(){
      $("#advanced-search").slideDown();
      $("#advanced-search-2").toggle(false);
      $("#grants span").css("display","inline");
      $("#users span").css("display","none");
      advanced = false;
      $("#search-form").attr('action', '/results');
      $("#text_search").attr('placeholder', 'Keywords - Subject, University, Degree level');
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
      return true;
    });
  $(document).on('click', '#refine-search', function(){

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
        source: "../autocomplete/users",
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
  $(document).click(function(e) {
    if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null && e.target.closest('#refine-search') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
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
  var UserNav = Backbone.View.extend({
          el: ".nav li",

          initialize: function(){
            if(user){
              $('.pre-signin').css("display", "none");
              $('.post-signin').css("display","inline");
              $('.post-signin').css("z-index", "11");
              if(user.fund_or_user){
                $("#home").attr("href", '/funds/' + user.id );
                $(".settings").attr("href", '/funds/settings/' +user.id);
                $(".logout").attr("href", 'funds/logout');
              }
              else{
                $("#home").attr("href", '/users/' + user.id);
                $(".settings").attr("href", '/users/settings/' +user.id );
                $(".logout").attr("href", 'users/logout/' + user.id);
              }
            }
            else{
              $('.post-signin').css("display","none");
            }
          // $('.pre-signin').css("display","none");
        }

    });
   var userNav = new UserNav();
   for (var i = 0; i < userData.length; i++) {
     var UserModel = Backbone.Model.extend({
       defaults: {
         username: '',
         user_age: 0,
         user_nationality: '',
         user_religion: '',
         user_id: 0
       }
     });

     var UserView = Backbone.View.extend({
       tagname: 'div',

       template: _.template($('#user-template').html()),

       render: function() {
         this.$el.html(this.template(this.model.toJSON()));
         return this; // enable chained calls
       }
     });

     var UserList = Backbone.View.extend({
       el:".page-header",

       initialize: function(){
         this.userDisplay();
       },

       userDisplay: function(){
         var myDate = userData[i].date_of_birth.split("-");
         var yearFix= myDate[2].split("T");
         var day = yearFix[0];
         var newDate = myDate[1]+"/"+day+"/"+ myDate[0];
         var birthDate = new Date(newDate).getTime();
         var nowDate = new Date().getTime();
         var age = Math.floor((nowDate - birthDate) / 31536000000 );

         var user = new UserModel({
           username: userData[i].username,
           profile_picture: userData[i].profile_picture,
           user_age: age,
           user_nationality: userData[i].nationality,
           user_religion: userData[i].religion,
           user_id: userData[i].id
         });

         var view = new UserView({ model: user });
         var religion = userData[i].religion;
         var id = userData[i].id;
         console.log("religion", religion);
         this.$el.append(view.render().el);
         // Do the date

           for (j = 0; j < religion.length; j++){
             console.log("religion every j", religion[j])
             if (religion[j] != 'null'){
             $('.user-religion' + id).append("<span class = control>" + religion[j] + "</span>" )
             }
             else{
               $('.user-religion' + id).css('display', 'none')
             }
           }

       }
    });
    var userList = new UserList();
  }
})
