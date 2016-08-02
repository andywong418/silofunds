$(document).ready(function(){
  $('.menu-item').click(function(){
    $('.active-item').removeClass('active-item');
    $(this).find('p').addClass('active-item');
  })
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

  $('#donate').click(function() {
    $('#donate').animate({ opacity: 0 }, 100, function() {
      $('#donate').addClass('hidden');

      $('#donate-amount').removeClass('hidden');
    });

    $('#donate-amount').animate({ opacity: 1}, 300, "easeInOutExpo", function() {

    });
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

    $('#donate-amount a').on('click', function(e) {
      // Open Checkout with further options:
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
    });

    // Close Checkout on page navigation:
    $(window).on('popstate', function() {
      handler.close();
    });

  // Helper functions

  function displayApplicationFeeHelperText() {
    var userInput = $('input#donate-amount').val();
    var applicationFee = Math.ceil(userInput * 0.029 + 0.2);

    if(userInput !== '') {
      if ($('#donorpays').hasClass('active')) {
        $('#process-fee').html('£' + applicationFee + ' will be added to your payment.');
      } else {
        $('#process-fee').html('The recipient will receive £' + applicationFee + ' less.');
      }
    } else {
      $('#process-fee').empty();
    }
  }
});
