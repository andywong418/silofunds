$(function() {
  // Back to Top button
  var amountScrolled = 300;
  $(window).scroll(function() {
    if ( $(window).scrollTop() > amountScrolled ) {
      $('a.back-to-top').fadeIn('slow');
    } else {
      $('a.back-to-top').fadeOut('slow');
    }
  });

  $('a.back-to-top').click(function() {
  	$('html, body').animate({
  		scrollTop: 0
  	}, 700);

  	return false;
  });

  $("#clear_gender").click(function(evt) {
    evt.preventDefault();

    $("#male, #female").prop("checked", false);
  });

  $("#clear_merit").click(function(evt) {
    evt.preventDefault();

    $("#merit, #finance").prop("checked", false);
  });

  $("form[name='destroy_fund'], form[name='destroy_organisation']").submit(function(e) {
    e.preventDefault();
    var currentTarget = event.target;
    var result = confirm("You sure you want to delete?");

    if (result) {
      currentTarget.submit();
    }
  });

  $("form[name='create_fund']").submit(function(e){
    e.preventDefault();

    var title = $('input#title');
    var parameters = { title: title.val() };
    var currentTarget = event.target;

    $.post('/admin/new/validate', parameters, function(data){

      var same_title_as_original = false;

      try {
        if (data[0].id === fund.id) {
          same_title_as_original = true;
        }
      } catch (e) {
        console.log("data ('fund' passed from the view) probably isn't defined.");
      }

      if (data && !same_title_as_original) {
        $(".alert").removeClass("hidden");

        $("html, body").animate({
          scrollTop: $("body").offset().top
        }, 200);
      } else {
        currentTarget.submit();
      }

     });
   });

  try {

    // text editor init
    tinymce.init({
      selector: '#description',
      fontsize_formats: '8pt 10pt 12pt 14pt 15pt 16pt 18pt 24pt 36pt',
      plugins: "link",
      toolbar: "undo redo pastetext | styleselect | fontselect | fontsizeselect | insert | bullist | numlist"
    });

  } catch(e) {
    console.log("tinymce not defined!");
  }

  var pathname = window.location.pathname;

  $('a#downloader').click(function(e) {
    e.preventDefault();

    var $link = $(this);
    var url = $link.attr("href");
    var posting = $.post(url);

    posting.done(function(array_of_obj) {
      var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(array_of_obj));
      var a = document.createElement('a');
      var container = document.getElementById('generated_download_link');
      a.href = 'data:' + data;
      a.download = 'data.json';
      a.innerHTML = 'Download JSON';
      container.appendChild(a);

      console.log('Finished AJAX.');
    });
  });

  try {
    if(fund.gender !== null) {
      $("#" + fund.gender).prop("checked", true);
    }

    if(fund.merit_or_finance !== null) {
      $("#" + fund.merit_or_finance).prop("checked", true);
    }

    if(fund.invite_only) {
      $("#invite").prop("checked", true);
    }
    if(fund.support_type){
      var options = $("#support_type").children()
      for (i = 0; i < options.length; i++){
        if(fund.support_type == options[i].value){
          options[i].selected = true;
        }
      }
    }
  } catch (e) {
    console.log("Caught the error.");
  }
});
