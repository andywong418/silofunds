$(document).ready(function() {
  $("div.settings-tab-menu div.list-group a").click(function(e) {
    e.preventDefault();

    $(this).siblings('a.active').removeClass("active");
    $(this).addClass("active");

    var index = $(this).index();
    $("div.settings-tab div.settings-tab-content").removeClass("active");
    $("div.settings-tab div.settings-tab-content").eq(index).addClass("active");
  });

  tokenInputFor('country_of_residence', 'countries');
  tokenInputFor('previous_degree', 'degrees');
  tokenInputFor('previous_university', 'universities');
  tokenInputFor('religion', 'religions');
  tokenInputFor('subject', 'subjects');
  tokenInputFor('target_degree', 'degrees');
  tokenInputFor('target_university', 'universities');

  // // TODO: ABSTRACT BELOW BITCHHHH
  // var text;
  try {
    initiateTinyMCE();
  } catch(e) {
    console.log("tinymce not defined!");
  }

  // NOTE: submit form data
  $('#save-general-settings').click(function(e) {
    e.preventDefault();

    var previousPassword = $('#previous_password').val();
    var newPassword = $('#new_password').val();
    var confirmNewPassword = $('#confirm_new_password').val();

    if ((previousPassword === '') && (newPassword === '') && (confirmNewPassword === '')) {
      saveActivePaneSettings('general', ['email'], {
        "email_updates": $('#email_updates').is(":checked")
      });
    } else {
      $.post('/user/settings/validate-password', { "previous_password": $('#previous_password').val() }, function(response) {
        $('span#previous_password_message').html(response.message);

        if (response.match) {
          $('span#previous_password_message').css("color", "green");

          if (newPassword === '') {
            $('span#new_password_message').html("Please enter a password.");
          }

          if (confirmNewPassword === '') {
            $('span#confirm_new_password_message').html("Please enter a password.");
          }

          if (newPassword !== confirmNewPassword) {
            $('span#new_password_message').html("The passwords don't match!");
            $('span#confirm_new_password_message').html("The passwords don't match!");
          }

          if ((newPassword === confirmNewPassword) && (newPassword !== '') && (confirmNewPassword !== '')) {
            saveActivePaneSettings('general', ['email'], {
              "email_updates": $('#email_updates').is(":checked"),
              "password": $('#confirm_new_password').val()
            });

            $('span.password_message').empty();
            $('input.password').val('');
          }
        } else {
          $('span#previous_password_message').css("color", "red");
        }
      });
    }
  });

  $('#save-personal-settings').click(function(e) {
    e.preventDefault();

    saveActivePaneSettings('personal', ['username', 'date_of_birth', 'religion', 'country_of_residence']);
  });

  $('#save-campaign-settings').click(function(e) {
    e.preventDefault();

    saveActivePaneSettings('campaign', ['link', 'funding_needed', 'completion_date'], { "description": tinymce.activeEditor.getContent() });
  });


  $('#save-education-settings').click(function(e) {
    e.preventDefault();

    saveActivePaneSettings('education', ['subject', 'previous_degree', 'previous_university', 'target_degree', 'target_university']);
  });

  /// Functions

  function tokenInputFor(field, source) {
    var tokenInputOptions = { "theme": "facebook", "allowFreeTagging": true };

    if (field === 'religion') {
      if (user[field]) {
        var tokenInputArr = [];
        var wrapper = {};

        wrapper.id = user[field];
        wrapper.name = user[field];

        tokenInputArr.push(wrapper);
        tokenInputOptions.prePopulate = tokenInputArr;
        tokenInputOptions.tokenLimit = 1;
      }
    } else {
      // Handles array fields
      if (user[field]) {
        var tokenInputArr = [];

        for (var j = 0; j < user[field].length; j++) {
          var wrapper = {};
          wrapper.id = user[field][j];
          wrapper.name = user[field][j];

          tokenInputArr.push(wrapper);
        }

        tokenInputOptions.prePopulate = tokenInputArr;
      }
    }

    $('input#' + field).tokenInput('/autocomplete/' + source, tokenInputOptions);
  }

  function initiateTinyMCE() {
    // text editor init
    tinymce.init({
      selector: '#description',
      fontsize_formats: '8pt 10pt 12pt 14pt 15pt 16pt 18pt 24pt 36pt',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons template paste textcolor colorpicker textpattern imagetools'
      ],
      height: 250,
      theme: "modern",
      elementpath: false,
      toolbar1: "undo redo | styleselect | bullist numlist | link image | preview",
      toolbar2: 'bold italic | alignleft aligncenter alignright alignjustify | forecolor backcolor emoticons'
    }).then(function(editors){
      // console.log(tinymce.activeEditor.getContent({format: 'text'}));
    });
  }

  function saveActivePaneSettings(tabPaneName, settingsFieldsArray, extraOptions) {
    var formData = {};

    for (var i = 0; i < settingsFieldsArray.length; i++) {
      var formDataKey = settingsFieldsArray[i];
      formData[formDataKey] = $('#' + formDataKey).val();
    }

    if (extraOptions) {
      var extraOptionsKeys = Object.keys(extraOptions);

      for (var j = 0; j < extraOptionsKeys.length; j++) {
        var extraOptionsKey = extraOptionsKeys[j];

        formData[extraOptionsKey] = extraOptions[extraOptionsKey];
      }
    }

    console.log(formData);

    $.post('/user/settings', formData, function(data) {
      $('#save-' + tabPaneName + '-settings-notification').css('display', 'block');
      $('#save-' + tabPaneName + '-settings-notification').fadeOut(6000);
    });
  }
});
