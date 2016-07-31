$(document).ready(function(){
  $('#explore, #start-browsing').click(function(){
    $('html, body').animate({scrollTop:0}, 'slow');
    $('#text_search').focus();
  })
})
