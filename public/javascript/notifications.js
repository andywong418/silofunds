$(document).ready(function(){
  //Notofication display
  var NotificationModel = Backbone.Model.extend({

  });

  var NotificationCollection = Backbone.Collection.extend({
    model: NotificationModel
  });
  var NotificationView = Backbone.View.extend({
    tagName: 'div',
    id: 'notification-handler',
    template: _.template($('#notification-template').html()),
    events: {
      'click .notification-row': 'clickNotification'
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this; // enable chained calls
    },
    initialize: function(){
      this.el = this.render().el;
      if(this.model.get('read_by_user') === true){
        this.$el.css('background', 'white');
      }
    },
    clickNotification: function(e){
      var formData = {
        read_by_user: true
      };
      $.post('/notifications/readNotification/' + e.currentTarget.id, formData, function(data){

        $('#' + e.currentTarget.id).parent('#notification-handler').css('background', 'white');
        if($('#' + e.currentTarget.id).find('a').length > 0){
          window.location = $('#' + e.currentTarget.id).find('a').attr('href');
        }
      });

    }
  });
  var NotificationList = Backbone.View.extend({
    el: '.notification-wrapper',
    render: function(){
      this.collection.each(function(notification){
        if(notification.attributes.category == 'donation'){
          notification.attributes.category = 'fa-money';
        }
        if(notification.attributes.category == 'deadline'){
          notification.attributes.category = 'fa-calendar';
        }
        if(notification.attributes.category == 'application'){
          notification.attributes.category = 'fa-sticky-note';
        }
        if(notification.attributes.category == 'favourite'){
          notification.attributes.category = 'fa-star';
        }
        var notificationView = new NotificationView({model: notification});
        this.$el.append(notificationView.el);
      }, this);
      return this;
    }
  });
  //get new notifications
  var notificationArray;
  var displayNotif = false;
  $(document).on('click', '#home', function(e){
    console.log(displayNotif);
    if(displayNotif === false){
      e.preventDefault();
      $('.notification_box').show();
      $('#notification-count').hide();
      displayNotif = true;
    }
    else{
        $('.notification_box').hide();
        displayNotif = false;
    }
  });

  $(document).click(function(e){
    if($(e.target).attr('class') != 'fa fa-user' && $(e.target).attr('id') !='notification-handler' && $(e.target).id != 'home'){
      $('.notification_box').hide();
    }
  });

  $.get('/notifications/favourites', function(data){
    $.get('/notifications/new', function(data){
      console.log(data);
      if(data.length > 0){
        windowPortWidth = $(window).width();
        var notificationCollection;
        if(windowPortWidth < 767){
          if(data.length > 5){
            notificationCollection = new NotificationCollection(data.slice(0,4));
          }
          else{
            notificationCollection = new NotificationCollection(data);
          }
        }
        else{
           notificationCollection = new NotificationCollection(data);
        }

        console.log(notificationCollection);
        var notificationList = new NotificationList({collection: notificationCollection});
        $(".notification-wrapper").append(notificationList.render().el);
        var unReadNotifications = [];
        data.forEach(function(obj, index, array){
          if(obj.read_by_user === false){
            unReadNotifications.push(obj);
          }
        });
        console.log(unReadNotifications);
        if(unReadNotifications.length > 0){
          $("#notification-count").show();

          $("#notification-count").html(unReadNotifications.length);
        }
      }
      else{
        $('#no-notification').show();
      }


    });
  });
  //get new messages
  $.get('/messages/new/new-messages', function(data){
    if(data.new_messages){
      $('span#new-message').html(data.new_messages);
      $('span#new-message').show();
    }

  });
  $('#user-message').click(function(){
    $('span#new-message').hide();
  });

});
