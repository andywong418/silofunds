$(document).ready(function(){
  $('#explore, #start-browsing').click(function(){
    $('html, body').animate({scrollTop:0}, 'slow');
    $('#text_search').focus();
  })

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
});
