$(function() {
  // Back to Top button
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

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

  try {
    try {
      if (fund.target_country) {
        var savedTargetCountry = [];

        for (var i = 0; i < fund.target_country.length; i++) {
          var targetCountryWrapper = {};
          targetCountryWrapper.id = fund.target_country[i].capitalize();
          targetCountryWrapper.name = fund.target_country[i].capitalize();

          savedTargetCountry.push(targetCountryWrapper);
        }

        $('input#target_country').tokenInput('/autocomplete/countries', {
          "theme": "facebook",
          "prePopulate": savedTargetCountry,
          "allowFreeTagging": true
        });
      } else {
        $('input#target_country').tokenInput('/autocomplete/countries', { "theme": "facebook", "allowFreeTagging": true });
      }
    } catch (e) {
      console.log(e);
      $('input#target_country').tokenInput('/autocomplete/countries', { "theme": "facebook", "allowFreeTagging": true });
    }
  } catch (e) {
    console.log("on funds homepage");
  }

  try {
    try {
      if (fund.country_of_residence) {
        var savedCountryOfRes = [];

        for (var j = 0; j < fund.country_of_residence.length; j++) {
          var countryOfResWrapper = {};
          countryOfResWrapper.id = fund.country_of_residence[j].capitalize();
          countryOfResWrapper.name = fund.country_of_residence[j].capitalize();

          savedCountryOfRes.push(countryOfResWrapper);
        }

        $('input#country_of_residence').tokenInput('/autocomplete/countries', {
          "theme": "facebook",
          "prePopulate": savedCountryOfRes,
          "allowFreeTagging": true
        });
      } else {
        $('input#country_of_residence').tokenInput('/autocomplete/countries', { "theme": "facebook", "allowFreeTagging": true });
      }
    } catch (e) {
      console.log(e);
      $('input#country_of_residence').tokenInput('/autocomplete/countries', { "theme": "facebook", "allowFreeTagging": true });
    }
  } catch (e) {
    console.log("on funds homepage");
  }
  //degree
  try {
    try {
      if (fund.target_degree) {
        var targetDegreeArray = [];

        for (var j = 0; j < fund.target_degree.length; j++) {
          var targetDegreesWrapper = {};
          targetDegreesWrapper .id = fund.target_degree[j].capitalize();
          targetDegreesWrapper.name = fund.target_degree[j].capitalize();

          targetDegreesArray.push(targetDegreesWrapper);
        }

        $('input#target_degree').tokenInput('/autocomplete/degrees', {
          "theme": "facebook",
          "prePopulate": targetDegreesArray,
          "allowFreeTagging": true
        });
      } else {
        $('input#target_degree').tokenInput('/autocomplete/degrees', { "theme": "facebook", "allowFreeTagging": true });
      }
    } catch (e) {
      console.log(e);
      $('input#target_degree').tokenInput('/autocomplete/degrees', { "theme": "facebook", "allowFreeTagging": true });
    }
  } catch (e) {
    console.log("on funds homepage");
  }
  try {
    try {
      if (fund.required_degree) {
        var requiredDegreesArray = [];

        for (var j = 0; j < fund.required_degree.length; j++) {
          var requiredDegreesWrapper = {};
          requiredDegreesWrapper .id = fund.required_degree[j].capitalize();
          requiredDegreesWrapper.name = fund.required_degree[j].capitalize();

          requiredDegreesArray.push(requiredDegreesWrapper);
        }

        $('input#required_degree').tokenInput('/autocomplete/degrees', {
          "theme": "facebook",
          "prePopulate": requiredDegreesArray,
          "allowFreeTagging": true
        });
      } else {
        $('input#required_degree').tokenInput('/autocomplete/degrees', { "theme": "facebook", "allowFreeTagging": true });
      }
    } catch (e) {
      console.log(e);
      $('input#required_degree').tokenInput('/autocomplete/degrees', { "theme": "facebook", "allowFreeTagging": true });
    }
  } catch (e) {
    console.log("on funds homepage");
  }
  // universities
  try {
    try {
      if (fund.target_university) {
        var targetUniversityArray = [];

        for (var j = 0; j < fund.target_university.length; j++) {
          var targetUniversityWrapper = {};
          targetUniversityWrapper .id = fund.target_university[j].capitalize();
          targetUniversityWrapper.name = fund.target_university[j].capitalize();

          targetUniversityArray.push(targetUniversityWrapper);
        }

        $('input#target_university').tokenInput('/autocomplete/universities', {
          "theme": "facebook",
          "prePopulate": requiredDegreesArray,
          "allowFreeTagging": true
        });
      } else {
        $('input#target_university').tokenInput('/autocomplete/universities', { "theme": "facebook", "allowFreeTagging": true });
      }
    } catch (e) {
      console.log(e);
      $('input#target_university').tokenInput('/autocomplete/universities', { "theme": "facebook", "allowFreeTagging": true });
    }
  } catch (e) {
    console.log("on funds homepage");
  }
  try {
    try {
      if (fund.required_university) {
        var requiredUniversityArray = [];

        for (var j = 0; j < fund.required_university.length; j++) {
          var requiredUniversityWrapper = {};
          requiredUniversityWrapper .id = fund.required_university[j].capitalize();
          requiredUniversityWrapper.name = fund.required_university[j].capitalize();

          requiredUniversityArray.push(requiredUniversityWrapper);
        }

        $('input#required_university').tokenInput('/autocomplete/universities', {
          "theme": "facebook",
          "prePopulate": requiredDegreesArray,
          "allowFreeTagging": true
        });
      } else {
        $('input#required_university').tokenInput('/autocomplete/universities', { "theme": "facebook", "allowFreeTagging": true });
      }
    } catch (e) {
      console.log(e);
      $('input#required_university').tokenInput('/autocomplete/universities', { "theme": "facebook", "allowFreeTagging": true });
    }
  } catch (e) {
    console.log("on funds homepage");
  }
//suggest_subjects
try {
  try {
    if (fund.subject) {
      var subjectArray = [];

      for (var j = 0; j < fund.subject.length; j++) {
        var subjectWrapper = {};
        subjectWrapper .id = fund.subject[j].capitalize();
        subjectWrapper.name = fund.subject[j].capitalize();

        subjectArray.push(subjectWrapper);
      }

      $('input#subject').tokenInput('/autocomplete/subjects', {
        "theme": "facebook",
        "prePopulate": subjectArray,
        "allowFreeTagging": true
      });
    } else {
      $('input#subject').tokenInput('/autocomplete/subjects', { "theme": "facebook", "allowFreeTagging": true });
    }
  } catch (e) {
    console.log(e);
    $('input#subject').tokenInput('/autocomplete/subjects', { "theme": "facebook", "allowFreeTagging": true });
  }
} catch (e) {
  console.log("on funds homepage");
}
  // Hide and toggle unimportant fields
  $("label a").click(function(e) {
    $('input#' + e.target.id).toggleClass('hide-this-shit');
    $('textarea#' + e.target.id).toggleClass('hide-this-shit');

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

  $("form[name='reset-table']").submit(function(e) {
    var password = prompt("ENTER THE FUCKING PASSWORD OR GET FUCKED.");
    $("form[name='reset-table']").append("<input type='password' name='password' style='display: none;'>");
    $("form[name='reset-table'] input[type='password']").val(password);

    return true;
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

    var max_chars = 650; //max characters
    var max_for_html = 300; //max characters for html tags
    var allowed_keys = [8, 13, 16, 17, 18, 20, 33, 34, 35, 36, 37, 38, 39, 40, 46];
    var chars_without_html = 0;

    // text editor init
    tinymce.init(tinymceInitOptions());

    chars_without_html = $.trim($("#description_edit").text().replace(/(<([^>]+)>)/ig, "")).length;
    $('#chars_left').html(max_chars - chars_without_html);
    alarmChars();

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

      console.log("data");
      console.log(data);
      console.log("a");
      console.log(a);
      console.log('Finished AJAX.');
    }).fail(function() {
      alert( "error" );
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

  function alarmChars() {
    if (chars_without_html > (max_chars - 25)) {
      $('#chars_left').css('color', 'red');
    } else {
      $('#chars_left').css('color', 'gray');
    }
  }

  function getStats(id) {
      var body = tinymce.get(id).getBody(), text = tinymce.trim(body.innerText || body.textContent);

      return {
          chars: text.length,
          words: text.split(/[\w\u2019\'-]+/).length
      };
  }

  function tinymceInitOptions() {
    var options = {
      selector: '#description',
      fontsize_formats: '8pt 10pt 12pt 14pt 15pt 16pt 18pt 24pt 36pt',
      plugins: [
        "advlist autolink link lists charmap print preview hr anchor pagebreak",
        "searchreplace visualblocks visualchars code insertdatetime media nonbreaking",
        "save table contextmenu directionality paste textcolor"
      ],
      theme: "modern",
      height: 130,
      language: 'en',
      init_instance_callback : function(ed) {
        ed.pasteAsPlainText = false;

        //adding handlers crossbrowser
        if (tinymce.isOpera || /Firefox\/2/.test(navigator.userAgent)) {
          ed.onKeyDown.add(function (ed, e) {
            if (((tinymce.isMac ? e.metaKey : e.ctrlKey) && e.keyCode == 86) || (e.shiftKey && e.keyCode == 45))
              ed.pasteAsPlainText = false;
          });
        }
      },
      // menubar: false,
      // statusbar: false,
      toolbar: "undo redo pastetext | styleselect | fontselect | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | insert | bullist numlist | charmap",
      setup: function (ed) {
        ed.on("KeyDown", function (ed, evt) {
          chars_without_html = $.trim(tinyMCE.activeEditor.getContent({format: 'text'})).length;
          chars_with_html = tinyMCE.activeEditor.getContent().length;
          var key = ed.keyCode;

          $('#chars_left').html(max_chars - chars_without_html);

          if (allowed_keys.indexOf(key) != -1) {
            alarmChars();
            return;
          }

          if (chars_with_html > (max_chars + max_for_html)) {
            ed.stopPropagation();
            ed.preventDefault();
          } else if (chars_without_html > max_chars - 1 && key != 8 && key != 46) {
            alert('Characters limit!');
            ed.stopPropagation();
            ed.preventDefault();
          }

          alarmChars();
        });
      },
    };

    return options;
  }
});
