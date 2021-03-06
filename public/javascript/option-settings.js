$(document).ready(function() {

  $("div.settings-tab-menu div.list-group a").click(function(e) {
    e.preventDefault();

    $(this).siblings('a.active').removeClass("active");
    $(this).addClass("active");

    var index = $(this).index();
    $("div.settings-tab div.settings-tab-content").removeClass("active");
    $("div.settings-tab div.settings-tab-content").eq(index).addClass("active");
  });
  function reformatDateInput(date, field){
    if(date){
      var newDate = date.split('T')[0];
      $('input#' + field).val(newDate);
    }
  }

  // TODO: ABSTRACT BELOW BITCHHHH

    reformatDateInput(fund.deadline, 'deadline');
    reformatDateInput(fund.application_open_date, 'application_open_date');
    reformatDateInput(fund.application_decision_date, 'application_decision_date');
    reformatDateInput(fund.interview_date, 'interview_date');

  var text;
  try {

    // text editor init
    tinymce.init({
      selector: '#description',
      fontsize_formats: '8pt 10pt 12pt 14pt 15pt 16pt 18pt 24pt 36pt',
      plugins: "link",
      toolbar: "undo redo pastetext | styleselect | fontselect | fontsizeselect | insert | bullist | numlist"
    }).then(function(editors){
    });
  } catch(e) {
    console.log("tinymce not defined!");
  }

  if(fund.gender !== null) {
    $("#" + fund.gender).prop("checked", true);
  }

  if(fund.merit_or_finance !== null) {
    $("#" + fund.merit_or_finance).prop("checked", true);
  }

  $("#clear_gender").click(function(evt) {
    evt.preventDefault();

    $("#male, #female").prop("checked", false);
  });

  $("#clear_merit").click(function(evt) {
    evt.preventDefault();

    $("#merit, #finance").prop("checked", false);
  });


  ///////////
  //submit form data
  $('#save-general-info').click(function(){
    var description =tinymce.activeEditor.getContent();
    var formData = {
      "title": $('#title').val(),
      "description": description,
      "number_of_places": $('#number_of_places').val(),
      "minimum_amount": $('#minimum_amount').val(),
      "maximum_amount": $('#maximum_amount').val(),
      "duration_of_scholarship": $('#duration_of_scholarship').val()
    };
    $.post('/organisation/options/' + fund.id + '/edit', formData, function(data){
      $('#save-general-notification').css('display', 'block');
      $("#save-general-notification").fadeOut(6000);

    });
  })
  $('#save-eligibility').click(function(){
    var subject = $('input[name=subject]').val().split(',');
    var religion = $('#religion').val().split(',');
    var targetUniversity = $('input[name=target_university]').val().split(',');
    var targetDegree = $('input[name=target_degree]').val().split(',');
    var requiredDegree = $('input[name=required_degree]').val().split(',');
    var requiredUniversity = $('input[name=required_university]').val().split(',');
    var targetCountry = $('input[name=target_country]').val().split(',');
    var country_of_residence = $('input[name=country_of_residence]').val().split(',');
    var specific_location = $('input[name=specific_location]').val().split(',');
    var merit_or_finance = '';
    if($('input#merit').is(":checked")){
      merit_or_finance = 'merit';
    }
    if($('input#finance').is(":checked")){
      merit_or_finance = 'finance';
    };
    var gender = '';
    if($('input#male').is(":checked")){
      gender = 'male';
    }
    if($('input#female').is(":checked")){
      gender= 'female';
    }
    var formData = {
      'subject': subject,
      'minimum_age': $('input[name=minimum_age]').val(),
      'maximum_age': $('input[name=maximum_age]').val(),
      'gender': gender,
      'merit_or_finance': merit_or_finance,
      'religion': religion,
      'target_university': targetUniversity,
      'target_degree': targetDegree,
      'required_degree': requiredDegree,
      'required_university': requiredUniversity,
      'required_grade': $('input[name=required_grade]').val(),
      'target_country': targetCountry,
      'country_of_residence': country_of_residence,
      'specific_location': specific_location,
      'other_eligibility': $('textarea#other_eligibility').val()
    };
    $.post('/organisation/options/' + fund.id + '/edit', formData, function(data){
      $('#save-eligibility-notification').css('display', 'block');
      $("#save-eligibility-notification").fadeOut(6000);

    });
  })
  $('#save-application-process').click(function(){
    var applicationDocuments = $('input[name=application_documents]').val().split(',');
    var formData={
      'application_open_date': $('input[name=application_open_date]').val(),
      'deadline': $('input[name=deadline]').val(),
      'interview_date': $('input[name=interview_date]').val(),
      'application_decision_date':$('input[name=application_decision_date]').val(),
      'application_link': $('input[name=application_link]').val(),
      'application_documents': applicationDocuments,
      'other_application_steps': $('textarea#other_application_steps').val(),
      'tips': $('textarea#tips').val()
    }
    $.post('/organisation/options/' + fund.id + '/edit', formData, function(data){
      $('#save-application-notification').css('display', 'block');
      $("#save-application-notification").fadeOut(6000);
    });
  })
});
