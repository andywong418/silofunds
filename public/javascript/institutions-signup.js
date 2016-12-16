$(document).ready(function(){
  $('input#country_of_residence').tokenInput('/autocomplete/countries', { "theme": "facebook", "allowFreeTagging": true});

  var arrayFields = ['subject', 'previous_university'];


  for(var i =0; i< arrayFields.length; i++){
      if(arrayFields[i] == 'subject'){
        $('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/subjects', { "theme": "facebook", "allowFreeTagging": true, "placeholder": 'E.g. English, History' });
      }
      if(arrayFields[i] == 'target_university' || arrayFields[i] == 'previous_university'){
        $('input[name=' + arrayFields[i] + ']').tokenInput('/autocomplete/universities', { "theme": "facebook", "allowFreeTagging": true, "placeholder": "E.g. University of Oxford" });
      }

  }
  $('select[name="buffer_type"]').change(function(){
    switch($(this).val()){
      case "university":
        $('#previous-university-row').show();
        $('#subject-row, #previous-college-row, #donor-country-row').hide();
        break;
      case "faculty":
        $('#previous-university-row').show();
        $('#subject-row').show();
        $('#previous-college-row, #donor-country-row').hide();
        break;
      case "college":
        $('#previous-university-row').show();
        $('#previous-college-row').show();
        $('#subject-row, #donor-country-row').hide();
        break;
      case 'charity_buffer':
        $('#donor-country-row').show();
        $('#subject-row, #previous-university-row, #previous-college-row').hide();
        break;

    }


});
  $(document).on('click', '#verify', function(){
    var address_zip = $('input#address_zip').val();
    var address_line1 =  $('input#address_line1').val();
    if (address_zip === '' || address_line1=== ''){
      $('.address-error').show();
    }
    else{
      var addressData = {
        "address_line1": $('input#address_line1').val(),
        "address_zip": $('input#address_zip').val(),
        "address_city": $('input#address_city').val(),
        "billing_country": $('#billing_country').val(),
      };
      var bufferData = {
        'buffer_type': $('select#buffer_type').val()
      };
      var formData = {

      };
      checkIfVisibleToken($('input[name=previous_university]'), formData);
      checkIfVisible($('input[name=college]'), formData);
      checkIfVisibleToken($('input[name=subject]'), formData);
      checkIfVisibleToken($('input[name=country_of_residence]'), formData);
      $.post('/signup/institution/save', bufferData, function(data){
        $.post('/signup/user/save', formData, function(data){
          $.post('/signup/address', addressData, function(data){
            window.location = '/user/authorize';
          });
        });
      });


    }
  });
  function checkIfVisibleToken($element, formData){
    var $element_id = $element.attr('id');
    if($('#token-input-' +$element_id).is(':visible')){
      var $element_name = $element.attr('name');
      $element.val().split(',');
      formData[$element_name] = $element.val().split(',');
    }
  }

  function checkIfVisible($element, formData){
    if($element.is(':visible')){
      var $element_name = $element.attr('name');
      $element.val().split(',');
      formData[$element_name] = $element.val().split(',');
    }
  }

});
