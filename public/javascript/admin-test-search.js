$(document).ready(function(){
  $(document).on('click', '#submit-data', function(){

  })
  $('#submit-data').click(function(e){
    e.preventDefault();

    console.log($(this).siblings('.result').children('.result-fund').text());
    console.log($(this).parent().find('input[name=relevant]').prop('checked'));
    var parent = $(this).parent();
    var relevant = $(this).parent().find('input[name=relevant]').prop('checked');
    var notRelevant = $(this).parent().find('input[name=not-relevant]').prop('checked');
    var query = $(this).parent().parent().prev('tr').children('th');
    var index = query.attr('class');
    console.log("QUERY", query);
    console.log(index);
    var jsonText = JSON.parse($(this).siblings('.result').children('.result-fund').text());
    if( (relevant && !notRelevant ) || ( !relevant && notRelevant ) ){
      jsonText.relevance = relevant;
      jsonText.query = query;
      jsonText.index = index;
      console.log(jsonText);
      $.post('/admin/update-relevance', jsonText, function(){
      });
    }
  });
});
