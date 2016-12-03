$(document).ready(function() {

  $("#left_div div.settings-tab-menu div.list-group a").click(function(e) {
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


  if(user.gender !== null) {
    $("#" + user.gender).prop("checked", true);
  }

  $("#clear_gender").click(function(evt) {
    evt.preventDefault();

    $("#male, #female").prop("checked", false);
  });

  // // TODO: ABSTRACT BELOW BITCHHHH

  // var text;
  try {
    initiateTinyMCE();
  } catch(e) {
    // console.log("tinymce not defined!");
  }

  //Change profile picture
  if(!user.profile_picture) {
    $('#userImage').css('border', '2px solid rgba(255, 0, 0, 0.4)')
  }
  var $my_file = $("#my_file");
  var $my_canvas_image = $("#my_canvas_image");
  var $upload_button = $("#upload_button");
  var $my_modal = $("#mymodal");
  var $user_image = $("#userImage");
  var upload_crop_settings = null;
  $user_image.on('load', function() {
    $(window).resize();
  });
  $upload_button.on("click", function() {
    uploadImage();
    $my_modal.modal("hide");
  });
  $("#userImage, .update-me, i#overlayed_camera").click(function() {
    $("#openModal").click();
    //$("input[id='my_file']").click();
  });
  $my_file.on("change", function() {
    if ($my_canvas_image.cropper) {
      console.log('destroyed');
      $my_canvas_image.cropper("destroy");
    }
    var file = $my_file[0].files[0];
    var url = URL.createObjectURL(file);
    $my_canvas_image[0].src = url;
    $my_canvas_image.cropper({
      aspectRatio: 1,
      viewMode: 1,
      crop: function(e) {
        upload_crop_settings = { x: e.x, y: e.y, width: e.width, height: e.height, rot: e.rotate, scaleX: e.scaleX, scaleY: e.scaleY };
        console.log(upload_crop_settings);
      }
    });
  });
  // Change prof pic for mobile display
  $(".userImageMobile").click(function() {
      $("input[id='my_file']").click();
  });
  function uploadImage() {
    if ($my_file[0].files && $my_file[0].files[0]) {
     $user_image.attr('src', "/images/ajax-loader.gif");
    }
    var file = $my_file[0].files[0];
    var data = new FormData();
    data.append('profile_picture', file);
    data.append('user', user.id);
    data.append('crop_settings', JSON.stringify(upload_crop_settings));
    $.ajax({
      type: "POST",
      url: "/user-edit/profile-picture",
      data: data,
      processData: false,
      contentType: false,
    }).then(function(data){
      console.log(data);
      if (data != "FAIL") {
        $user_image.attr("src", data);
      }
    });
  }
  // NOTE: Change label name upon file upload

  var inputs = document.querySelectorAll( '.realFileUpload' );
  Array.prototype.forEach.call( inputs, function( input ) {
  	var label	 = input.previousElementSibling,
  		  labelVal = label.innerHTML;

  	input.addEventListener('change', function(e) {
  		var fileName = '';
  		if( this.files && this.files.length > 1 ) {
  			alert("You can only upload 1 file at a time.");
      } else if (this.files) {
        var inputID = this.id;
        fileName = e.target.value.split( '\\' ).pop();
        $('label#' + inputID).removeClass('hidden');

      } else {
        console.log("no file");
      }

  		if(fileName) {
        label.innerHTML = fileName;
      } else {
        label.innerHTML = labelVal;
      }

      var fileData = new FormData();
      var file = input.files[0];

      if (file) {
        fileData.append('past_work', file);
      }

      var files = fileData.getAll('past_work');
      var userID = user.id;

      if (files.length > 0) {
        $.ajax({
          type: 'POST',
          url: "/signup/user_signup/work/" + userID,
          data: fileData,
          processData: false,
          contentType: false
        }).done(function(documentIDArr) {
          $('.col-md-6#' + inputID + ' textarea').attr('id', documentIDArr[0].toString());
        });
      } else {
        // these documents are already in postgres
      }
  	});
  });

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

    var gender;

    if($('#male').is(":checked")){
      gender = 'male';
    }
    if($('#female').is(":checked")){
      gender = 'female';
    }

    saveActivePaneSettings('personal', ['username', 'date_of_birth', 'religion', 'country_of_residence'], { gender: gender });
  });

  $('#save-campaign-settings').click(function(e) {
    e.preventDefault();

    var textareas = $('textarea.past_work_description');
    var descriptionData = [];

    for (var i = 0; i < textareas.length; i++) {
      var wrapper = {};
      var document_id = textareas[i].id;

      if (document_id !== '') {
        wrapper.document_id = document_id;
        wrapper.description = textareas[i].value;

        descriptionData.push(wrapper);
      }
    }

    $.ajax({
      type: 'POST',
      url: '/user/settings/update-description',
      data: JSON.stringify(descriptionData)
    });
    var refund;
    if(user.funding_accrued == null) {
      if($('input#refund').prop('checked') === true){
        refund = true;
      }
      else{
        refund = false;
      }
    }
    saveActivePaneSettings('campaign', ['video', 'short_description', 'link', 'funding_needed', 'completion_date'], { "description": tinymce.activeEditor.getContent(), "refund": refund });
  });

  $('.launch_status a.offline').click(function() {
    $.ajax({
      type: 'POST',
      url: '/user/take_offline',
      data: user.id
    }).then(function() {
      location.reload(true)
    })
  })

  $('.launch_status a.launch').click(function() {
    $.ajax({
      type: 'POST',
      url: '/user/launch',
      data: user.id
    }).then(function() {
      location.reload(true)
    })
  })


  $('#save-education-settings').click(function(e) {
    e.preventDefault();
    saveActivePaneSettings('education', ['subject', 'previous_degree', 'previous_university', 'target_degree', 'target_university', 'college']);
  });

  $('label.removeFile').click(function(e) {
    var id = e.currentTarget.id;
    var documentDiv = $('input#' + id).parents()[2];
    var documentID = documentDiv.id;
    var fileName = $('label.fakeFileUpload[for=' + id + ']').html();
    $('label.fakeFileUpload[for=' + id + ']').html("Upload");
    $('label.removeFile#' + id).addClass('hidden');

    $.ajax({
      type: 'POST',
      url: "/user/settings/remove-file",
      data: { "documentID": documentID, "fileName": fileName }
    });
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
    });
  }

  function saveActivePaneSettings(tabPaneName, settingsFieldsArray, extraOptions) {
    var formData = {};

    for (var i = 0; i < settingsFieldsArray.length; i++) {
      var formDataKey = settingsFieldsArray[i];
      if(formDataKey== 'college'){
        formData[formDataKey] = $('#input-' + formDataKey).val().split(',');
        console.log(formData[formDataKey]);
        console.log(formDataKey);
        console.log(formData);
      }
      else{
        formData[formDataKey] = $('#' + formDataKey).val();
      }

    }

    if (extraOptions) {
      var extraOptionsKeys = Object.keys(extraOptions);

      for (var j = 0; j < extraOptionsKeys.length; j++) {
        var extraOptionsKey = extraOptionsKeys[j];

        formData[extraOptionsKey] = extraOptions[extraOptionsKey];
      }
    }
    console.log("formdata", formData);
    $.post('/user/settings', formData, function(data) {
      $('#save-' + tabPaneName + '-settings-notification').css('display', 'block');
      $('#save-' + tabPaneName + '-settings-notification').fadeOut(6000);
    });

  }

  // Mobile jquery
  barSwitcher();
  setTimeout(cameraFaviconMover(), 100) // Timeout required else image has not loaded and height is given to be 0
  $(window).resize(function() {
    barSwitcher();
    cameraFaviconMover();
  })

  $("#top_div div.settings-tab-menu div.list-group div.flex-box").click(function(e) {
    e.preventDefault();

    $(this).siblings('div.active-mobile').removeClass("active-mobile");
    $(this).addClass("active-mobile");

    var index = $(this).index();
    $("div.settings-tab div.settings-tab-content").removeClass("active-mobile");
    $("div.settings-tab div.settings-tab-content").eq(index).addClass("active-mobile");
  });

  $('#delete').click(function() {
    $('.modal-delete.modal.fade').modal('toggle')
  })

  if(user.funding_accrued !== null) {
    $('.refund-choice').remove()
  }
});


// Functions for mobile stuff
function barSwitcher() {
  if($(window).width() <= 541) {
    $('#left_div').show()
    $('#mobile-remove-div').hide();
    $('#top_div').show();
    $('#right_div').show();
    $('#right_div').removeClass('col-xs-8');
    $('#right_div').addClass('col-xs-12');
    $('#big_flex_div').addClass('flex-direction', 'column');
  } else {
    $('#left_div').show()
    $('#mobile-remove-div').show();
    $('#top_div').hide();
    $('#right_div').show();
    $('#right_div').addClass('col-xs-8');
    $('#right_div').removeClass('col-xs-12');
  }

  prePopulate();
}

function cameraFaviconMover() {
  if($(window).width() > 541) {
    // We then user absolute position relative to left div
    var imageWidth = $('#box-profile').width()
    var cameraWidth = $('#box-profile .fa.fa-camera').width();
    var left = (imageWidth - cameraWidth)/2
    $('#box-profile .fa.fa-camera').css('margin-left', $('#left_div').css('padding-left'))
    $('#box-profile .fa.fa-camera').css('left', left + 1) // Not sure why not exact, but +1 improves the centering
    var top;
    if(user.profile_picture) {
      top = $('#userImage').height() - $('#box-profile .fa.fa-camera').height();
    } else {
      top = $('.top-no-pic').height() - $('#box-profile .fa.fa-camera').height();
    }
    $('#box-profile .fa.fa-camera').css('top', top - 9);
    console.log($('#box-profile').height())
  }
}

// Prepopulation of advanced search
function prePopulate() {
  var age = calcAge(user.date_of_birth)
  console.log(age)
  $('#advanced_age').val(age);
  $('#advanced_country_of_residence').val(user.country_of_residence);
  $('#advanced_religion').val(user.religion);
  if(user.gender == 'male') {
    $('#male').prop('checked', 'true')
  } else if (user.gender == 'female') {
    $('#female').prop('checked', 'true')
  }
  $('#advanced_required_university').val(user.previous_university);
  $('#advanced_required_degree').val(user.previous_degree);
  $('#advanced_subject').val(user.target_degree);
  $('#advanced_target_country').val(user.target_country);
  $('#advanced_specific_location').val(user.specific_location);
  $('#advanced_target_university').val(user.target_university);
  $('#advanced_target_degree').val(user.target_degree);
}

function calcAge(dateString) {
  var birthday = +new Date(dateString);
  return ~~((Date.now() - birthday) / (31557600000));
}
