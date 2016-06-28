$(document).ready(function(){
  var bool = false;


  for(var field in query){
    $('.' + field).attr('value', query[field]);
    if(field == 'merit_or_finance'){
        $('#' + query[field]).attr("checked", "true");
    }
    if(field == 'gender'){
      $('#' + query[field]).attr("checked", "true");
    }
  }
  var advanced = true;
  var advanced_2 = true;
  function split( val ) {
      return val.split(" ");
  };
  $("#grants").click(function(){
      $("#advanced-search").slideDown();
      $("#advanced-search-2").toggle(false);
      $("#grants span").css("display","inline");
      $("#users span").css("display","none");
      advanced = false;
      $("#search-form").attr('action', '/results');
      $("#text_search").attr('placeholder', 'Keywords - Subject, University, Degree level');
      $("input#text_search" ).autocomplete({
        source: "../autocomplete",
        minLength: 1,
        select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end
          terms.push( "" );
          this.value = terms.join(" ");
          return false;
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        }
      });

      return true;
    });
  $(document).on('click', '#refine-search', function(){

    $("#advanced-search").slideDown();
     advanced = false;
      return true;
  });

  $("#users").click(function(){
      $("#advanced-search-2").toggle(true);
      $("#advanced-search").toggle(false);
      $("#users span").css("display","inline");
      $("#grants span").css("display","none");
      advanced_2 = false;
      $("#search-form").attr('action', '/results/users');
      $("#text_search").attr('placeholder', 'Search for users by name or by interests');
      $("input#text_search" ).autocomplete({
        source: "../autocomplete/users",
        minLength: 1,
        select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end
          terms.push( "" );
          this.value = terms.join(" ");
          return false;
        },
        focus: function() {
          // prevent value inserted on focus
          return false;
        }
      });
  });
  $(document).click(function(e) {
    if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null && e.target.closest('#refine-search') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
        $("#advanced-search").toggle(false);

    }
    else{
          return true;
        }

    if ( $(e.target).closest('#advanced-search-2').length == 0 && e.target.closest('#users') === null && e.target.closest('#refine-search') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
      $("#advanced-search-2").toggle(false);
    }
    else{
          return true;
    }
  });



})
