$(document).ready(function(){
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
      this.$('#story').find('*').css('font-size', '16px');
      this.$('#story').find('p').css('font-size', '15px')
    }
  })
  var Router = Backbone.Router.extend({
    routes:{
      "": "story",
      "story": "story"
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
