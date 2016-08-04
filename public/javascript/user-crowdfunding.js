$(document).ready(function(){
  $('.menu-item').click(function(){
    $('.active-item').removeClass('active-item');
    $(this).find('p').addClass('active-item');
  });

  if(user.funding_accrued){
    var amount = user.funding_accrued;
    var goal = user.funding_needed
    var percentage = Math.ceil((amount/ goal) * 100);
    console.log($('#initial-bar'));
    $('div#initial-bar').css('width',  percentage + '%');
    $('#percentage').html(percentage+ '% <span> funded </span>');
  }
  if(user.completion_date){
    var oneDay = 24*60*60*1000;
    var completionDate = new Date(user.completion_date.split('T')[0]);
    var nowDate = Date.now();
    console.log("COMPLETION", completionDate);
    console.log("NOW DATE", nowDate);
    var diffDays = Math.round(Math.abs((completionDate.getTime() - nowDate)/(oneDay)));
    $('#remaining-days').html(diffDays + '<span> days to go </span>');
  }
  else{
      $('#remaining-days').html('60 <span> days to go </span>');
  }
  var UserModel = Backbone.Model.extend({
    url: '/signup/user_signup/' + user.id,
  })
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
      console.log(this.model);
      var story = this.model.get('description');
      this.$('#story').html(story);
      this.$('#story').css('margin-top', '20px');
      this.$('#story').find('*').css('font-size', '16px');
      this.$('#story').find('*').css('color', '#4b4f56');
      this.$('#story').find('p').css('font-size', '15px')
    }
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
  })
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
        console.log(user.date_of_birth);
        var myDate = user.date_of_birth.split("-");
        var yearFix= myDate[2].split("T");
        var day = yearFix[0];
        var newDate = myDate[1]+"/"+day+"/"+ myDate[0];
        var birthDate = new Date(newDate).getTime();
        var nowDate = new Date().getTime();
        var age = Math.floor((nowDate - birthDate) / 31536000000 );
        this.$('#age').html(age);
      }
      var documents = this.model.get('documents');
      console.log(documents);
      for(var i =0; i< documents.length; i++){
        var doc = documents[i];
        var id = doc.id;
        var link = doc.link;
        var file = doc.title;
        var extension;
        if(file){
          var seekingExtension = file.split(".");
          extension = seekingExtension[1];
        }

        console.log(extension);
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
          fileName: file
        });
        var docView = new DocumentView({model: documentModel});
        this.$('.document-row').append(docView.render().el);


      }

    }
  })
  var Router = Backbone.Router.extend({
    routes:{
      "": "story",
      "story": "story",
      "about": "about"
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
    loadView: function(viewing){
      if(this.view){
        this.view.stopListening();
        this.view.off();
        this.view.unbind();
        this.view.remove();
      }
      this.view = viewing;
      $('#tab-content').append(viewing.el);
    }
  })
  var router = new Router();
  Backbone.history.start();
  var counter = 0;
  $('#donate').click(function(e) {
    if(counter == 0){
      counter++;
      $('#donate').css('font-size', '14px');
      $('.donate-row').css('display', 'flex');
      $('#donate').css('float', 'right');
      $('#progress-card').css('padding-bottom', '60px');
      $('#donate').animate({width: "30%", float:'right'}, 500, "easeOutQuad",function(){
        $('#donate').html('Donate');
        $('#progress-card').css('padding-bottom', '25px');
        $('#amount').css('display', 'inline-table');
        $('#amount').animate({opacity: 1}, {duration: 500, queue: false});
        $('div#donate-amount').removeClass('hidden');
        $('div#donate-amount').animate({ opacity: 1}, {duration: 300, easing: "easeInExpo", queue: false});

      });
    }
    else{
      console.log("HI");
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
      e.preventDefault();
    }


  });

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
      key: 'pk_test_APDW1SKRsKrZAh5sf0q1ur8r',
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
        var amountAdjusted;

        if (donorIsPaying) {
          amountAdjusted = (parseInt(amount) + applicationFee) * 100;
          data.amount = amountAdjusted;
          console.log("DATA AMOUNT", data.amount );
          data.donorIsPaying = true;
        } else {
          data.amount = amount * 100;
          data.donorIsPaying = false;
        }

        data.applicationFee = applicationFee * 100;
        data.tokenID = token.id;
        data.email = token.email;
        data.recipientUserID = recipientUserID;

        $.ajax({
          type: "POST",
          url: '/user/charge',
          data: data
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
      console.log("WHAT", user);
      var firstName = user.username.split(' ')[0];
      FB.ui({
      method: 'share',
      href: 'https://www.silofunds.com/public/' + user.id ,
      picture: user.profile_picture,
      description: 'Help ' + firstName + ' reach his funding target!',
      link: 'https://www.silofunds.com/public/' + user.id
    }, function(response){

    });
    })


  // Twitter popup buttons
    $('a.twitter-tweet').click(function(e){
      var offset = (screen.width/2) - Math.ceil(575/2);
      console.log(offset);
      var newWindow=window.open("https://twitter.com/intent/tweet?text=hello+world&url=http:%3A%2F%2Fsilofunds.com%2Fpublic%2f" + user.id, 'name','height=503, width=575, top = 200, left=' + offset);
    });

  // Helper functions

  function displayApplicationFeeHelperText() {
    var userInput = $('input#donate-amount').val();
    var applicationFee = Math.ceil(userInput * 0.029 + 0.2);
    var firstProgressBar = $('#initial-bar');
    var amountAdded = parseInt(userInput);
    var newAmount = amountAdded + user.funding_accrued;
    console.log(newAmount);
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
});
