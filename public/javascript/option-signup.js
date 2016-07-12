$(document).ready(function(){

  function noFundcreated(){
    $(document).on('click','#general', function(){
      console.log("/funds/funding_creation/" + user.id + "/" + support_type);
       window.location = "/funds/funding_creation/" + user.id + "/" + support_type;
    });
    $(document).on('click', '#eligible', function(){
      window.location = "/funds/funding_creation/" + user.id + "/" + support_type + '#eligible';
    })
    $(document).on('click', '#application', function(){
      window.location = "/funds/funding_creation/" + user.id + "/" + support_type + '#application';
    });
  }

  function fundCreated(id){
    $(document).on('click','#general', function(){
      window.location = "/funds/funding_creation/" + user.id + "/" + support_type + '/' + id;
   });
    $(document).on('click', '#eligible', function(){
     window.location = "/funds/funding_creation/" + user.id + "/" + support_type + '/' + id + "#eligible";
   });
    $(document).on('click', '#application', function(){
      window.location = "/funds/funding_creation/" + user.id + "/" + support_type + '/' + id +'#application';
    });


  }

  // have to use global variable
  var OptionModel = Backbone.Model.extend({
    urlRoot: '/funds/option_creation/'
  })
  var GeneralView = Backbone.View.extend({
		id: 'general-form',
		template: _.template($('#general-template').html()),
		render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
	});

  var GeneralDisplay = Backbone.View.extend({
    tagName: 'div',
    id: 'general-handler',
    events:{
      'click #save': 'saveGeneral'
    },
    initialize: function(){
      console.log("WHY NOT HERE");
      var generalModel = this.model;
      var view = new GeneralView({model: generalModel});
      this.$el.append(view.render().el);
      $('.selected').removeClass('selected');
      $('#general').addClass('selected')
      if(this.model.get('id')){
        console.log(this.model.get('id'));
        var id = this.model.get('id');
        fundCreated(id);
        if(this.model.get('title')){
          var name = this.model.get('title');
          this.$('#fund-name').val(name);
        }
        if(this.model.get('description')){
          var description = this.model.get('description');
          this.$('#bio-area').val(description);
        }
        if(this.model.get('minimum_amount')){
          var min_amount = this.model.get('minimum_amount');
          this.$('#min-amount').val(min_amount);
        }
        if(this.model.get('maximum_amount')){
          var max_amount = this.model.get('maximum_amount');
          this.$('#max-amount').val(max_amount);
        }
        if(this.model.get('duration_of_scholarship')){
          var duration = this.model.get('duration_of_scholarship');
          this.$('#duration').val(duration);
        }
        if(this.model.get('number_of_places')){
          var places = this.model.get('number_of_places');
          this.$('#place').val(places);
        }
        if(this.model.get('tags')){
          var tags = this.model.get('tags');
          this.$('#tags').val(tags);
        }

      }
      else{
        noFundcreated();
      }
    },
    saveGeneral: function(e){
      e.preventDefault();
      var tags = $('#tags').val().split(',');
      var formData = {
        'title': $('input[name=title]').val(),
        'description': $('textarea[name=description]').val(),
        'minimum_amount': $('input[name=minimum_amount]').val(),
        'maximum_amount': $('input[name=maximum_amount]').val(),
        'duration_of_scholarship': $('input[name=duration_of_scholarship]').val(),
        'number_of_places': $('input[name=number_of_places]').val(),
        'support_type': support_type,
        'tags': tags
      }
      if(!fund){
        $.post('/funds/funding_creation/'+ user.id + '/' + support_type + '/save_general', formData, function(data){
          console.log(data);
          fund = data;
          window.location = "/funds/funding_creation/" + user.id + "/" + support_type + '/' + fund.id +'#eligible';
        })
      }
      else{
        $.post('/funds/funding_creation/'+ user.id + '/' + support_type + '/save_general/' + fund.id, formData, function(data){
          fund = data;
          window.location = "/funds/funding_creation/" + user.id + "/" + support_type + '/' + fund.id +'#eligible';
        })
      }

    }

  })




var EligibleView = Backbone.View.extend({
  id: 'eligible-form',
  template: _.template($('#eligible-template').html()),
  render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this; // enable chained calls
    }

})


var EligibleDisplay = Backbone.View.extend({
  tagName: 'div',
  id: 'eligible-handler',
  events: {
    'click .eligible-container': 'showCriteriaSelection',
    'click .criteria-item': 'showItem',
    'click #save': 'saveEligible'
  },
  initialize: function(){
    console.log("HELLO BUD");
    var eligibleModel = new OptionModel();
    var view = new EligibleView({model: eligibleModel});
    this.$el.append(view.render().el);
    $('.selected').removeClass('selected');
    $('#eligible').addClass('selected');
    //support type switch
    switch(support_type){
      case 'scholarship':
        this.$("#merit-input").prop("checked", true);
        break;
      case 'bursary':
        this.$("#finance-input").prop("checked", true);
    }
    if(this.model.get('id')){
      console.log(this.model.get('id'));
      var id = this.model.get('id');
      fundCreated(id);
      console.log(this.model);
    }
    else{
      noFundcreated();
    }
  },
  showCriteriaSelection: function(){
    if($('.criteria-container').is(":visible")){
      $('.criteria-container, .criteria-form').css('display', 'none');

    }
    else{
      $('.criteria-container').css('display' ,'flex');
    }
  },
  showItem: function(e){
    if(!$('.criteria-form').is(":visible")){
      $('.criteria-form').show();
    }
    console.log($(e.currentTarget));
    var id = $(e.currentTarget).attr('id');
    $('.criteria-item').not('#' + id).removeClass('item-selected');
    $('#' + id).addClass('item-selected');
    $('.criteria-form form').not('#' + id + '-form').css('display', 'none');
    $('#' + id + '-form').show();

  },
  saveEligible: function(e){
    e.preventDefault();
    var subject = $('#subject-input').val().split(',');
    var religion = $('#religion-input').val().split(',');
    var targetUniversity = $('input[name=target_university]').val().split(',');
    var targetDegree = $('input[name=target_degree]').val().split(',');
    var requiredDegree = $('input[name=required_degree]').val().split(',');
    var requiredUniversity = $('input[name=required_university]').val().split(',');
    var targetCountry = $('input[name=target_country]').val().split(',');
    var country_of_residence = $('input[name=country_of_residence]').val().split(',');
    var specific_location = $('input[name=specific_location]').val().split(',');

    var formData = {
      'subject': subject,
      'minimum_age': $('input[name=minimum_age]').val(),
      'maximum_age': $('input[name=maximum_age]').val(),
      'gender': $('input[name=gender]').val(),
      'merit_or_finance': $('input[name=merit_or_finance]').val(),
      'religion': religion,
      'target_university': targetUniversity,
      'target_degree': targetDegree,
      'required_degree': requiredDegree,
      'required_university': requiredUniversity,
      'required_grade': $('input[name=required_grade]').val(),
      'target_country': targetCountry,
      'country_of_residence': country_of_residence,
      'specific_location': specific_location
    }
    if(!fund){
      $.post()
    }
  }
})
var ApplicationView = Backbone.View.extend({
    id: 'application-form',
    template: _.template($('#application-template').html()),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
})

var ApplicationDisplay = Backbone.View.extend({
  tagName: 'div',
  id: 'application-handler',
  initialize: function(){
    var applicationModel = new OptionModel();
    var view = new ApplicationView({model: applicationModel});
    this.$el.append(view.render().el);
    $('.selected').removeClass('selected');
    $('#application').addClass('selected')
  }
})
// router config
var Router = Backbone.Router.extend({
  routes:{
    "": "general",
    "general": "general",
    "eligible": "eligible",
    "application": "application"
  },
  general: function(){
    var router = this;
    var generalModel = new OptionModel();
    if(fund){
      generalModel = new OptionModel({id: fund.id});
      generalModel.fetch({
        success:function(){
          console.log("GENERAL SUCCESS");
          router.loadView(new GeneralDisplay({model: generalModel}));
        }
      });
    }
    else{
      router.loadView(new GeneralDisplay({model: generalModel}));
    }
  },
  eligible: function(){
    var router = this;
    var eligibleModel = new OptionModel();
    if(fund){
      console.log(fund.id);
      var eligibleModel = new OptionModel({id: fund.id});
      eligibleModel.fetch({
        success:function(){
          console.log('ELIGIBLE SUCCESS');
          router.loadView(new EligibleDisplay({model: eligibleModel}));
        }
      });
    }
    else{
      router.loadView(new EligibleDisplay({model: eligibleModel}));
    }

  },
  application: function(){
    var router = this;
    var applicationeModel = new OptionModel();
    if(fund){
      console.log(fund.id);
      var applicationModel = new OptionModel({id: fund.id});
      applicationModel.fetch({
        success:function(){
          router.loadView(new ApplicationDisplay({model: applicationModel}));
        }
      });
    }
    else{
      router.loadView(new ApplicationDisplay({model: applicationModel}));
    }

  },
  loadView : function(viewing) {
	  if(this.view){
      this.view.stopListening();
      this.view.off();
      this.view.remove();
    }
		this.view = viewing;
		$('.template-container').append(viewing.el);
	}
})
var router = new Router();
Backbone.history.start();

})
