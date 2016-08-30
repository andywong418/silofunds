$(document).ready(function(){
  $('.radio input').click(function(){
    var appId = $(this).attr('class');
    console.log(appId);
    if($('#app-success' + appId).is(':checked')){
      $('.amount-update' + appId).show();
      $('.hide-update' + appId).hide();
    }
    else{
      $('.amount-update' + appId).hide();
      $('.hide-update' + appId).show();
    }

  });
$('.confirm-app').click(function(){
  var appId = $(this).attr('id');
  if($('input.' + appId + ':checked').val() == 'success'){
    var formData = {
      status: 'success',
      amount_gained: $('.amount-gained' + appId).val(),
      fund_approved: true
    };
    $.post('/organisation/edit-application/' + appId, formData, function(data){
      //Change status of existing application
      $('#status' + appId).html("success");
    });

  }
  if($('input.' + appId + ':checked').val() == 'unsuccessful'){
    var hide_or_not = $('.hide' + appId ).is(":checked");
    var formData = {
      status: 'unsuccessful',
      fund_approved: false
    };
    $.post('/organisation/edit-application/' + appId, formData, function(data){
      //Change status of existing application
      $('#status' + appId).html("unsuccessful");
    });
  }
});
});
