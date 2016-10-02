$(document).ready(function(){
  $('#explore, #start-browsing').click(function(){
    $('html, body').animate({scrollTop:0}, 'slow');
    $('#text_search').focus();
  });

  $('.update').click(function(){
      var formData = {
        "message": $('#update-text').val()
      };
      $.post('/user/create-update', formData, function(data){
        $('#save-update-notification').css('display', 'block');
        $("#save-update-notification").fadeOut(6000);
      });

  });
  $('.radio input').click(function(){
    var fundId = $(this).attr('class');
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
    if($('input.' + fundId + ':checked').val() == 'success'){
      var formData = {
        status: 'success',
        amount_gained: $('.amount-gained' + fundId).val()
      };
      $.post('/user/edit-application/' + fundId, formData, function(data){
        //Change status of existing application
        $('#status' + fundId).html("success");
        $('.modal-backdrop').hide();
      });

    }
    if($('input.' + fundId + ':checked').val() == 'unsuccessful'){
      var hide_or_not = $('.hide' + fundId ).is(":checked");
      var formData = {
        status: 'unsuccessful',
        hide_from_profile: hide_or_not
      };
      $.post('/user/edit-application/' + fundId, formData, function(data){
        //Change status of existing application
        $('#status' + fundId).html("unsuccessful");
        $('.modal-backdrop').hide();
      });
    }
  });


});
