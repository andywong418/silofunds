$(document).ready(function() {
  $('.menu-item').click(function(){
    $('.active-item').removeClass('active-item');
    $(this).find('p').addClass('active-item');
  });
  $('.fa-check-circle').tooltip();
  if(user.funding_accrued){
    var amount = user.funding_accrued;
    var goal = user.funding_needed;
    var percentage = Math.ceil((amount/ goal) * 100);
    $('div#initial-bar').css('width',  percentage + '%');
    $('#percentage').html(percentage+ '% <span> funded </span>');
  }
  if(user.completion_date){
    var oneDay = 24*60*60*1000;
    var completionDate = new Date(user.completion_date.split('T')[0]);
    var nowDate = Date.now();
    var diffDays = Math.round(Math.abs((completionDate.getTime() - nowDate)/(oneDay)));
    $('#remaining-days').html(diffDays + '<span> days to go </span>');
  }
  else{
      $('#remaining-days').html('60 <span> days to go </span>');
  }
  var UserModel = Backbone.Model.extend({
    url: '/signup/user_signup/' + user.id,
  });
  var DocumentModel = Backbone.Model.extend();
  var DocumentView = Backbone.View.extend({
    tagName:'div',
    id:'document-handler',
    template: _.template($('#document-template').html()),
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this; // enable chained calls
    }
  });
  var StoryView = Backbone.View.extend({
    tagName: 'div',
    id: 'story-handler',
    template: _.template($('#story-template').html()),
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this
    },
    initialize: function(){
      var storyModel = this.model;
      this.el = this.render().el;
      var story = this.model.get('description');
      this.$('#story').html(story);
      this.$('#story').css('margin-top', '20px');
      this.$('#story').find('*').css('font-size', '16px');
      this.$('#story').find('*').css('color', '#4b4f56');
      this.$('#story').find('p').css('font-size', '15px')
      var documents = this.model.get('documents');
      for(var i =0; i< documents.length; i++){
        var doc = documents[i];
        var id = doc.id;
        var link = doc.link;
        var file = doc.title;
        var description = doc.description;
        var extension;
        if(file){
          var seekingExtension = file.split(".");
          extension = seekingExtension[1];
        }

        var fileClass;
        if(extension == "pdf"){
          fileClass = "fa fa-file-pdf-o pdf-file"
        }
        else if(extension == "jpg" || extension == "png"){
          fileClass = "fa fa-file-photo-o photo-file"
        }

        else if (extension == "xls" || extension == "xlsx"){
          fileClass = "fa fa-file-excel-o excel-file"
        }

        else if (extension == "ppt" || extension == "pptx"){
          fileClass = "fa fa-file-powerpoint-o powerpoint-file"
        }

        else if(extension == "mp4" || extension == "avi" || extension == "mkv"){
          fileClass = 'fa fa-file-video-o video-file'
        }

        else if (extension == "doc" || extension == "docx"){
          fileClass = "fa fa-file-word-o word-file"
        }
        else if(extension== "m" || extension == "html" || extension == "js" || extension == "py" || extension== 'c' || extension == 'cpp'){
          fileClass = "fa fa-file-code-o code-file";
        }
        else{
          fileClass = "fa fa-file filename";
        }

        var documentModel = new DocumentModel({
          fileClass: fileClass,
          fileLink: link,
          fileName: file,
          fileDescription: description
        });
        var docView = new DocumentView({model: documentModel});
        this.$('.document-row').append(docView.render().el);


      }
    }
  });

  var AboutView = Backbone.View.extend({
    tagName: 'div',
    id: 'about-handler',
    template: _.template($('#about-template').html()),
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    initialize: function(){
      var aboutModel = this.model;
      this.el = this.render().el;
      var age;
      if(user.date_of_birth){
        var myDate = user.date_of_birth.split("-");
        var yearFix= myDate[2].split("T");
        var day = yearFix[0];
        var newDate = myDate[1]+"/"+day+"/"+ myDate[0];
        var birthDate = new Date(newDate).getTime();
        var nowDate = new Date().getTime();
        var age = Math.floor((nowDate - birthDate) / 31536000000 );
        this.$('#age').html(age);
      }


    }
  });

  var UpdateView = Backbone.View.extend({
    tagName: 'div',
    id: 'update-handler',
    template: _.template($('#update-template').html()),
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    initialize: function(){
      this.el = this.render().el;
      var createdAt = reformatDate(this.model.get('created_at'));
      if(createdAt){
        this.$('#created-at').html(createdAt);
      }
    }
  });
  var CommentView = Backbone.View.extend({
    tagName: 'div',
    id: 'comment-handler',
    template: _.template($('#comment-template').html()),
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    initialize: function(){
      this.el = this.render().el;
    }
  })
  var Router = Backbone.Router.extend({
    routes:{
      "": "story",
      "story": "story",
      "about": "about",
      "updates": "updates",
      "comments": "comments"
    },
    story: function(){
      var router = this;
      var storyModel = new UserModel();
      storyModel.fetch({
        success: function(){
          router.loadView(new StoryView({model: storyModel}));
        }
      })
    },
    about: function(){
      var router = this;
      var aboutModel = new UserModel();
      aboutModel.fetch({
        success: function(){
          router.loadView(new AboutView({model: aboutModel}));
        }
      })
    },
    updates: function(){
      var router = this;
      var updateModel = new UserModel();
      updateModel.fetch({
        success: function(){
          router.loadView(new UpdateView({model: updateModel}));
        }
      });
    },
    comments: function(){
      var router = this;
      var commentModel = new UserModel();
      commentModel.fetch({
        success: function(){
          router.loadView(new CommentView({model: commentModel}));
        }
      });
    },
    loadView: function(viewing){
      if(this.view){
        this.view.stopListening();
        this.view.off();
        this.view.unbind();
        this.view.remove();
      }
      this.view = viewing;
      $('.tab-content-mobile, .tab-content-desktop').append(viewing.el);
    }
  })
  var router = new Router();
  Backbone.history.start();
  var counter = 0;
  $(document).on('click', '#start-donate', function(){
    $('#donate').click();
    $('html,body').animate({
        scrollTop: $("#progress-card").offset().top},
        'slow');
  });
  $(document).on('click', '#donate', function(e){
    e.preventDefault();
    if(counter == 0){
      counter++;
      $('#donate').css('font-size', '14px');
      $('.donate-row').css('display', 'flex');
      $('#donate').css('float', 'right');
      $('#progress-card').css('padding-bottom', '60px');
      $('#contact-user').hide();
      $('#donate').animate({width: "30%", float:'right'}, 500, "easeOutQuad",function(){
        $('#donate').html('Donate');
        $('#progress-card').css('padding-bottom', '0px');
        $('#progress-card').css('display','inline-block' );
        $('#amount').css('display', 'inline-table');
        $('#amount').animate({opacity: 1}, {duration: 500, queue: false});
        $('div#donate-amount').removeClass('hidden');
        $('div#donate-amount').animate({ opacity: 1}, {duration: 300, easing: "easeInExpo", queue: false});
      });
    }
    else{
      var amount = $('input#donate-amount').val();
      var applicationFee = Math.ceil(amount * 0.029 + 0.2);
      var donorIsPaying = $('#donorpays').hasClass('active');
      var handlerDisplayOptions = {
        name: 'Silo',
        description: '2 widgets',
        currency: "gbp",
        panelLabel: "Donate",
        amount: amount
      };

      if (donorIsPaying) {
        handlerDisplayOptions.amount = (parseInt(amount) + applicationFee) * 100;
      } else {
        handlerDisplayOptions.amount = amount * 100;
      }

      handler.open(handlerDisplayOptions);


    }

  });
  // $('#donate').click(function(e) {
  //
  //
  // });

  $('input#donate-amount').on('keyup', function(e){
    displayApplicationFeeHelperText();

  });

  $('#donorpays').click(function() {
    $('#donorpays').addClass('active');
    $('#recipientpays').removeClass('active');

    displayApplicationFeeHelperText();
  });

  $('#recipientpays').click(function() {
    $('#recipientpays').addClass('active');
    $('#donorpays').removeClass('active');

    displayApplicationFeeHelperText();
  });


  // Stripe

  var handler = StripeCheckout.configure({
      key: 'pk_live_zSAA5TcxiGNl3Cdw88TDAqnE',
      billingAddress: true,
      zipCode: true,
      image: '/images/silo-transparent-square.png',
      locale: 'auto',
      token: function(token) {
        var amount = $('input#donate-amount').val();
        var applicationFee = Math.ceil(amount * 0.029 + 0.2);
        var recipientUserID = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
        var data = {};
        var donorIsPaying = $('#donorpays').hasClass('active');
          var comment = $('textarea#comment-text').val();
          var isAnon = $('#is-anon').prop("checked");
        var amountAdjusted;

        if (donorIsPaying) {
          amountAdjusted = (parseInt(amount) + applicationFee) * 100;
          data.amount = amountAdjusted;
          data.donorIsPaying = true;
        } else {
          data.amount = amount * 100;
          data.donorIsPaying = false;
        }

        data.applicationFee = applicationFee * 100;
        data.tokenID = token.id;
        data.email = token.email;
        data.recipientUserID = recipientUserID;
        data.comment = comment;
        if(isAnon){
          data.is_anon = true;
        }

        $.ajax({
          type: "POST",
          url: '/user/charge',
          data: data
        }).done(function(data) {
          //calculate width of bar and supporters and bar
          displayCompletionMessage(data);
        });
      }
    });

    $('.submit').on('click', function(e) {
      // Open Checkout with further options:

    });

    // Close Checkout on page navigation:
    $(window).on('popstate', function() {
      handler.close();
    });
    //social media share
    window.fbAsyncInit = function() {
      FB.init({
          appId      : '506830149486287',
          xfbml      : true,
          status: true,
          cookie: true,
          version    : 'v2.5',
          display: 'popup'
      });
    };

    $('.fb-share').click(function(){
      var firstName = user.username.split(' ')[0];
      var gender = user.gender;
      var pronoun;
      if(gender == 'male'){
        pronoun = 'He'
      }
      if(gender == 'female'){
        pronoun = 'She'
      }
      FB.ui({
      method: 'share',
      href: 'https://www.silofunds.com/public/' + user.id ,
      picture: user.profile_picture,
      description: firstName + ' needs your help! ' + pronoun + ' is raising money to study ' + user.subject + '. Your support will make a difference.',
      link: 'https://www.silofunds.com/public/' + user.id
    }, function(response){

    });
    })


  // Twitter popup buttons
    $('a.twitter-tweet').click(function(e){
      var offset = (screen.width/2) - Math.ceil(575/2);
      var username = user.username.split(' ')[0];
      var subject = user.subject;
      var gender = user.gender;
      var pronoun;
      if(gender == 'male'){
        pronoun = 'He';
      }
      if(gender == 'female'){
        pronoun = 'She';
      }
      if(user.subject){
        var newWindow=window.open("https://twitter.com/intent/tweet?text=" + username + "+needs+your+help!+" +pronoun+ "+is+raising+money+to+study+" + subject +"%2E+Your+support+will+make+a+difference&url=https%3a%2f%2fsilofunds.com%2Fpublic%2f" + user.id, 'name','height=503, width=575, top = 200, left=' + offset);

      }
      else{
                var newWindow=window.open("https://twitter.com/intent/tweet?text=" + username + "+needs+your+help!+They+are+raising+money+for+their+studies%2E+Your+support+will+make+a+difference&url=http:%3A%2F%2Fsilofunds.com%2Fpublic%2f" + user.id, 'name','height=503, width=575, top = 200, left=' + offset);

      }
    });

  // Helper functions

  function displayApplicationFeeHelperText() {
    var userInput = $('input#donate-amount').val();
    var applicationFee = Math.ceil(userInput * 0.029 + 0.2);
    var firstProgressBar = $('#initial-bar');
    var amountAdded = parseInt(userInput);
    var newAmount = amountAdded + user.funding_accrued;
    var percentage = Math.ceil((newAmount/user.funding_needed) * 100);
    var addedPercentage = Math.ceil((amountAdded/user.funding_needed) * 100)
    if(userInput !== '') {
      if ($('#donorpays').hasClass('active')) {
        $('#process-fee').html('£' + applicationFee + ' will be added to your payment.');
      } else {
        $('#process-fee').html('The recipient will receive £' + applicationFee + ' less.');
        newAmount = newAmount - applicationFee;
        percentage = Math.ceil((newAmount/user.funding_needed) * 100);
        amountAdded = amountAdded = applicationFee;
        addedPercentage = Math.ceil((amountAdded/user.funding_needed) * 100);
      }
      $('#percentage').html(percentage+ '% <span> funded </span>');
      $('#another-one').css('background-color', '#ffca4b');
      $('#another-one').addClass('progress-bar-striped active');
      if(percentage + addedPercentage > 100){
        var maxPercentage = 99 - Math.floor((user.funding_accrued/ user.funding_needed) * 100);
        $('#another-one').animate({width: maxPercentage + '%'});
      }
      else{
        $('#another-one').animate({width: addedPercentage + '%'});
      }
      $('#raised').html('£' + newAmount + "<span> of " + user.funding_needed + " reached");
      $('#raised').css('color', 'rgb(85, 230, 165)');
    } else {
      $('#process-fee').empty();
      var amount = user.funding_accrued;
      var goal = user.funding_needed;
      percentage = Math.ceil((amount/ goal) * 100);
      $('#another-one').css('width', percentage + '%');
      $('#another-one').css('background-color', '#4FDA9B');
      $('#another-one').removeClass('progress-bar-striped active');
      $('#raised').html('£' + user.funding_accrued + "<span> of " + user.funding_needed + " reached");
      $('#raised').css('color', '#333333');
    }
  }

  var reformatDate = function(date) {
    if(date){
      date = date.split('T')[0];
      date = new Date(date);
      return date.toDateString();
    }

  };
  function displayCompletionMessage(data) {
    $('#payment-div').append('Thank you, your payment has been processed');
    $('#payment-div').removeClass('hidden');
    $('#payment-div').animate({'left': '85%'}, 'slow');
    $('#payment-div-invisible').click(function() {
      $('#payment-div').fadeOut('slow');
    });
    $('#payment-div').delay(3000).fadeOut('slow');
    location.reload();
  }

  // Stuff for mobile
  $('.video-div, .video-div').html(user.video);
  $('.video-div iframe').addClass('iframe');

  initialWidth = $('.iframe').width();
  initialHeight = $('.iframe').height();
  videoRatio = initialWidth / initialHeight;

  tabContentMobileAdd();
  iframeResize();
  $(window).resize(function() {
    tabContentMobileAdd();
    iframeResize();
    reloads();
  });
});

// Functions
var initialWidth;
var initialHeight;
var videoRatio;

function tabContentMobileAdd() {
  if($(window).width() <= 767) {
    $('#story-about-updates-targeting-div-desktop #tab-content').removeClass('tab-content-desktop')
    $('#story-about-updates-targeting-div-mobile #tab-content').addClass('tab-content-mobile')
  } else {
    $('#story-about-updates-targeting-div-mobile #tab-content').removeClass('tab-content-mobile')
    $('#story-about-updates-targeting-div-desktop #tab-content').addClass('tab-content-desktop')
  }
}

function reloads() {
  if($(window).width() == 767 || $(window).width() == 768) {
    location.reload()
  }
}

function iframeResize() {
  if($(window).width() <= 670) {
    $('.video-div.mobile').css('margin-left', '0px')
    $('.video-div.mobile').css('margin-top', '-6px')
    $('#user-progress').css('padding-left', '0px')
    $('#user-progress').css('padding-right', '0px')
    $('#user-progress').css('margin-top', '-5px')
    var newWidth = $(window).width()
    var widthChange = initialWidth - newWidth
    var newHeight = initialHeight - widthChange/videoRatio
    $('.iframe').css('width', newWidth);
    $('.iframe').css('height', newHeight);
  } else if($(window).width() > 671 &&  $(window).width() <= 767) {
    var marginLeft = ($(window).width() - $('.iframe').width())/2
    $('.iframe').css('width', '671px')
    $('.iframe').css('height', 671/videoRatio)
    $('.video-div.mobile').css('margin-left', marginLeft)
    $('.video-div.mobile').css('margin-top', marginLeft/5)
    $('.video-div.mobile').css('margin-bottom', marginLeft/5)
    $('#user-progress').css('padding-left', (marginLeft)/8)
    $('#user-progress').css('padding-right', (marginLeft)/8)
    $('#user-progress').css('margin-top', (marginLeft)/10)
  } else if($(window).width() > 767) {
    $('.iframe').css('width', '100%')
    $('#user-progress').css('padding-left', '') // Reset to defaults
    $('#user-progress').css('padding-right', '')
    $('#user-progress').css('margin-top', '')
    var width = $('.video-div.desktop').width() - 30
    $('.iframe').css('height', width/videoRatio)
  }
}
