$(document).ready(function(){
  // for retaining advs form fields
  for( var field in query) {
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

  setCategoryButtonAccordingToURL();

  $("a.search-for").click(function(event) {
    var currentTarget = event.target;

    if (currentTarget.id === "search-for-funding") {
      changeCategoryButton("Funding");
      changeSearchFormAction('/results');
      changeTextSearchPlaceholder('Keywords - Subject, University, Degree level');
    } else {
      changeCategoryButton("Users");
      changeSearchFormAction('/results/users');
      changeTextSearchPlaceholder('Search for users by name or by interests');
    }
  });

  $("a.category").click(function(event) {
    var currentTarget = event.target;

    if (currentTarget.id === "category-funding") {
      changeCategoryButton("Funding");
      $("form.search_form .input-group-btn").removeClass("open");
      switchActiveTabPanesFromTo("user", "funding");
      changeSearchFormAction('/results');
      changeTextSearchPlaceholder('Keywords - Subject, University, Degree level');
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
      changeCategoryButton("Users");
      $("form.search_form .input-group-btn").removeClass("open");
      switchActiveTabPanesFromTo("funding", "user");
      changeSearchFormAction('/results/users');
      changeTextSearchPlaceholder('Search for users by name or by interests');
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

    return false;
  });

  // remove parameter from query string if value === '' for search-form
  $("form#search-form").submit(function(event) {
    event.preventDefault();
    var currentTarget = event.target;
    var emptyInputFields = 0;
    var searchFormInputs = $("input[form='search-form']");

    for (var i = 0; i < searchFormInputs.length; i++) {
      var id = searchFormInputs[i].id;
      var input = $("#" + id);

      if(input.val() === "") {
        $("form#search-form #" + id).attr("name", "");

        emptyInputFields++;
      }
    }

    //TODO: Resole this fucking bug anyone please. When I am on /results/users?all=true,
    //      and I trigger 'all=true' again by having empty search-form field,
    //      it returns another 'all=true' parameter giving fucking
    //      '/results/users?all=true&all=true' or '/results?all=true&all=true' like WTF.
    //
    //      But everything works fine if I submit the form a million times on '/results?all=true'
    //      Here is a temporary brute force workaround:
    var pathname = window.location.pathname;
    var dangerZoneEntered = pathname === "/results/users";

    if ((emptyInputFields === searchFormInputs.length) && (!dangerZoneEntered)) {
      $("form#search-form").append("<input id='all', type='hidden', name='all', value='true', style='opacity:0; position:absolute; left:9999px;', form='search-form'>");
    }

    currentTarget.submit();
  });

  // remove parameter from query string if value === '' for advs-funding-form
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
        $("form#advs-funding-form #" + id).attr("name", "");

        emptyInputFields++;
      }
    }

    if (emptyInputFields === searchFormInputs.length) {
      $("form#advs-funding-form").append("<input id='all', type='hidden', name='all', value='true', style='opacity:0; position:absolute; left:9999px;', form='advs-funding-form'>");
    }

    currentTarget.submit();
  });

  // remove parameter from query string if value === '' for advs-user-form
  $("form#advs-user-form").submit(function(event) {
    event.preventDefault();
    var currentTarget = event.target;
    var emptyInputFields = 0;
    var searchFormInputs = $("input[form='advs-user-form']");

    for (var i = 0; i < searchFormInputs.length; i++) {
      var id = searchFormInputs[i].id;
      var input = $("#" + id);
      var isRadioButton = input[0].type === "radio";
      var isRadioButtonUnchecked = input.prop("checked") !== true;

      if(input.val() === "" || (isRadioButton && isRadioButtonUnchecked)) {
        $("form#advs-user-form #" + id).attr("name", "");

        emptyInputFields++;
      }
    }

    if (emptyInputFields === searchFormInputs.length) {
      $("form#advs-user-form").append("<input id='all', type='hidden', name='all', value='true', style='opacity:0; position:absolute; left:9999px;', form='advs-user-form'>");
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

  ////////////////////////////////////////////
  //////////////// Functions /////////////////
  ////////////////////////////////////////////

  function changeCategoryButton(string) {
    $("button#category").html(string + " <span class='caret'></span>");
  }

  function changeTextSearchPlaceholder(string) {
    $("#text_search").attr('placeholder', string);
  }

  function changeSearchFormAction(string) {
    $("#search-form").attr('action', string);
  }

  function switchActiveTabPanesFromTo(fromString, toString) {
    $("#advanced-search .tab-pane#advs-" + fromString + ", #advanced-search li#search-for-" + fromString).removeClass("active");
    $("#advanced-search .tab-pane#advs-" + fromString).removeClass("in");
    $("#advanced-search .tab-pane#advs-" + toString + ", #advanced-search li#search-for-" + toString).addClass("active");
    $("#advanced-search .tab-pane#advs-" + toString).addClass("in");
  }

  function setCategoryButtonAccordingToURL() {
    // eg. Setting category to users if on '/results/users'
    var pathname = window.location.pathname;
    var atUserResults = pathname === "/results/users";
    var atFundingResults = pathname === "/results";

    if (atFundingResults) {
      changeCategoryButton("Funding");
      switchActiveTabPanesFromTo("user", "funding");
      changeSearchFormAction('/results');
      changeTextSearchPlaceholder('Keywords - Subject, University, Degree level');
    } else if (atUserResults) {
      changeCategoryButton("Users");
      switchActiveTabPanesFromTo("funding", "user");
      changeSearchFormAction('/results/users');
      changeTextSearchPlaceholder('Search for users by name or by interests');
    }
  }
});
