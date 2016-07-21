$(document).ready(function() {
  $("div.settings-tab-menu div.list-group a").click(function(e) {
    e.preventDefault();

    $(this).siblings('a.active').removeClass("active");
    $(this).addClass("active");

    var index = $(this).index();
    $("div.settings-tab div.settings-tab-content").removeClass("active");
    $("div.settings-tab div.settings-tab-content").eq(index).addClass("active");
  });

  // TODO: ABSTRACT BELOW BITCHHHH

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
    var formData = {
      "title": $('#title').val(),
      "description": $('#description').val(),
      "number_of_places": $('#number_of_places').val(),
      "minimum_amount": $('#minimum_amount').val(),
      "maximum_amount": $('#maximum_amount').val(),
      "duration_of_scholarship": $('#duration_of_scholarship').val()
    };
    $.post('/fund/options/' + fund.id + '/edit', formData, function(data){
      console.log(data);
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
    if($('#merit-input').is(":checked")){
      merit_or_finance = 'merit';
    }
    if($('#finance-input').is(":checked")){
      merit_or_finance = 'finance';
    };
    var gender = '';
    if($('#male-input').is(":checked")){
      gender = 'male';
    }
    if($('#female-input').is(":checked")){
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
    $.post('/fund/options/' + fund.id + '/edit', formData, function(data){
      console.log(data);
      $('#save-eligibility-notification').css('display', 'block');
      $("#save-eligibility-notification").fadeOut(6000);

    });
  })
  $('#save-application-process').click(function(){
    var applicationDocuments = $('input[name=application_documents]').val().split(',');
    var formData={
      'application_open_date': $('input[name=start_date]').val(),
      'deadline': $('input[name=deadline]').val(),
      'interview_date': $('input[name=interview_date]').val(),
      'application_decision_date':$('input[name=application_decision_date]').val(),
      'application_link': $('input[name=application_link]').val(),
      'application_documents': applicationDocuments,
      'other_application_steps': $('textarea#other_application_steps').val()
    }
    $.post('/fund/options/' + fund.id + '/edit', formData, function(data){
      console.log(data);
      consol.log("LLOOOK IM HER")
      $('#save-application-notification').css('display', 'block');
      $("#save-application-notification").fadeOut(6000);
    });
  })
});
