$(document).ready(function(){
  $('.option').hover(function(){
    var id = $(this).attr('id');
    $('#' + id).find('.option-description').css('display','inline');
    $('#' + id).find('.option-description').css('color','white');
    $('#' + id).find('.funding-img').css('visibility','hidden');
    $('#' + id).find('.create').css('display','inline');
  },function(){
    var id = $(this).attr('id');
    $('#' + id).find('.option-description').css('display','none');
    $('#' + id).find('.funding-img').css('visibility', 'visible');
    $('#' + id).find('.create').css('display','none');
  });

  $('.create').hover(function(){
    var id = $(this).find('a').attr('id');
    $('#' + id).css('color', '#5c6d7e')
  },function(){
    var id = $(this).find('a').attr('id');
    $('#' + id).css('color', 'white')
  })

  $("a.btn-secondary.create").click(function(e) {
    mixpanel.track("[/organisation/funding_creation] Create funding option");
  });
});
