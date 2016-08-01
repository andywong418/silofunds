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



  // Stripe

  var handler = StripeCheckout.configure({
      key: 'pk_test_APDW1SKRsKrZAh5sf0q1ur8r',
      billingAddress: true,
      zipCode: true,
      image: '/images/silo-transparent-square.png',
      locale: 'auto',
      token: function(token) {

      }
    });

    $('#donate-amount a').on('click', function(e) {
      // Open Checkout with further options:
      var amount = $('input#donate-amount').val() * 100;

      handler.open({
        name: 'Silo',
        description: '2 widgets',
        currency: "gbp",
        panelLabel: "Donate",
        amount: amount
      });
      e.preventDefault();
    });

    // Close Checkout on page navigation:
    $(window).on('popstate', function() {
      handler.close();
    });
});
