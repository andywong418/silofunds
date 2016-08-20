$(document).ready(function(){

  var GenerosityModel = Backbone.Model.extend({

  });
  var GenerosityCollection = Backbone.Collection.extend({
    model: GenerosityModel
  });
  var GenerosityView = Backbone.View.extend({
    tagName: 'div',
    id: 'generosity-handler',
    template: _.template($('#generosity-template').html()),
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this; // enable chained calls
    },
    initialize: function(){
      this.el = this.render().el;
    }
  });
  var GenerosityList = Backbone.View.extend({
    el: '.user-row',
    render: function(){
      this.collection.each(function(user){
        var generosityModel = new GenerosityModel({
          "imgSrc": user.attributes.profile_picture,
          "username": user.attributes.username,
          "funding_progress": (user.attributes.funding_accrued/user.attributes.funding_needed) * 100
        });
        console.log(generosityModel);
        var generosityView = new GenerosityView({model: generosityModel});
        this.$el.append(generosityView.el);
      }, this);
      return this;
    }
  });
  $.get('/user/generosity', function(data){
    console.log(data);
    var generosityCollection = new GenerosityCollection(data);
    var generosityList = new GenerosityList({collection: generosityCollection});
    $('.user-row').append(generosityList.render().el);
  });

  $('#explore, #start-browsing').click(function(){
    $('html, body').animate({scrollTop:0}, 'slow');
    $('#text_search').focus();
  });

  $('.update').click(function(){
      console.log("WHAT");
      var formData = {
        "message": $('#update-text').val()
      };
      console.log($('#update-text').val());
      $.post('/user/create-update', formData, function(data){
        console.log(data);
        $('#save-update-notification').css('display', 'block');
        $("#save-update-notification").fadeOut(6000);
      });

  });
  $('.radio input').click(function(){
    var fundId = $(this).attr('class');
    console.log(fundId);
    if($('#app-success' + fundId).is(':checked')){
      $('.amount-update' + fundId).show();
      $('.hide-update' + fundId).hide();
    }
    else{
      $('.amount-update' + fundId).hide();
      $('.hide-update' + fundId).show();
    }

  });
  $('.modal').on('hidden.bs.modal', function(e)
{
    $(this).removeData();
}) ;
  $('.confirm-app').click(function(){
    var fundId = $(this).attr('id');
    console.log(fundId);
    if($('input.' + fundId + ':checked').val() == 'success'){
      console.log(fundId);
      var formData = {
        status: 'success',
        amount_gained: $('.amount-gained' + fundId).val()
      };
      console.log(formData);
      $.post('/user/edit-application/' + fundId, formData, function(data){
        //Change status of existing application
        $('#status' + fundId).html("success");
      });

    }
    if($('input.' + fundId + ':checked').val() == 'unsuccessful'){
      console.log("fundid", fundId);
      console.log($('.hide' + fundId ).is(":checked"));
      var hide_or_not = $('.hide' + fundId ).is(":checked");
      var formData = {
        status: 'unsuccessful',
        hide_from_profile: hide_or_not
      };
      $.post('/user/edit-application/' + fundId, formData, function(data){
        //Change status of existing application
        $('#status' + fundId).html("unsuccessful");
      });
    }
  });
});
