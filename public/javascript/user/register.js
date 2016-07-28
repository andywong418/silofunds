$(document).ready(function(){
  $('#fund').hide()
  $('#fundCheckbox').click(function(){
    if($(this).is(':checked')) {
      $('#user').hide();
      $('#firstName').val('');
      $('#lastName').val('');
      $('#fund').show();
    } else {
      $('#user').show();
      $('#fundName').val('');
      $('#fund').hide();
    }
  })
});
