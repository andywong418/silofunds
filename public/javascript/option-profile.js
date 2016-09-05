$(document).ready(function(){


  if(!user){
    showLimitedProfile();
  }
  if(user){
    $('#signup-modal-fade').hide();
  }
  function showLimitedProfile(){
    // Hide favourite
    $('#favourite').hide();
    $('#left_div').children().not('#box_1').css('opacity', '0.5');
    $('#right_div, #separator_1, #review_div').children().css('opacity', '0.5');
    $('#signup-block').show();
    var counter = 0;
    $(window).on('scroll', function() {

        var y_scroll_pos = window.pageYOffset;
               // set to whatever you want it to be
        if(y_scroll_pos > 300 && counter === 0) {
            //do stuff
            $('#signup-modal-fade').css('background-color', 'rgba(52, 54, 66, 0.9)');
            $('#not-now').show();
            $('#signup-button-div').css('margin-bottom', '30px');
            $('#signup-block').animate({top: '30%'}, 500);
            counter++;
        }

    });
    $('#not-now').click(function(){
      $('#signup-modal-fade').css('background-color', 'transparent');
      $('#not-now').hide();
      $('#signup-button-div').css('margin-bottom', '0px');
      $('#signup-block').animate({top: '65%'}, 500);
    });

  }

  $('input[name=fund_known]').click(function(){
    // $.post('/organisation/fund_known/' + fund.id, )
    var formData = {};
    if($(this).attr('value') === 'true'){
      formData.known = true;
    }
    if($(this).attr('value') == 'false'){
      formData.known = false;
    }
    $.post('/organisation/fund_known/' + fund.id, formData, function(data){
      $('.container-block').html('Thank you very much for your feedback.');
      $('.alert-known').fadeOut(10000);
    });
  });
  if(user && user.organisation_or_user != fund.organisation_id){
    $('div#big_flex_div').css('margin-top', '0px');
  }

  Array.prototype.capitalize = function(){
    var emptyArray = [];
    this.forEach(function(element){
      element = element.charAt(0).toUpperCase() + element.slice(1);
      emptyArray.push(element);
    });
    return emptyArray;
  };

  // Improve eligibility calculator function checkSubjectField()
  function checkUniversity(fundArray, userArray){
    var ukUniversities = universities.ukUniversities;
    var usUniversities = universities.usUniversities;
    var irishUniversities = universities.irishUniversities;
    var diff = [];
    if(fundArray.indexOf('all') > -1){
      diff.push('all');
    }
    if(fundArray.indexOf('uk university') > -1){
       diff = ukUniversities.filter(function(x) { return userArray.indexOf(x) > -1; });
    }
    if(fundArray.indexOf('us university') > -1){
      diff = usUniversities.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(fundArray.indexOf('irish university') > -1){
      diff = irishUniversities.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(diff && diff.length >0 ){
      return true;
    }
    if(!diff && diff.length === 0){
      return false;
    }
  }
  function checkSubject(fundArray, userArray){
    var education = subjects.education;
    var modernLanguages = subjects.modernLanguages;
    var humanities = subjects.humanities;
    var arts = subjects.arts;
    var socialSciences = subjects.socialSciences;
    var sciences = subjects.sciences;
    var diff = [];
    if(fundArray.indexOf('all') > -1){
      diff.push('all');
    }
    if(fundArray.indexOf('education') > -1){
      diff = education.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(fundArray.indexOf('modern languages') > -1){
      diff = modernLanguages.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(fundArray.indexOf('humanities') > -1){
      diff = humanities.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(fundArray.indexOf('arts') > -1 || fundArray.indexOf('art') > -1){
      diff = arts.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(fundArray.indexOf('social sciences') > -1|| fundArray.indexOf('social science') > -1){
      diff = socialSciences.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    // Curiour with social science -- FIX!
    if(fundArray.indexOf('sciences') > -1 || fundArray.indexOf('science') > -1 ){
      diff = sciences.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(diff && diff.length >0 ){
      return true;
    }
    if(!diff && diff.length === 0){
      return false;
    }
  }

  function checkDegree(fundArray, userArray){
    //consider whether people with undergraduate and postgraduate need to be considered, etc
    var allDegrees = degrees.degrees;
    var undergradDegrees = degrees.undergradDegrees;
    var gradDegrees = degrees.gradDegrees;
    var diff = [];
    if(fundArray.indexOf('all') > -1){
      diff.push('all');
    }
    if(fundArray.indexOf('undergraduate') > -1 || fundArray.indexOf('bachelor') > -1){
      diff = undergradDegrees.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(fundArray.indexOf('postgraduate') > -1 || fundArray.indexOf('masters') > -1 || fundArray.indexOf('phd') > -1){
      diff = gradDegrees.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }

    if(diff && diff.length >0 ){
      return true;
    }
    if(!diff && diff.length === 0){
      return false;
    }

  }
  function checkCountry(fundArray, userArray){
    var allCountries = allFields.countries;
    var africanCountries = countries.africanCountries;
    var euCountries = countries.euCountries;
    var meCountries = countries.meCountries;
    var asianCountries = countries.asianCountries;
    var diff = [];
    if(fundArray.indexOf('all') > -1){
      diff.push('all');
    }
    if(fundArray.indexOf('uk') > -1){
      if(userArray.indexOf('United Kingdom') > -1 || userArray.indexOf('united kingdom') > -1){
        diff.push('United Kingdom');
      }
    }
    if(fundArray.indexOf('non uk') > -1 || fundArray.indexOf('not UK') < -1 || fundArray.indexOf('non UK')> -1 && fundArray.indexOf('not uk') > -1){
      diff = allCountries.filter(function(x){
        return userArray.indexOf(x) && x != 'United Kingdom';
      });
    }
    if(fundArray.indexOf('non us') > -1 || fundArray.indexOf('not US') < -1 || fundArray.indexOf('non US')> -1 && fundArray.indexOf('not us') > -1){
      diff = allCountries.filter(function(x){
        return userArray.indexOf(x) && x != 'United States of America';
      });
    }
    if(fundArray.indexOf('africa') > -1){
      diff = africanCountries.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(fundArray.indexOf('middle east') > -1){
      diff = meCountries.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(fundArray.indexOf('eu') > -1 || fundArray.indexOf('european union') > -1){
      diff = euCountries.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    if(fundArray.indexOf('asia') > -1){
      diff = asianCountries.filter(function(x){
        return userArray.indexOf(x) > -1;
      });
    }
    var newArray = notHandler(fundArray, userArray,'EU',  allCountries, euCountries, diff);
    if(newArray.length > 0){
      diff.push(newArray);
    }
    var anotherArray = countryNotHandler(fundArray, userArray);
    if(anotherArray.length > 0){
      diff.push(anotherArray);
    }
    if(diff && diff.length >0 ){
      return true;
    }
    if(!diff && diff.length === 0){
      return false;
    }
  }

  function notHandler(fundArray, userArray, string, allField, notField,  diff){
    var newArray = [];
    fundArray.forEach(function(element, index, array){
      if(element.indexOf('not ' + string) > -1 || element.indexOf('non ' + string) > -1){
        diff = allField.filter(function(x){
          return userArray.indexOf(x) > -1 && notField.indexOf(x) < 0;
        });
        newArray.push(diff);
      }
    });
    return newArray;
  }
  function countryNotHandler(fundArray, userArray){
    var allCountries = allFields.countries;
    var newArray = [];
    fundArray.forEach(function(element, index, array){
      if(element.indexOf('not') > -1 || element.indexOf('non') > -1){
          var country = element.split(' ')[1].capitalize();
          var diff = allCountries.filter(function(x){
            return userArray.indexOf(x) > -1 && x != country;
          });
          newArray.push(diff);


      }
    });
    return newArray;
  }
  function checkIfElementInArray(fundArray, userArray, field){
    var counter = 0;
    if(userArray && fundArray){
      if(field == 'universities'){
        if(checkUniversity(fundArray, userArray)){
          counter++;
        }
      }
      if(field == 'subjects'){
        if(checkSubject(fundArray, userArray)){
          counter++;
        }
      }
      if(field == 'degrees'){
        if(checkDegree(fundArray, userArray)){
          counter++;
        }
      }
      if(field == 'countries'){
        if(checkCountry(fundArray, userArray)){
          counter++;
        }
      }
      userArray.forEach(function(element, index, array){
        fundArray.forEach(function(fundElement, fundIndex, fundArray){
          //checking for substrings as well
          fundElement = fundElement.toLowerCase();
          element = element.toLowerCase();
          if(fundArray.indexOf(element) > -1 || userArray.indexOf(fundElement) > -1 || fundElement.indexOf(element) > -1 || element.indexOf(fundElement) > -1){
            counter++;
          }
        });
      });
    }

    if(counter == 0){
      return false;
    }
    else{
      return true;
    }
  }
  String.prototype.capitalize= function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  function checkImage(imageSrc, imageCountry, good, bad) {
    var img = new Image();
    img.onload = good;
    img.onerror = bad;
    img.src = imageSrc;
    img.country = imageCountry;
}

  function noIcon(){
    $('*[id*=icon-image]:visible').each(function() {
      if($(this).attr('src').length === 0){
        $(this).parent().css('margin-top', '15px');
        $(this).css('display', 'none');
      }
    });
  }
  function returnStringfromArray(array){
    var emptyString = '';
    // Case 1: arr has 1 value
    if (array.length === 1) {
      return array[0];
    }
    reverseArray = array.reverse();
    // Case 2: arr > 1
    for (var i = 0; i < reverseArray.length; i++){
      // Handle 1st string
      if (i === 0) {
        emptyString = reverseArray[i] + emptyString;
      }

      // Handle 2nd string
      else if (i === 1) {
        emptyString = reverseArray[i] + " or " + emptyString;
      }


      // Handle rest
      else {
        emptyString = reverseArray[i] + ', ' + emptyString;
      }

    }
    return emptyString;
  }
  function returnStringfromArray2(array){
    var emptyString = '';
    // Case 1: arr has 1 value
    if(array){
      if (array.length === 1) {
        return array[0];
      }
      reverseArray = array.reverse();
      // Case 2: arr > 1
      for (var i = 0; i < reverseArray.length; i++){
        // Handle 1st string
        if (i === 0) {
          emptyString = reverseArray[i] + emptyString;
        }

        // Handle 2nd string
        else if (i === 1) {
          emptyString = reverseArray[i] + " and " + emptyString;
        }


        // Handle rest
        else {
          emptyString = reverseArray[i] + ', ' + emptyString;
        }

      }
      return emptyString;
    }
    else{
      return false;
    }

  }
  var reformatDate = function(date) {
    if(date){
      date = date.split('T')[0];
      date = new Date(date);
      return date.toDateString();
    }

  };

  var NotEligibleModel = Backbone.Model.extend();
  var NotEligibleView = Backbone.View.extend({
    tagName: 'div',
    id: 'notEligible-handler',
    template: _.template($('#notEligible-template').html()),
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this; // enable chained calls
    }

  })
  function notEligible(criteriaDescription, userInfoDescription, criteria, userCriteria){

    $('#eligibility_div').css('display', 'block');
    $('#eligibility_div').css('background-color', 'rgb(236, 198, 44)');
    $('p#eligibility_div_p ').html('You may not be eligible for this fund - click this bar to learn why. <a id="ignore"> Ignore for now </a>');
    $(document).on('click', '#eligibility_div', function(e){
      $('#notEligible').css('display', 'block');
      //add criteria to explanation modal
      var NotEligibleDisplay = Backbone.View.extend({
        el: '.modal-container',
        events:{
          'click #notEligible-handler': 'preventClose'
        },
        initialize: function(){
          var model = new NotEligibleModel({
            requirement_description: 'Fund ' + criteriaDescription,
            requirement: criteria,
            user_description: 'Your ' +  userInfoDescription,
            user: userCriteria
          })
          var view = new NotEligibleView({model: model});
          this.$el.append(view.render().el);
        },
        preventClose: function(e){
          e.preventDefault();
          e.stopPropagation();
        }
      });
      var notEligibleDisplay = new NotEligibleDisplay();
    });


      $(document).on('click', '#ignore', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('#eligibility_div').hide(500);
        $('.application_form').css('margin-top', '6%');
        $('#notEligible').css('display', 'none');
        $("div[id*=notEligible-handler]").remove();
      });

  };
  $('*').not('#notEligible').click(function(e){
    if($('#notEligible').is(':visible')){
      $('#notEligible').css('display', 'none');
      $("div[id*=notEligible-handler]").remove();

    }
  });
  $(document).on('click', '#notEligible', function(e){
    e.preventDefault();
    e.stopPropagation();
  });
  if(favourite){
    $('#favourite').addClass('active-favourite');
  }
  $('#favourite').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    if(favourite){
      $('#favourite:before').css("content", "");
      $('#favourite').removeClass('active-favourite');
      var formData = {
        user_id: user.id,
        fund_id: fund.id,
      };
      $.post('/user/remove-favourite/', formData, function(data){
      });
      favourite = false;
    }
    else{

      if(user && user.organisation_or_user == null){
        $('#favourite').addClass('active-favourite');
        favourite = true;
        var formData = {
          user_id: user.id,
          fund_id: fund.id
        };
        $.post('/user/add-favourite/', formData, function(data){
        });
      }
    }
  });

  if(user){
    if(!user.organisation_or_user){
      $('.application_form').css('margin-top', '3%');
      var age;
      if(user.date_of_birth){
        var myDate = user.date_of_birth.split("-");
        var yearFix= myDate[2].split("T");
        var day = yearFix[0];
        var newDate = myDate[1]+"/"+day+"/"+ myDate[0];
        var birthDate = new Date(newDate).getTime();
        var nowDate = new Date().getTime();
        age = Math.floor((nowDate - birthDate) / 31536000000 );
      }

      var userFields = [age, 'country_of_residence', 'religion', 'subject', 'previous_degree', 'previous_university'];
      var nonEligibleCounter = 0;
      if(fund.minimum_age){
        if(age < fund.minimum_age){
          notEligible('minimum age', 'age',fund.minimum_age, age);
          nonEligibleCounter++;
        }

      }
      if(fund.maximum_age){
        if(age > fund.maximum_age){
          notEligible('maximum age','age',fund.maximum_age, age);
          nonEligibleCounter++;
        }

      }
      if(fund.country_of_residence){
        if(fund.country_of_residence.length > 0){
          if(user.country_of_residence){
            if(!checkIfElementInArray(fund.country_of_residence, user.country_of_residence, 'countries')){
                  notEligible('required countries', 'country_of_residence',fund.country_of_residence.capitalize().join(', '), user.country_of_residence);
                  nonEligibleCounter++;
            }
          }
        }
      }
      if(fund.religion){
        if(fund.religion.length > 0){
           if(fund.religion.indexOf(user.religion) == -1){
             notEligible('required religions', 'religion', fund.religion.capitalize().join(', '), user.religion);
             nonEligibleCounter++;
           }

         }
      }
      if(fund.subject){
        if(fund.subject.length > 0){
          if(!checkIfElementInArray(fund.subject, user.subject, 'subjects')){
            if(user.subject){

              notEligible('required subjects', 'subject',fund.subject.capitalize().join(', '), user.subject.capitalize().join(', '));
              nonEligibleCounter++;
            }

          }
       }
      }
      if(fund.required_degree){
        if(fund.required_degree.length > 0){
          if(!checkIfElementInArray(fund.required_degree, user.previous_degree, 'degrees')){
            if(user.previous_degree){
              notEligible('required degrees','degrees', fund.required_degree.capitalize().join(', '), user.previous_degree.capitalize().join(', '));
               nonEligibleCounter++;
            }

          }
       }
      }
      if(fund.required_university){
        if(fund.required_university.length > 0){
          if(!checkIfElementInArray(fund.required_university, user.previous_university, 'universities')){
            if(user.previous_university){
              notEligible('required universities', 'university', fund.required_university.capitalize().join(', '), user.previous_university.capitalize());
              nonEligibleCounter++;
            }

          }

        }
      }

      if(nonEligibleCounter == 0){
        $('#eligibility_div').css('display', 'block');
        $('#eligibility_div').css('background-color', '#27ae60');
        $('p#eligibility_div_p ').html('You are eligible for this fund');

      }

    }
    if(user.organisation_or_user == fund.organisation_id){
      $('#big_flex_div').css('padding-top', '50px');
      $('.alert').css('display', 'block');

    }
  }
  if(fund.description){
    $('.fundBio').html(fund.description);
    $('.fundBio').find('*').css('font-size', '15px');
    $('.fundBio').find('*').css('font-family', 'PT Sans');
    $('.fundBio').find('*').css('line-height', '1.5');
    $('.fundBio').find('*').css('background-color', '#e9f0f4');
    if($('.fundBio').find('.container')){
      $('.fundBio').find('.container').removeClass('.container');
    }
    var paragraphs = $('#fundBio').find('p');
    for (var i =0; i < paragraphs.length; i++ ){
      if(paragraphs[i].innerHTML == '&nbsp;'){
        var parent = document.getElementById('fundBio');
        try{
          parent.removeChild(paragraphs[i]);
        }
        catch(err){
        }

      }

    }
  }
  var subject = fund['subject'];
  var ImageModel = Backbone.Model.extend();

  var ImageView = Backbone.View.extend({
    tagName:'div',
    id:'criteria-handler',
    template: _.template($('#image-template').html()),
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this; // enable chained calls
    }
  })

  var OtherEligibilityView = Backbone.View.extend({
    tagName: 'div',
    id: 'other-criteria-handler',
    template: _.template($('#other-eligibility-template').html()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  })

  var EligibilityDisplay = Backbone.View.extend({
    el: '.eligibility-display',
    initialize: function(){
        var fields = ['subject','religion','merit_or_finance','minimum_age','maximum_age','gender', 'target_university', 'target_degree', 'required_degree', 'required_university', 'required_grade','target_country', 'country_of_residence', 'specific_location','other_eligibility'];
        // var subjects = ['math', 'science', 'law', 'sports', 'music', 'humanity', 'foreign languages', 'economics', 'arts', 'computing'];
        var science = subjects.sciences;
        console.log(science);
        var humanities = subjects.humanities;
        var socialSciences = subjects.socialSciences;
        console.log(socialSciences);
        var arts = subjects.arts;
        var foreignLanguages = ['Dari Persian', 'Pashtu', 'Albanian', 'Greek',
'Arabic', 'French', 'Berber dialects','Catalán',  'Castilian', 'Portuguese','Bantu','Spanish', 'Italian',
'German','Armenian', 'Yezidi', 'Russian','German', 'Slovene', 'Croatian', 'Hungarian','Turkic','Creole', 'Arabic','Farsi',
'Urdu','Bangla','Belorussian','Dutch','Mayan', 'Garifuna','Benin','Fon', 'Yoruba','Dzongkha','Quechua', 'Aymara',
'Bosnian', 'Serbian','Setswana', 'Kalanga','Sekgalagadi','Malay','Chinese','Bulgarian','Turkish', 'Roma','Kirundi',
'Swahili','Khmer','Criuolo','Sangho','Sara','China	Standard Yue (Cantonese)', 'Wu (Shanghaiese)', 'Minbei (Fuzhou)', 'Minnan', 'Xiang', 'Gan', 'Hakka',
'Shikomoro','Lingala', 'Kingwana', 'Kikongo', 'Tshiluba','Monokutuba', 'Kikongo','Greek','Czech','Danish', 'Faroese', 'Greenlandic',
'Somali', 'Afar','Tetum', 'Bahasa Indonesia', 'Galole', 'Mambae', 'Kemak','Quechua','Nahua','Fang', 'Bubi', 'Ibo',
'Tigre and Kunama', 'Tigrinya','Estonian','Amharic', 'Tigrigna', 'Orominga', 'Guaragigna','Fijian',' Hindustani',
'Finnish','Swedish', 'Myene', 'Nzebi', 'Bapounou/Eschira','Bandjabi','Mandinka', 'Wolof', 'Fula',
'Georgian','Abkhaz','Akan','Moshi-Dagomba','Ewe','Ga','French patois','Quiche', 'Cakchiquel', 'Kekchi', 'Mam', 'Garifuna','Xinca',
'Malinké', 'Susu', 'Fulani','Criolo','Hungarian','Icelandic',
'Bengali', 'Gujarati', 'Kashmiri', 'Malayalam', 'Marathi', 'Oriya', 'Punjabi', 'Tamil', 'Telugu','Kannada',
'Assamese', 'Sanskrit', 'Sindhi','Hindi','Javanese','Persian', 'Turkic', 'Kurdish', 'Luri', 'Balochi','Assyrian',
'Irish','Hebrew','Jamaican Creole','Japanese','Kazak','I-Kiribati','Korean','Kyrgyz','Lao',
'Latvian','Lithuanian','Sesotho','Zulu', 'Xhosa','Polish','Luxermbourgish','Macedonian','Malagasy',
'Chichewa', 'Chinyanja', 'Chiyao', 'Chitumbuka', 'Chisena', 'Chilomwe', 'Chitonga',
'Bahasa Melayu','Tamil', 'Telugu', 'Malayalam', 'Panjabi', 'Thai','Maldivian Dhivehi',
'Bambara','Maltese','Marshallese','Hassaniya Arabic','Pulaar','Soninke', 'Wolof','Bojpoori',
'Chukese', 'Pohnpeian', 'Yapase', 'Kosrean', 'Ulithian', 'Woleaian', 'Nukuoro', 'Kapingamarangi',
'Moldovan', 'Russian', 'Gagauz','Monégasque','Mongolian','Montenegrin','Berber dialects',
'Emakhuwa', 'Xichangana', 'Elomwe', 'Cisena', 'Echuwabo','Burmese','Afrikaans','Nauruan',
'Nepali', 'Maithali', 'Bhojpuri','Tharu', 'Tamang','Maori','Hausa','Djerma',
'Norwegian', 'Sami','Baluchi',
'Siraiki', 'Pashtu', 'Balochi', 'Hindko', 'Brahui', 'Burushaski',
'Palauan','Sonsoralese', 'Tobi', 'Angaur','Filipino',
'Tok Pisin','Hiri Motu','Guaraní','Quéchua','Aymara','Mirandese','Kinyarwanda', 'Kiswahili',
'Wolof', 'Pulaar', 'Jola','Seselwa Creole','Mende','Temne', 'Krio','Ukrainian',
'Melanesian pidgin','IsiZulu', 'IsiXhosa', 'Sepedi','Sesotho', 'Xitsonga','Galician','Basque','Sinhala','Nubian', 'Ta Bedawie',
'Surinamese','siSwati','Aramaic', 'Circassian','Taiwanese','Tajik',
'Ewé', 'Min','Kabyé','Dagomba','Tongan','Dimli', 'Azeri', 'Kabardian','Turkmen','Uzbek','Tuvaluan','Samoan','Kiribati',
'Ganda', 'Welsh', 'Scots Gaelic',
'Bislama','Latin','Vietnamese',	'Hassaniya Arabic', 'Moroccan Arabic','Bemba', 'Kaonda', 'Lozi', 'Lunda','Luvale',
'Nyanja', 'Tonga', 'Shona', 'Ndebele'];
var locationCounter = 0;
        for (var j =0 ; j < fields.length; j++){
          switch(fields[j]){
            case 'subject':
              var scienceCounter = 0;
              var humanitiesCounter = 0;
              var foreignLanguagesCounter = 0;
              var socialSciencesCounter = 0;
              var mathsCounter = 0;
              var computingCounter = 0;
              var artCounter = 0;
              var otherCounter = 0;
              if(fund[fields[j]]){
                for(var i =0; i < subject.length; i++){
                  if(subject[i] === 'all'){
                    break;
                  }
                  if(science.indexOf(subject[i].capitalize()) > -1 || subject[i].toLowerCase().indexOf('science') > -1 ){
                    if(scienceCounter == 0){
                      var imageModel = new ImageModel({
                        imageSource: '/images/subject_science.png',
                        criteria: subject[i],
                        section: 'Science subjects'
                      })
                      var view = new ImageView({model: imageModel});
                      this.$('#subject-handler').append(view.render().el);
                      scienceCounter = view;
                      this.$('[data-toggle="tooltip"]').tooltip();
                    }
                    else{
                      scienceCounter.$el.find('.criteria').append(", " + subject[i].capitalize());
                    }
                  }
                  else if(humanities.indexOf(subject[i]) > -1){
                    if(humanitiesCounter ==0){
                      var imageModel = new ImageModel({
                        imageSource: '/images/subject_humanities.png',
                        criteria: subject[i],
                        section: 'Humanities subjects',
                      })
                      var view = new ImageView({model: imageModel});
                      this.$('#subject-handler').append(view.render().el);
                      humanitiesCounter = view;
                      this.$('[data-toggle="tooltip"]').tooltip();
                    }
                    else{
                      humanitiesCounter.$el.find('.criteria').append(", " + subject[i].capitalize());
                    }

                  }
                  else if(foreignLanguages.indexOf(subject[i].capitalize()) > -1){
                    if(foreignLanguagesCounter == 0){
                      var imageModel = new ImageModel({
                        imageSource: '/images/subject_flang.png',
                        criteria: subject[i],
                        section: 'Foreign Languages'
                      })
                      var view = new ImageView({model: imageModel});
                      this.$('#subject-handler').append(view.render().el);
                      foreignLanguagesCounter = view;
                      this.$('[data-toggle="tooltip"]').tooltip();
                    }
                    else{
                      foreignLanguagesCounter.$el.find('.criteria').append(", " + subject[i].capitalize());
                    }
                  }
                  else if(subject[i].indexOf('math') > -1){
                    if(mathsCounter == 0){
                      var imageModel = new ImageModel({
                        imageSource: '/images/subject_maths.png',
                        criteria: subject[i],
                        section: "Maths subjects"
                      })
                      var view = new ImageView({model: imageModel});
                      this.$('#subject-handler').append(view.render().el);
                      mathsCounter = view;
                      this.$('[data-toggle="tooltip"]').tooltip();
                    }
                    else{
                      mathsCounter.$el.find('.criteria').append(", " + subject[i].capitalize());
                    }
                  }
                  else if(subject[i].toLowerCase() == 'sport'){
                    var imageModel = new ImageModel({
                      imageSource: '/images/subject_sports.png',
                      criteria: subject[i],
                      section: 'Sports'
                    })
                    var view = new ImageView({model: imageModel});
                    this.$('#subject-handler').append(view.render().el);
                    this.$('[data-toggle="tooltip"]').tooltip();
                  }
                  else if(subject[i].toLowerCase() == 'music'){
                    var imageModel = new ImageModel({
                      imageSource: '/images/subject_music.png',
                      criteria: subject[i],
                      section: "Music"
                    })
                    var view = new ImageView({model: imageModel});
                    this.$('#subject-handler').append(view.render().el);
                    this.$('[data-toggle="tooltip"]').tooltip();
                  }
                  else if(socialSciences.indexOf(subject[i].capitalize()) > -1){
                    console.log(subject[i]);
                    if(socialSciencesCounter === 0){
                      var imageModel = new ImageModel({
                        imageSource: '/images/subject_economics.png',
                        criteria: subject[i],
                        section: "Social Sciences"
                      })
                      var view = new ImageView({model: imageModel});
                      this.$('#subject-handler').append(view.render().el);
                      socialSciencesCounter = view;
                      this.$('[data-toggle="tooltip"]').tooltip();
                    }

                  }
                  else if(subject[i].toLowerCase() == 'law'){
                    var imageModel = new ImageModel({
                      imageSource: '/images/subject_law.png',
                      criteria: subject[i],
                      section: "Law"
                    })
                    var view = new ImageView({model: imageModel});
                    this.$('#subject-handler').append(view.render().el);
                    this.$('[data-toggle="tooltip"]').tooltip();
                  }
                  else if(subject[i].toLowerCase().indexOf('compute') > -1){
                    if(computingCounter == 0){
                      var imageModel = new ImageModel({
                        imageSource: '/images/subject_computing.png',
                        criteria: subject[i],
                        section: 'Computing'
                      })
                      var view = new ImageView({model: imageModel});
                      this.$('#subject-handler').append(view.render().el);
                      computingCounter = view;
                      this.$('[data-toggle="tooltip"]').tooltip();
                    }
                    else{
                      computingCounter.$el.find('.criteria').append(", " + subject[i].capitalize());
                    }

                  }
                  else if(subject[i].toLowerCase().indexOf('art') > -1 || subject[i].toLowerCase() == 'drama'){
                    if(artCounter == 0){
                      var imageModel = new ImageModel({
                        imageSource: '/images/subject_arts.png',
                        criteria: subject[i],
                        section: 'Arts'
                      })
                      var view = new ImageView({model: imageModel});
                      this.$('#subject-handler').append(view.render().el);
                      artCounter = view;
                      this.$('[data-toggle="tooltip"]').tooltip();

                    }
                    else{
                      artCounter.$el.find('.criteria').append(", " + subject[i].capitalize());
                    }
                  }
                  else{
                    if(otherCounter == 0){
                      var imageModel = new ImageModel({
                        imageSource: '/images/subject_other.png',
                        criteria: subject[i],
                        section: 'Other subjects',
                      })
                      var view = new ImageView({model: imageModel});
                      this.$('#subject-handler').append(view.render().el);
                      otherCounter = view;
                      this.$('[data-toggle="tooltip"]').tooltip();
                    }
                    else{
                      otherCounter.$el.find('.criteria').append(", " + subject[i].capitalize());
                    }

                  }

                }

              }
              break;
            case 'religion':
              var religion= fund['religion'];
              var religionCounter = 0;
              if(religion){
                for(i=0; i< religion.length; i++){
                  if(religionCounter == 0){
                    var imageModel = new ImageModel({
                      imageSource: '/images/religion.svg',
                      criteria: religion[i],
                      section: 'Religion'
                    })
                    var view = new ImageView({model: imageModel});
                    this.$('#personal-handler').append(view.render().el);
                    religionCounter = view;
                    this.$('[data-toggle="tooltip"]').tooltip();
                  }
                  else{
                    view.$el.find('.criteria').append(", " + religion[i].capitalize());
                    religionCounter++;
                  }

                }
              }
              break;
            case 'minimum_age':
              if(fund['minimum_age']){
                var minimumAge = fund['minimum_age'];

                if(fund['maximum_age']){
                  var maximumAge = fund['maximum_age'];
                  var imageModel = new ImageModel({
                    imageSource: '',
                    criteria: 'Ages:  ' + minimumAge + ' - ' + maximumAge,
                    section: 'age'
                  })
                  var view = new ImageView({model: imageModel});
                  this.$('#personal-handler').append(view.render().el);
                  noIcon();
                }
                else{
                  var imageModel = new ImageModel({
                    imageSource: '',
                    criteria: 'Ages: ' + minimumAge + '+',
                    section: 'age'
                  })
                  var view = new ImageView({model: imageModel});
                  this.$('#personal-handler').append(view.render().el);
                  noIcon();
                }
              }
              break;
            case 'maximum_age':
              var maximumAge = fund['maximum_age'];
              if(maximumAge){
                if(!fund['minimum_age']){
                  var imageModel = new ImageModel({
                    imageSource: '',
                    criteria: 'Ages: <' + maximumAge,
                    section: 'age'
                  });
                  var view = new ImageView({model: imageModel});
                  this.$('#personal-handler').append(view.render().el);
                  noIcon()
                }
              }
              break;
            case 'gender':
              var gender = fund['gender'];
              if(gender){
                var imageModel = new ImageModel({
                  imageSource: '',
                  criteria: gender.capitalize() + ' only',
                  section: 'gender'
                })
                var view = new ImageView({model:imageModel});
                this.$('#personal-handler').append(view.render().el);
                noIcon();
              }
              break;
            case 'merit_or_finance':
              var merit_or_finance = fund['merit_or_finance'];
              if(merit_or_finance == 'merit'){
                var imageModel = new ImageModel({
                  imageSource: '/images/merit.png',
                  criteria: 'Merit',
                  section: 'Funding given on merit or finance?'
                })
                var view = new ImageView({model: imageModel});
                this.$('#personal-handler').append(view.render().el);
              }
              if(merit_or_finance == 'finance'){
                var imageModel = new ImageModel({
                  imageSource: '/images/finance.png',
                  criteria: 'Finance',
                  section: 'Funding given on merit or finance?'
                })
                var view = new ImageView({model: imageModel});
                this.$('#personal-handler').append(view.render().el);
                this.$('[data-toggle="tooltip"]').tooltip();

              }
              break;
            case 'target_university':
              var targetUniversity = fund['target_university'];
              var requiredUniversity = fund['required_university'];
              if(targetUniversity){
                var targetUniversityString = returnStringfromArray(targetUniversity);
                if(requiredUniversity){
                  requiredUniversityString = returnStringfromArray(requiredUniversity)
                  var imageModel = new ImageModel({
                    imageSource: '/images/university.png',
                    criteria: requiredUniversityString.capitalize() + " <br><span id= 'to'>to: </span>  " +targetUniversityString.capitalize(),
                    section: 'University'
                  })
                  var view = new ImageView({model: imageModel});
                  this.$('#education-handler').append(view.render().el);
                  this.$('[data-toggle="tooltip"]').tooltip();
                }
                else{
                  var imageModel = new ImageModel({
                    imageSource: '/images/university.png',
                    criteria: 'For intended study at: ' + targetUniversityString.capitalize(),
                    section: 'University'
                  })
                  var view = new ImageView({model: imageModel});
                  this.$('#education-handler').append(view.render().el);
                  this.$('[data-toggle="tooltip"]').tooltip();
                }
              }
              break;
            case 'required_university':
              var requiredUniversity = fund['required_university'];
              var targetUniversity = fund['target_university'];
              if(requiredUniversity){
                requiredUniversityString = returnStringfromArray(requiredUniversity);
                if(!targetUniversity){
                  var imageModel = new ImageModel({
                    imageSource: '/images/university.png',
                    criteria: 'From ' + requiredUniversityString.capitalize(),
                    section: 'University'
                  })
                  var view = new ImageView({model: imageModel});
                  this.$('#education-handler').append(view.render().el);
                  this.$('[data-toggle="tooltip"]').tooltip();
                }
              }
              break;
            case 'target_degree':
              var requiredDegree = fund['required_degree'];
              var targetDegree = fund['target_degree'];
              if(targetDegree){
                var targetDegreeString = returnStringfromArray(targetDegree);
                if(requiredDegree){
                  var requiredDegreeString = returnStringfromArray(requiredDegree);
                  var imageModel = new ImageModel({
                    imageSource: '/images/education.png',
                    criteria: '<span id = "required"> Required degrees: </span>' + requiredDegreeString + ' <br> ' + "<span id = 'for'>For: </span> " + targetDegreeString,
                    section: 'Degree specification'
                  })
                  var view = new ImageView({model: imageModel});
                  this.$('#education-handler').append(view.render().el);
                  this.$('[data-toggle="tooltip"]').tooltip();
                }
                else{
                  var imageModel = new ImageModel({
                    imageSource: '/images/education.png',
                    criteria: 'For: ' + targetDegreeString,
                    section: 'Degree specification'
                  })
                  var view = new ImageView({model: imageModel});
                  this.$('#education-handler').append(view.render().el);
                  this.$('[data-toggle="tooltip"]').tooltip();
                }
              }
              break;
            case 'required_degree':
              var requiredDegree = fund['required_degree'];
              if(requiredDegree){
                var requiredDegreeString = returnStringfromArray(requiredDegree);
                var imageModel = new ImageModel({
                  imageSource: '/images/education.png',
                  criteria: 'Required degrees: ' + requiredDegreeString,
                  section: 'Degree specification'
                })
                var view = new ImageView({model: imageModel});
                this.$('#education-handler').append(view.render().el);
                this.$('[data-toggle="tooltip"]').tooltip();
              }
              break;
            case 'required_grade':
              var requiredGrade = fund['required_grade'];
              if(requiredGrade){
                var imageModel = new ImageModel({
                  imageSource: '',
                  criteria: 'Required Grade: ' + requiredGrade,
                  section:'required grade'
                })
                var view = new ImageView({model: imageModel});
                this.$('#education-handler').append(view.render().el);
                noIcon();
              }

              break;
            case 'target_country':
              var targetCountry = fund.target_country;
              if(targetCountry){
                for(var i =0; i < targetCountry.length; i++){
                  if(targetCountry[i].toLowerCase() == 'all'){
                    break;
                  }
                  if(targetCountry[i].toLowerCase() == 'uk'){
                    targetCountry[i] = "United Kingdom";
                  }
                  if(targetCountry[i].toLowerCase() == 'eu'){
                    targetCountry[i] = "European Union";
                  }
                  if(targetCountry[i].toLowerCase() == 'us'){
                    targetCountry[i] = "United Sates of America";
                  }
                  checkImage('/images/128/' + targetCountry[i] + '.png', targetCountry[i], function(){
                    var imageModel = new ImageModel({
                      imageSource: this.src,
                      criteria: 'For study in ' + this.country,
                      section: this.country
                    });
                    var view = new ImageView({ model: imageModel });
                    $('#location-handler').append(view.render().el);
                    $('[data-toggle="tooltip"]').tooltip();
                  }, function(){
                    var imageModel = new ImageModel({
                      imageSource: '/images/128/flag_placeholder.svg',
                      criteria: 'For study in ' + this.country,
                      section: this.country
                    });

                    var view = new ImageView({ model: imageModel });
                    $('#location-handler').append(view.render().el);
                    $('[data-toggle="tooltip"]').tooltip();
                    $('img[src*="/images/128/flag_placeholder.svg"]').css('margin-top', '5px');
                    locationCounter++;
                  })
                }
              }

              break;
            case 'country_of_residence':
              var requiredCountry = fund.country_of_residence;
              if(requiredCountry){

                for(var i =0; i < requiredCountry.length; i++){
                  if(requiredCountry[i].toLowerCase() == 'all'){
                    break;
                  }
                  if(requiredCountry[i].toLowerCase() == 'uk'){
                    requiredCountry[i] = "United Kingdom"
                  }
                  if(requiredCountry[i].toLowerCase() == 'eu'){
                    requiredCountry[i] = "European Union"
                  }
                  if(requiredCountry[i].toLowerCase() == 'us'){
                    requiredCountry[i] = "United Sates of America"
                  }

                  checkImage('/images/128/' + requiredCountry[i] + '.png', requiredCountry[i], function(){
                    var imageModel = new ImageModel({
                      imageSource: this.src,
                      criteria: 'From ' + this.country,
                      section: this.country
                    });

                    var view = new ImageView({ model: imageModel });
                    $('#location-handler').append(view.render().el);
                    $('[data-toggle="tooltip"]').tooltip();
                  }, function(){
                    var imageModel = new ImageModel({
                      imageSource: '/images/128/flag_placeholder.svg',
                      criteria: 'From ' + this.country,
                      section: this.country
                    });

                    var view = new ImageView({ model: imageModel });
                    $('#location-handler').append(view.render().el);
                    $('[data-toggle="tooltip"]').tooltip();
                    $('img[src*="/images/128/flag_placeholder.svg"]').css('margin-top', '5px');
                    locationCounter++;
                  })

                }
              }
              break;
            case 'specific_location':
              var specific_location = fund.specific_location;
              if(specific_location){
                for (var i =0; i<specific_location.length; i++){
                  var imageModel = new ImageModel({
                    imageSource: '/images/specific_location.svg',
                    criteria: specific_location[i],
                    section: 'Specific locations'
                  })
                  var view = new ImageView({ model: imageModel });
                  this.$('#location-handler').append(view.render().el);
                  this.$('[data-toggle="tooltip"]').tooltip();
                  locationCounter++;
                }
              }
              break;
            case 'other_eligibility':
              var other_eligibility = fund.other_eligibility;
              if (other_eligibility) {
                var imageModel = new ImageModel({
                  criteria: other_eligibility,
                  section: 'Other eligibility requirements'
                });

                var view = new OtherEligibilityView({ model: imageModel });
                this.$('#other-handler').append(view.render().el);
                // view.$('.criteria-box').removeClass('col-md-4').addClass('col-md-12');
                // var section = view.model.get('section');
                // view.$('.criteria-box').prepend('<span data-toggle="tooltip" title="'+ section+'" class="glyphicon glyphicon-option-horizontal"></span>');
                this.$('[data-toggle="tooltip"]').tooltip();

              }
              break;
          }
        }
        if(!fund.subject){
          this.$('#subject-handler').css('display', 'none');
        }
        if(!fund.religion && !fund.minimum_age && !fund.maximum_age && !fund.gender && !fund.merit_or_finance){
          this.$('#personal-handler').css('display', 'none');
        }
        if(!fund.target_university && !fund.required_university && !fund.target_degree && !fund.required_grade && !fund.required){
          this.$('#education-handler').css('display','none');
        }
        if(!fund.target_country && !fund.country_of_residence && !fund.specific_location || locationCounter == 0){
          this.$('#location-handler').css('display','none');
        }
        if(!fund.other_eligibility){
          this.$('#other-handler').css('display', 'none')
        }
        this.$el.readmore({
          moreLink: '<div class="readmore"><i class="fa fa-chevron-down" aria-hidden="true"></i></div>',
          lessLink: '<div class="readless"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>',
          speed: 500
        });
    }
  })


  var ApplicationModel = Backbone.Model.extend();
  var ApplicationView = Backbone.View.extend({
    tagName: 'div',
    id: 'application-handler',
    template: _.template($('#application-process').html()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  var ApplicationDisplay = Backbone.View.extend({
    el: '.application_form',
    events: {
      'click #apply_now_link': 'addApplication'
    },
    initialize: function() {
      if(!fund.application_link){
        fund.application_link = fund.link;
      }
      var application_documents;
      if(fund.application_documents){
        if(fund.deadline){
          application_documents = returnStringfromArray2(fund.application_documents).capitalize() + ' are required by ' + reformatDate(fund.deadline);
        }else{
          application_documents = returnStringfromArray2(fund.application_documents).capitalize() + ' are required';
        }
      }
      var applicationModel = new ApplicationModel({
        application_decision_date : 'Application decisions are on ' + reformatDate(fund.application_decision_date),
        application_documents : application_documents,
        application_open_date : 'Applications open on ' + reformatDate(fund.application_open_date),
        interview_date : 'Interviews occur on ' + reformatDate(fund.interview_date),
        application_link : fund.application_link
      })

      var view = new ApplicationView({ model: applicationModel });
      if(!fund.application_documents){
        if(fund.deadline && view.model){
          view.model.set({
            application_documents: 'Deadline for applications are on ' + reformatDate(fund.deadline)
          })
        }
        else{
          this.$('#documents_deadline').css('display', 'none');
          this.$('#documents_deadline').next('p.arrow').css('display', 'none');
        }
      }
      if(!fund.deadline){
        if(fund.application_documents){
          view.model.set({
            application_documents: returnStringfromArray2(fund.application_documents).capitalize() + ' are required'
          })
        }
      }
      this.$el.append(view.render().el);


      var listOfBoxes = ['#start_date', '#documents_deadline', '#interviews'];
        if(this.$('#documents_deadline').is(":visible")){
          if(this.$('#documents_deadline').next().next().attr('id') == 'apply_now_link'){
            this.$('#documents_deadline').next('.arrow').css('display', 'none');
          }
        }
    },
    addApplication: function(e){
      e.preventDefault();
      var formData = {
        fund_id: fund.id
      }
      $.post('/user/add-application', formData, function(data){
        $('#application-notification').html(data);
        $('#application-notification').delay(3000).fadeOut('slow');
      })
    }
  })
  var TipsModel = Backbone.Model.extend({
    url: '/organisation/options/' + fund.id + '/tips'
  });
  var TipsView = Backbone.View.extend({
    tagName: 'div',
    id: 'tips-handler',
    template: _.template($('#tips-template').html()),
    initialize: function(){
      _.bindAll(this, "render");
      this.model.fetch({
        success: this.render
      })
    },
    render: function() {
      console.log("REDNEr", this.template(this.model.toJSON()))
      console.log(this.$el);
      this.$el.html(this.template(this.model.toJSON()));
      $("[id=tips-handler]").html(this.template(this.model.toJSON()));
      return this;
    }

  })
  var TipsDisplay = Backbone.View.extend({
    el: '#application-handler',
    initialize: function(){
      var tipsModel = new TipsModel();
      var view = new TipsView({model: tipsModel});
      this.$el.append(view.el);
      $("[id=application-handler]").append(view.el);
    }
  })

  var eligibilityDisplay = new EligibilityDisplay();
  var applicationFormDisplay = new ApplicationDisplay();
  var TipsDisplay = new TipsDisplay();

  // Updating profile profile_picture
  $('#fund_img_placeholder, #fundImage').click(function() {
    $('#photoUpdateModal').modal('toggle')
  })
  $(document).on('click', '#profile-picture', function(){
      $("input[id='my_file']").click();
  });
  $(document).on('change', "input[id='my_file']", function(e){
      if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
        $('#profile-picture')
          .attr('src', e.target.result)
          .width(250)
          .height(250);
        };
        var file = this.files[0];
        var data = new FormData();
        data.append('profile_picture', file);
        data.append('user', user.id);
        $.ajax({
          type: 'POST',
          url: "/signup/fund_signup/" + user.id,
          data: data,
          processData: false,
          contentType: false
        }).done(function(data){
          location.reload()
        });
        reader.readAsDataURL(this.files[0]);
        $("#add-profile").css("display", "none");
      }
  });

  noProfilePicDivResizer();
  displayTopBottomDivs();
  favouriteStarMargin();
  $(window).resize(function() {
    eligibility_divPaddingChange();
    noProfilePicDivResizer();
    displayTopBottomDivs();
    favouriteStarMargin();
  })
})

function eligibility_divPaddingChange() {
  if($(window).width() < 526 && $('#eligibility_div').css('background-color') == 'rgb(236, 198, 44)'){
    $('div#eligibility_div').css('padding-top', '4px');
  } else {
    $('div#eligibility_div').css('padding-top', '');
  }
}

function noProfilePicDivResizer() {
  if(!organisation.profile_picture) {
    $('.application_form').css('width', '100%')
    if($(window).width() <= 767) {
      $('#big_flex_div #left_div_desktop.desktop #box_1').css('display', 'none');
      $('#big_flex_div #left_div #box_2').css('padding-left', '0px');
      $('#box_2 a').css('width', '100%');
      $('#box_2 a').css('margin-bottom', '15px');
      $('#box_2 a').css('padding', '10px 20px 10px 30px');
      $('#box_2 a #favourite').css('margin-top', '-9px')
      $('#box_2 a #favourite').css('margin-left', '-26px')
    }
  }
}

function displayTopBottomDivs() {
  if(549 <= $(window).width() && $(window).width() <= 767) {
    $('#top_div_mobile').css('display', 'block')
    $('#bottom_div_mobile').css('display', 'block')
  } else if ($(window).width() > 767) {
    $('#top_div_mobile').css('display', 'none')
    $('#bottom_div_mobile').css('display', 'none')
  }
}

function favouriteStarMargin() {
  if(767 < $(window).width() && $(window).width() <= 1076) {
    var starMargin = 204 - $('#left_div').width() - 235
    $('.favourite').css('margin-left', starMargin)
  } else if (550 <= $(window).width() && $(window).width() <= 767 ) {
    if(organisation.profile_picture) {
      console.log('BUT ME HERE')
      $('.favourite.profile_picture.mobile').show();
      $('.favourite.profile_picture.mobile').css('margin-left', 0);
    } else {
      $('.favourite.profile_picture.mobile').hide();
    }
  } else if ($(window).width() > 1076) {
    $('.favourite').css('margin-left', '')
  }
}
