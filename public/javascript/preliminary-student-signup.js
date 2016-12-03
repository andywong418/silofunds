$(document).ready(function(){
  console.log("HI HI");
  $('input#country_of_residence').tokenInput('/autocomplete/countries', { "theme": "facebook", "allowFreeTagging": true, "placeholder": 'E.g. United Kingdom, China'});
  // var arrayFields = ['subject', 'target_degree', 'previous_degree', 'target_university', 'previous_university'];
  $('input[name=subject]').tokenInput('/autocomplete/subjects', { "theme": "facebook", "allowFreeTagging": true, "placeholder": 'E.g. English literature, Chemical Engineering, History' });
  $('input[name=' + "target_university" + '], input[name=previous_university]').tokenInput('/autocomplete/universities', { "theme": "facebook", "allowFreeTagging": true, "placeholder": "E.g. University of Oxford" });
  $('input[name=previous_degree], input[name=target_degree]').tokenInput('/autocomplete/degrees', { "theme": "facebook", "allowFreeTagging": true ,"placeholder": 'E.g. Bachelor, Master of Arts, Dphil' });

  $('#save-prelim').click(function(){
    var countries = $('input#country_of_residence').val().split(',');
    var subject = $('input[name=subject]').val().split(',');
    var targetDegree = $('input[name=target_degree]').val().split(',');
    var previousDegree = $('input[name=previous_degree]').val().split(',');
    var targetUniversity = $('input[name=target_university]').val().split(',');
    var previousUniversity = $('input[name=previous_university]').val().split(',');
    var formData = {
      'subject': subject,
      'target_degree': targetDegree,
      'previous_degree': previousDegree,
      'target_university': targetUniversity,
      'previous_university': previousUniversity,
      'country_of_residence': countries,
    };


    $.post('/signup/user/save', formData, function(data){
      window.location = '/user/dashboard';
    });
  });
});
