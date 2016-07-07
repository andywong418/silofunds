$(document).ready(function(){
  var bool = false;

  // for retaining advs form fields
  for(var field in query){
    $('.' + field).attr('value', query[field]);
    if(field == 'merit_or_finance'){
        $('#' + query[field]).attr("checked", "true");
    }
    if(field == 'gender'){
      $('#' + query[field]).attr("checked", "true");
    }
  }

  function split( val ) {
      return val.split(" ");
  }

  $("a.category").click(function(event) {
    var currentTarget = event.target;

    if (currentTarget.id === "category-funding") {
      $("button#category").html("Funding <span class='caret'></span>");
      $("form.search_form .input-group-btn").removeClass("open");
      $("#advanced-search .tab-pane#advs-user, #advanced-search li#search-for-users").removeClass("active");
      $("#advanced-search .tab-pane#advs-user").removeClass("in");
      $("#advanced-search .tab-pane#advs-funding, #advanced-search li#search-for-funding").addClass("active");
      $("#advanced-search .tab-pane#advs-funding").addClass("in");
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
    } else {
      $("button#category").html("Users <span class='caret'></span>");
      $("form.search_form .input-group-btn").removeClass("open");
      $("#advanced-search .tab-pane#advs-user, #advanced-search li#search-for-users").addClass("active");
      $("#advanced-search .tab-pane#advs-user").addClass("in");
      $("#advanced-search .tab-pane#advs-funding, #advanced-search li#search-for-funding").removeClass("active");
      $("#advanced-search .tab-pane#advs-funding").removeClass("in");
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
    }

    return false;
  });

  $('a#advs-link').click(function(){
    $("#advanced-search").slideDown();
    advanced = false;
    return false;
  });

  // remove parameter from query string if value === ''
  $("form#advs-funding-form").submit(function(event) {
    event.preventDefault();
    var currentTarget = event.target;
    var emptyInputFields = 0;
    var searchFormInputs = $("input[form='advs-funding-form']");

    for (var i = 0; i < searchFormInputs.length; i++) {
      var id = searchFormInputs[i].id;
      var input = $("#" + id);
      var isRadioButton = input[0].type === "radio";
      var isRadioButtonUnchecked = input.prop("checked") !== true;

      if(input.val() === "" || (isRadioButton && isRadioButtonUnchecked)) {
        $("#" + id).attr("name", "");

        emptyInputFields++;
      }
    }

    if (emptyInputFields === searchFormInputs.length) {
      console.log("appended");
      $("form#advs-funding-form").append("<input id='all', type='hidden', name='all', value='true', style='opacity:0; position:absolute; left:9999px;', form='advs-funding-form'>");
    }

    currentTarget.submit();
  });

  $(document).click(function(e) {
    var clickOnAdvsForm = $(e.target).closest('#advanced-search').length === 0;
    var clickOnAdvsLink = e.target.closest('#advs-link') === null;
    var clickOnSearchFormSubmit = e.target.closest('#search_button') === null;

    if ( clickOnAdvsForm && clickOnAdvsLink && clickOnSearchFormSubmit) {
      $("#advanced-search").toggle(false);
    }
    else{
      return true;
    }
  });
});
