$(document).ready(function(){
  //get new messages
  $.get('/messages/new/new-messages', function(data){
    if(data.new_messages){
      $('span#new-message').html(data.new_messages);
      $('span#new-message').show();
    }

  });
});
