$(document).ready(function(){
  $(document).on('click', '.submit-data', function(e){
    e.preventDefault();

    var parent = $(this).parent().parent();
    console.log(parent);
    var relevant = $(this).parent().find('input[name=relevant]').prop('checked');
    var notRelevant = $(this).parent().find('input[name=not-relevant]').prop('checked');
    var query = $(this).parent().find('#hidden-query').text();
    console.log("QUERY", query);
    var jsonText = JSON.parse($(this).siblings('.result').children('.result-fund').text());
    if( (relevant && !notRelevant ) || ( !relevant && notRelevant ) ){
      jsonText.relevance = relevant;
      jsonText.query = query;
      console.log(jsonText);

      $.post('/admin/update-relevance', jsonText, function(){
        parent.hide();
      });
    }
  });

});
