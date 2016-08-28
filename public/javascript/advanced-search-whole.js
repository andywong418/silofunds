$(document).ready(function(){
  $(document).on('click', 'li.active', function(){
    var pillId = $(this).attr('href');
    $('li.active').removeClass('active');
    $(this).addClass('active');
    $('#' +pillId).addClass('active');
  });
});
