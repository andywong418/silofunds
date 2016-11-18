$(document).ready(function(){
  //queryOptions for search
  if(typeof query != 'undefined' && query){
    for(var field in query){
      $('.' + field).attr('value', query[field]);
      if(field == 'merit_or_finance'){
          $('#' + query[field]).attr("checked", "true");
      }
      if(field == 'gender'){
        $('#' + query[field]).attr("checked", "true");
      }
    }
  }
  $('span#tokenKey i').click(function(){
    var field = $(this).parent('#tokenKey').attr('class');
    if(field == 'tags'){
      $('input#text_search').val('');
    }
    $(this).closest('#tokenKey').fadeOut();
    $('input#advanced_user_' +field).val('');
  });

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
      id: 'user-handler',
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
        var header;
        var age;
        if(userData[i].date_of_birth){
          var myDate = userData[i].date_of_birth.split("-");
          var yearFix= myDate[2].split("T");
          var day = yearFix[0];
          var newDate = myDate[1]+"/"+day+"/"+ myDate[0];
          var birthDate = new Date(newDate).getTime();
          var nowDate = new Date().getTime();
          age = Math.floor((nowDate - birthDate) / 31536000000 );
          header = userData[i].username + ', ' + age;
        }
        else{
          header = userData[i].username;
        }

        var profile_picture;
        if(userData[i].profile_picture){
          profile_picture = userData[i].profile_picture;
        }
        else{
          profile_picture = '/images/profile-placeholder.jpg';
        }
        var user = new UserModel({
          username: header,
          profile_picture: profile_picture,
          subject: userData[i].subject,
          user_nationality: userData[i].country_of_residence,
          target_country: userData[i].target_country,
          previous_university: userData[i].previous_university,
          target_university: userData[i].target_university,
          user_religion: userData[i].religion,
          user_id: userData[i].id,
          user_email: userData[i].email
        });
        console.log(userData[i]);
        var view = new UserView({ model: user });
        var religion = userData[i].religion;
        var id = userData[i].id;
        this.$el.append(view.render().el);
        if(userData[i].country_of_residence === null){
          $('p.user-nationality' + id).hide();
        }
        if(userData[i].religion === null){
          $('p.user-religion' + id).hide();
        }
        var arrayFields= ['subject', 'target_country', 'previous_university', 'target_university'];
        for(var j = 0; j < arrayFields.length; j++){
          if(userData[i][arrayFields[j]] === null || userData[i][arrayFields[j]] ===undefined  ){
            $('p.' + arrayFields[j] + ''+ id).hide();
          }
        }
        // Do the date
        if(religion){
          $('.user-religion' + id).append("<span class = control style='margin-left: 0; margin-top: -5px'>" + religion + "</span>" );
        }
        else{
          $('.user-religion' + id).css('display', 'none');
        }

      }
    });

    var userList = new UserList();
  }
  //mixpanel checking actions prior to signin
  var mixpanelClickCheck = [];
  $(document).click(function(e){
    console.log(e);
    console.log(e.target);
    mixpanelClickCheck.push(e.target.outerHTML);
    if($(e.target).attr('id') == 'signup-button'){
      //track array and page
      mixpanel.track(
        "Pre Signup Action",
        {"page": "user results", "actions": mixpanelClickCheck}
      );
    }
    // if(e.target !=)
  });
  var windowPortWidth =$(window).width();
  if(windowPortWidth < 545){
    $('.page-header.desktop').hide();
    $('.page-header.mobile').show();
    $('div[id="user-handler"]').hide();
    var lastElementIndex = $('.main-mobile-row').length -1;
    console.log($('.main-mobile-row')[lastElementIndex]);
    $($('.main-mobile-row')[lastElementIndex]).css('border-bottom', 'none');
  }
  $(window).resize(function(){
    var windowPortWidth =$(window).width();
    if(windowPortWidth < 545){
      $('.page-header.desktop').hide();
      $('.page-header.mobile').show();
      $('div[id="user-handler"]').hide();
      var lastElementIndex = $('.main-mobile-row').length -1;
      $($('.main-mobile-row')[lastElementIndex]).css('border-bottom', 'none');
    }
    if(windowPortWidth > 545){
      $('.page-header.desktop').show();
      $('.page-header.mobile').hide();
      $('div[id="user-handler"]').show();
    }
  });
});
