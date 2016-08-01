$(document).ready(function(){
  var UserNav = Backbone.View.extend({
    el: ".nav li",

    initialize: function(){
      if (user) {
        $('.pre-signin').css("display", "none");
        $('.post-signin').css("display","inline");
        $('.post-signin').css("z-index", "11");
        if (user.organisation_or_user) {
          $("#home").attr("href", '/organisation');
          $(".settings").attr("href", '/organisation/settings');
          $(".logout").attr("href", 'organisation/logout');
        } else {
          $("#home").attr("href", '/user');
          $(".settings").attr("href", '/user/settings');
          $(".logout").attr("href", 'user/logout');
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
      initialize: function() {
        var emptyUserDataArr = userData.length === 0;

        if (!emptyUserDataArr) {
          this.userDisplay();
        }
      },
      userDisplay: function() {
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

        this.$el.append(view.render().el);
        // Do the date

        for (j = 0; j < religion.length; j++) {
          if (religion[j] != 'null') {
            $('.user-religion' + id).append("<span class = control>" + religion[j] + "</span>" );
          } else {
            $('.user-religion' + id).css('display', 'none');
          }
        }
      }
    });

    var userList = new UserList();
  }
});
