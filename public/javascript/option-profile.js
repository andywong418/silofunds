$(document).ready(function(){
  String.prototype.capitalize= function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
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
      console.log('is it in here?')
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  })

  var EligibilityDisplay = Backbone.View.extend({
    el: '.eligibility-display',
    initialize: function(){
        var fields = ['subject','religion','minimum_age','maximum_age','gender','merit_or_finance', 'target_university', 'target_degree', 'required_degree', 'required_university', 'required_grade','target_country', 'country_of_residence', 'specific_location','other_eligibility'];
        var subjects = ['math', 'science', 'law', 'sports', 'music', 'humanity', 'foreign languages', 'economics', 'arts', 'computing'];
        var science = ['physics', 'chemistry', 'biology','earth science','materials science','oceanography','astronomy','atmospheric science','engineering'];
        var humanities = ['anthropology', 'communication studies','education','geography',	'history','linguistics','political science','psychology','sociology', 'english'];
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
        for (var j =0 ; j < fields.length; j++){
          switch(fields[j]){
            case 'subject':
              var scienceCounter = 0;
              var humanitiesCounter = 0;
              var foreignLanguagesCounter = 0;
              var mathsCounter = 0;
              var computingCounter = 0;
              var artCounter = 0;
              var otherCounter = 0;
              if(fund[fields[j]]){
                for(var i =0; i < subject.length; i++){
                  if(science.indexOf(subject[i]) > -1){
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
                    console.log(subject[i]);
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
                  else if (subject[i].toLowerCase() == 'economics'){
                    var imageModel = new ImageModel({
                      imageSource: '/images/subject_economics.png',
                      criteria: subject[i],
                      section: "Economics"
                    })
                    var view = new ImageView({model: imageModel});
                    this.$('#subject-handler').append(view.render().el);
                    this.$('[data-toggle="tooltip"]').tooltip();
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
                      console.log(view);
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
                    religionCounter.$el.find('.criteria').append(", " + religion[i].capitalize());
                  }

                }
              }
              break;
            case 'minimum_age':
              if(fund['minimum_age']){
                var minimumAge = fund['minimum_age'];
                console.log(minimumAge);
                if(fund['maximum_age']){
                  var maximumAge = fund['maximum_age'];
                  var imageModel = new ImageModel({
                    imageSource: '',
                    criteria: '' + minimumAge + ' - ' + maximumAge,
                    section: 'age'
                  })
                  var view = new ImageView({model: imageModel});
                  this.$('#personal-handler').append(view.render().el);
                  noIcon();
                }
                else{
                  var imageModel = new ImageModel({
                    imageSource: '',
                    criteria: '' + minimumAge + '+',
                    section: 'age'
                  })
                  var view = new ImageView({model: imageModel});
                  this.$el.append(view.render().el);
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
                    criteria: '<' + maximumAge,
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
                    criteria: 'For intended study' + targetUniversityString.capitalize(),
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
                    criteria: 'Required degrees: ' + requiredDegreeString + ' <br> ' + "<span id = 'for'>For: </span> " + targetDegreeString,
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
            case 'required_grade':
              var requiredGrade = fund['required_grade'];
              var imageModel = new ImageModel({
                imageSource: '',
                criteria: 'Required Grade: ' + requiredGrade,
                section:'required grade'
              })
              var view = new ImageView({model: imageModel});
              this.$('#education-handler').append(view.render().el);
              noIcon();
              break;
            case 'target_country':
              var targetCountry = fund.target_country;
              if(targetCountry){
                for(var i =0; i < targetCountry.length; i++){
                  var imageModel = new ImageModel({
                    imageSource: '/images/128/' + targetCountry[i] + '.png',
                    criteria: 'For ' + targetCountry[i],
                    section: targetCountry[i]
                  });
                  var view = new ImageView({ model: imageModel });
                  this.$('#location-handler').append(view.render().el);
                  this.$('[data-toggle="tooltip"]').tooltip();
                }
              }

              break;
            case 'country_of_residence':
              var requiredCountry = fund.country_of_residence;
              if(requiredCountry){
                for(var i =0; i < requiredCountry.length; i++){
                  var imageModel = new ImageModel({
                    imageSource: '/images/128/' + requiredCountry[i] + '.png',
                    criteria: 'From ' + requiredCountry[i],
                    section: requiredCountry[i]
                  });
                  var view = new ImageView({ model: imageModel });
                  this.$('#location-handler').append(view.render().el);
                  this.$('[data-toggle="tooltip"]').tooltip();
                }
              }
              break;
            case 'specific_location':
              var specific_location = fund.specific_location;
              if(specific_location){
                for (var i =0; i<specific_location.length; i++){
                  var imageModel = new ImageModel({
                    imageSource: '/images/specific_location.svg',
                    criteria: specific_location,
                    section: 'Specific locations'
                  })
                  var view = new ImageView({ model: imageModel });
                  this.$('#location-handler').append(view.render().el);
                  this.$('[data-toggle="tooltip"]').tooltip();
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
    }
  })
  var eligibilityDisplay = new EligibilityDisplay();

}
)
