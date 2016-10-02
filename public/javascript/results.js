$(document).ready(function() {

//queryOptions for search
if(typeof query != 'undefined' && query){
  for(var field in query){
    $('.' + field).attr('value', query[field]);
    if(field == 'merit_or_finance'){
        $('#' + query[field]).attr("checked", "true");
    }
    if(field == 'gender'){
      $('#' + query[field]).attr("checked", "true");
    }
  }
}
$('span#tokenKey i').click(function(){
  var field = $(this).parent('#tokenKey').attr('class');
  if(field == 'tags'){
    $('input#text_search').val('');
  }
  $(this).closest('#tokenKey').fadeOut();
  $('input#advanced_' +field).val('');
});
// var viewPortWidth = $(window).width();
// $(window).resize(function(){
//   // if(viewPortWidth < 476){
//   //   $('.fund_title').css('font-size', '18px');
//   // }
// });
if(relevant_terms){
  var baseUrl = '/results?';
  for( var i = 0; i < relevant_terms.length; i++){
    var obj = relevant_terms[i];
    var key = Object.keys(obj)[0];
    var value = obj[key].split(' ');
    var valueString = '';
    for(var j = 0; j< value.length; j++){
      if(j == value.length - 1){
        valueString = valueString + value[j];
      }
      else{
        valueString = valueString + value[j] + '+';
      }

    }
    if( i == relevant_terms.length - 1){
      baseUrl = baseUrl + key+ '=' + valueString;
    }
    else{
      baseUrl = baseUrl + key + '=' + valueString + '&';
    }
  }
  $('a#suggester-link').attr("href", baseUrl);
}
function removeSort(url){
  var location = url.indexOf('sort_by');
  if(location > -1){
    return url.substring(0,location-1);
  }
  else{
    return url;
  }
}
removeSort(window.location.href);
$('#relevance-sort').attr('href', removeSort(window.location.href));
$('#deadline-sort').attr('href', removeSort(window.location.href) + '&sort_by=deadline');
$('#highest-amount-sort').attr('href', removeSort(window.location.href) + '&sort_by=highest_amount');
$('#lowest-amount-sort').attr('href', removeSort(window.location.href) + '&sort_by=lowest_amount');
switch(sort_by){
  case 'deadline':
    $('#deadline-sort').append("<i class = 'fa fa-check'></i>");
    break;
  case 'highest_amount':
    $('#highest-amount-sort').append("<i class = 'fa fa-check'></i>");
    break;
  case 'lowest_amount':
    $('#lowest-amount-sort').append("<i class = 'fa fa-check'></i>");
    break;
}
if(!sort_by){
  $('#relevance-sort').append("<i class = 'fa fa-check'></i>");
}
//show and hide past deadline funds
$('#show-all').html("Show all funds - including those which are expired");
var allShown = false;

  //Use modernizr to move search bar when screen is mobile
  // function doneResizing() {
  //   var form = document.getElementsByClassName("search_form");
  //   console.log("CHECKMATe");
  //   if(Modernizr.mq('screen and (min-width:720px)')) {
  //     // action for screen widths including and above 768 pixels
  //     $(".navbar-header").append(form);
  //   }
  //   else if(Modernizr.mq('screen and (max-width:720px)')) {
  //     // action for screen widths below 768 pixels
  //     $("#about").prepend(form);
  //   }
  //
  //   if(Modernizr.mq('screen and (max-width:851px)')) {
  //     $("#text_search").attr('placeholder', 'Subject, University, Degree level');
  //   }
  //   else if(Modernizr.mq('screen and (min-width:851px)')) {
  //     $("#text_search").attr('placeholder', 'Keywords-Subject, University, Degree level');
  //   }
  //
  //   if(user && Modernizr.mq('screen and (max-width:767px)')) {
  //     $('.navbar-header').css('float', 'left');
  //     $('.navbar-collapse.collapse').css('display', 'block');
  //     $('.navbar-toggle').css('display', 'none');
  //     $('.navbar-nav li').css('float', 'left');
  //     $('.navbar-nav li a').css('padding-top', '15px');
  //     $('.navbar-nav.navbar-right:last-child').css('margin-right', '-15px');
  //     $('.navbar-right').css('float', 'right');
  //     $('.navbar-nav').css('margin', '0');
  //     $('#container').css('padding-bottom', '5px');
  //   }
  // }
  //
  // var id;
  //
  // $(window).resize(function() {
  //   clearTimeout(id);
  //   id = setTimeout(doneResizing, 0);
  // });
  //
  // doneResizing();

  //fund display backbone stuff
  var FundModel = Backbone.Model.extend({
    defaults: {
      fund_title: '',
      maximum_amount: 0,
      minimum_age: 0,
      maximum_age: 0,
      fund_id: 0,
      description: '',
      fund_link: '',
      country_of_residence: [],
      application_link: '',
      link: '',
      tags: [],
      religion: [],
      gender: '',
      subject: [],
      target_degree: [],
      target_university: [],
      target_country: [],
      required_degree: [],
      required_university: [],
      merit_or_finance: '',
      deadline: ''
    }
  });
  var FundCollection = Backbone.Collection.extend({
    model: FundModel
  });

  var FundView = Backbone.View.extend({
    tagname: 'div',
    class: 'lazyload',
    template: _.template($('#fund-template').html()),
    initialize: function(){
      this.render();
      this.lazyLoad();
    },
    events: {
      'click .fund_link a': 'addApplication'
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this; // enable chained calls
    },
    fundDisplay: function(){
      var scope = this;
      // Do the date
      // var dateNow = new Date();
      // dateNow = reformatDate(dateNow.toISOString());
      var deadline = this.model.get('deadline');
      var id = this.model.get('id');
      var tags = this.model.get('tags');
      var countries = this.model.get('country_of_residence');
      var subjects = this.model.get('subject');
      var minimum_amount = this.model.get('minimum_amount');
      var maximum_amount = this.model.get('maximum_amount');
      var minimum_age = this.model.get('minimum_age');
      var maximum_age = this.model.get('maximum_age');
      if(deadline){
        var dateNow = moment();
        deadline = moment.utc(deadline, "DD-MM-YYYY");
        if (dateNow.isAfter(deadline) && allShown){
          this.$('.deadline-passed' + id).css('display', 'block');
          this.$('.deadline-passed' + id).closest('.fund_list').children().css('opacity', '0.4');

        }
        if(dateNow.isAfter(deadline) && !allShown){
          this.$('.fund_list').hide();
        }
      }
      else{
        this.$('.deadline'+ id).hide();
      }

      if (!subjects) {
          this.$(".fund_subjects" + id).hide();
      } else {
          var allSubjects = subjects.indexOf('all');
          if(allSubjects > -1){
            subjects[allSubjects] = 'All subjects';
          }
          for (var y = 0; y < subjects.length; y++) {
              var searchTags = subjects[y].split(" ").join("+");
              this.$(".fund_subjects" + id).append("<span class = 'badge badge-tags'><a class='display' href= '/results?subject=" + searchTags + "'>" + subjects[y] + "</a></span>");
          }
      }
      // console.log($('.fund_tags' +id).css('height'))
      if(subjects && subjects.length > 8) {
        var tagId = "tagsReadmore" + id
        $('.' + "fund_subjects" + id).readmore({
          collapsedHeight: 35,
          moreLink: '<a href="#">...</a>'
        })
      }




      if(!countries){
         this.$(".nationalities"+ id).toggle(false);
      }
      else{
        var all = countries.indexOf('all');
        if(all > -1){
          countries[all] = 'from all countries';
        }
         for(var j = 0; j < countries.length; j++){
           this.$(".nationalities" + id).append("<span class = 'badge badge-error'><a class = 'display' href= '/results?tags=&age=&nationality=" + countries[j] + "'>" + countries[j] + "</a></span>");
           this.$(".nationalities" + id+ " span").css("margin-left", "5px");
           this.$(".nationalities" + id).css('textTransform', 'capitalize');
         }
        //  console.log($('nationalities' +id).css('height'))
         if(countries.length > 6 && countries.length < 20) {
           $('.nationalities' + id).readmore({
             collapsedHeight: 35,
             moreLink: '<a href="#">...</a>',
           })
         }
         if(countries.length >= 20) {
           $('.nationalities' + id).readmore({
             collapsedHeight: 35,
             moreLink: '<a href="#" class="countriesModalLink">...</a>',
             lessLink: '<a href="#" class="countriesModalLink">...</a>'
           })
           $(document).on('click', '.countriesModalLink', function(){
             $('#countriesModalText').empty();
             $('#countriesModal').modal('show');
             for(var i = 0; i < countries.length; i++) {
               $('#countriesModalText').append(upperCase(countries[i]) + ", ")
               $('#countriesModalText').css('font-size', '13px')
             }
           })
           $('.nationalities' + id).css('max-height', '35px')
         }
       }

       if(!minimum_amount){
         this.$(".fund_min_amount" + id).toggle(false);
         this.$(".fund_max_amount" + id).children('.control').addClass("max_amount"+ id);
         this.$(".max_amount" + id).addClass("label label-danger badge badge-warning");
         this.$(".max_amount" + id).html("Under £" + maximum_amount);
       }
       if(!maximum_amount){
         this.$(".fund_max_amount"+ id).toggle(false);
         this.$(".fund_min_amount"+ id).children('.control').addClass("min_amount"+ id);
         this.$(".min_amount" + id).addClass("label label-warning badge badge-warning");
         this.$(".min_amount"+ id).html("£" + minimum_amount + "+");
       }
       if(maximum_amount && minimum_amount){

         this.$(".fund_min_amount"+ id).children('.control').addClass("min_amount"+ id);
         this.$(".min_amount" + id).addClass("label label-warning badge badge-warning");
         this.$(".min_amount"+ id).html("£" + minimum_amount);
         this.$(".fund_min_amount" + id).append("<span id='minus-sign'> - </span>");
         this.$(".fund_max_amount" + id).children('.control').addClass("max_amount"+ id);
         this.$(".max_amount" + id).addClass("label label-danger badge badge-warning");
         this.$(".max_amount" + id).css("margin-left", "-10px");
       }
       if(!maximum_age){
         this.$(".fund_max_age"+ id).toggle(false);
         this.$(".fund_min_age"+ id).children('.control').addClass("min_age"+ id);
         this.$(".min_age" + id ).addClass('label label-success badge badge-info');
         this.$(".min_age"+ id).html(minimum_age + "+");
       }
       if(!minimum_age){
         this.$(".fund_min_age"+ id).toggle(false);
         this.$(".fund_max_age" + id).children('.control').addClass("max_age"+ id);
         this.$(".max_age" + id).addClass("label label-success badge badge-info").html("Under " + maximum_age);
       }
       if(maximum_age && minimum_age){
         this.$(".fund_min_age"+ id).children('.control').addClass("min_age"+ id);
         this.$(".min_age" + id).addClass("label label-success badge badge-info");
         this.$(".fund_min_age" + id).append("<span id='minus-sign'> - </span>");
         this.$(".fund_max_age" + id).children('.control').addClass("max_age"+ id);
         this.$(".max_age" + id).addClass("label label-success badge badge-info");
         this.$(".max_age" + id).css("margin-left", "-10px");
       }
    },
    infoToggle: function(){
      var id = this.model.get('id');
      var description = this.model.get('description');
      this.$("#" + id).css("margin-top", "7px");
      this.$("#" + id).css("margin-bottom", "15px");
      this.$("#" + id).css("font-size", "16px");
      if(description){
        var html_fade_div_id = '<div id="fade_div' + id + '"></div>'
        this.$("#" + id).children('.description_control').html(description);
        this.$('#' + id).children('.description_control').append(html_fade_div_id)
        this.$("#" + id).children('.description_control').attr('id', 'id' + id);
      }

      if($('#id' + id).height() >= 170) {
        if($('#id' + id).height() < 190) {
          $('#fade_div' + id).hide();
        } else {
          $('#id' + id).readmore({
            moreLink: '<a href="#">...read more</a>',
            lessLink: '<a href="#">read less</a>',
            collapsedHeight: 170,
            heightMargin: 0,
            beforeToggle: function(trigger, element, expanded) {
              $('.description_control').css('overflow', 'hidden');
              if(expanded) {
                $('#fade_div' + id).show()
              } if(!expanded) {
                $('#fade_div' + id).hide()
              }
            },
            afterToggle: function(trigger, element,expanded){
              if(expanded){
                $('#id' + id).css('overflow', 'visible');
                var divLength = $('#id' + id ).children().length - 2;
                var lastParagraph = $('#id' + id ).children()[divLength];
                lastParagraph = $(lastParagraph);
                var height = lastParagraph.height();
                var vbl = lastParagraph.offset().top - lastParagraph.parent().offset().top - lastParagraph.parent().scrollTop()
                var newHeight = vbl + height
                $('#id' + id).css('height', newHeight)

              }
              if(!expanded){
                $('#id' + id).css('overflow', 'hidden');
              }
            }
          })
        }
      } else {
        $('#fade_div' + id).hide();
      }

      // css
      this.$("#" + id).children('.description_control').find('*').css('line-height', '2');
      this.$("#" + id).children('.description_control').find('*').css('font-family', 'Helvetica Neue');
      var viewPortWidth = $(window).width();
      if(viewPortWidth < 480){
        this.$("#" + id).children('.description_control').find('*').css('font-size', '14px');
      }
      else{
        this.$("#" + id).children('.description_control').find('*').css('font-size', '12pt');
      }

      $('#fade_div' + id).css('position', 'absolute')
      $('#fade_div' + id).css('width', '100%')
      // top + height must equal if($('#id' + id).height() >= THISNUMBER) (line 237)
      $('#fade_div' + id).css('top', '120px')
      $('#fade_div' + id).css('height', '50px')
      $('#fade_div' + id).css('background', '-webkit-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)')
      $('#fade_div' + id).css('background-image', '-ms-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)')
      $('#fade_div' + id).css('background-image', '-o-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)')
      $('#fade_div' + id).css('background-image', 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)')
      $('#fade_div' + id).css('background-image', '-moz-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)')
    },
    addApplication: function(){
      if(user && !user.organisation_or_user){
          var fund_id = this.model.get('id');
          parameters = {"fund_id": fund_id};
          $.post('/user/add-application', parameters, function(data){
          })
      }
    },

    profileLink: function(){
      var fundId = this.model.get('id');
      var link = this.model.get('link');
      var fund_user = this.model.get('fund_user');
      this.$("#profile_link" + fundId).attr('href', '/organisation/options/' + fundId);
      // if (fund_user){
      //   this.$("#profile_link" + fundId).attr('href', '/organisation/options/' + fundId);
      // }
      // else{
      //   this.$("#profile_link" + fundId).attr('href',  link)
      //   this.$("#profile_link" + fundId).attr('target',  "_blank")
      // }
    },
    lazyLoad: function(){
      var scope = this;
      var dateNow = moment();
      var k = 0;
      for(var i = 0; i < fundData.length; i++) {
        var deadline = moment.utc(fundData[i].deadline, "YYYY-MM-DD");
        if(dateNow.isBefore(deadline) || fundData[i].deadline == null) {
          k = k + 1;
        }
      }
      $('.results p span').html("Your search returned " + k + " results");

      // **
      function load(img)
      {
        scope.fundDisplay();
        scope.infoToggle();
        scope.profileLink();
        img.fadeOut(0, function() {
          img.fadeIn(1000);
        });
      }

      this.$('.lazyload').lazyload({load: load});
    }
  });

  var FundList = Backbone.View.extend({
    el:".page-header",

    render: function(){
      // Display 'email us' message onload if no funds available
      var dateNow = moment();
      var k = 0
      for(var i = 0; i < fundData.length; i++) {
        var deadline = moment.utc(fundData[i].deadline, "YYYY-MM-DD");
        if(dateNow.isBefore(deadline) || fundData[i].deadline == null) {
          k = k + 1;
        }
      }
      if(k == 0){
        $('.contact-div').css('display', 'block');
        $('.page-header').css('margin-top', '0');
        $('.results p span').html("Your search returned " + 0 + " results");
      }

      this.collection.each(function(fund){
        if(!fund.get('application_link')){
          fund.set('application_link', fund.get('link'));
        }
        var deadline;
        if(fund.get('deadline')){
          var value = fund.get('deadline');
          var deadlineArray = value.split("T");
          deadline = deadlineArray[0].split("-").reverse().join("-");
          fund.set('deadline', deadline);
        }
        var fundView = new FundView({model: fund});
        this.$el.append(fundView.el);
      }, this);
      return this;
    }

 });




  var dateNow = moment();
  var nonDeadlineArray = [];
  var deadlineArray = [];
  var anotherCounter = 0;
  var k = 0;
  for(var i = 0; i < fundData.length; i++) {
    var deadline = moment.utc(fundData[i].deadline, "YYYY-MM-DD");
    if(dateNow.isBefore(deadline) || fundData[i].deadline == null) {
      k = k + 1;
      nonDeadlineArray.push(fundData[i]);
    }
    else{
      deadlineArray.push(fundData[i]);
    }
  }
  if(nonDeadlineArray.length <= 5 ){
    var fundCollection = new FundCollection(nonDeadlineArray);
    var fundList = new FundList({collection: fundCollection});
    $(document.body).append(fundList.render().el);
  }
  else{
    var startPoint = 0;
    var endPoint = 5;
    var fundCollection = new FundCollection(nonDeadlineArray.slice(startPoint, endPoint));
    var fundList = new FundList({collection: fundCollection});
    $(document.body).append(fundList.render().el);
    var scroll_pos_test = 200;
    var counter = 0;
    var lastTrack = false;
    $(window).on('scroll', function() {
        var y_scroll_pos = window.pageYOffset;
               // set to whatever you want it to be
        if(y_scroll_pos % 200 === 0 && y_scroll_pos < 15000){
          var numberOfResults = $('.fund_list').length;
          mixpanel.track(
            "Results scrolled",
            {"number": numberOfResults}
          );
        }
        if(y_scroll_pos > 15000 && lastTrack === false){
          lastTrack = true;
          var numberOfResults = $('.fund_list').length;
          mixpanel.track(
            "Results scrolled",
            {"number": numberOfResults}
          );
        }
        if(y_scroll_pos > scroll_pos_test && nonDeadlineArray.length > 5 && anotherCounter === 0) {
            //do stuff
            startPoint = startPoint +5;
            endPoint = endPoint + 5;

            if(endPoint < nonDeadlineArray.length && nonDeadlineArray.length > 5 && anotherCounter === 0){
              scroll_pos_test = scroll_pos_test + 300;
              var fundCollection = new FundCollection(nonDeadlineArray.slice(startPoint, endPoint));
              var fundList = new FundList({collection: fundCollection});
              $(document.body).append(fundList.render().el);
            }
            if(endPoint > nonDeadlineArray.length && counter === 0 && nonDeadlineArray.length > 5){

              var fundCollection = new FundCollection(nonDeadlineArray.slice(startPoint, nonDeadlineArray.length));
              var fundList = new FundList({collection: fundCollection});
              $(document.body).append(fundList.render().el);
              counter++;
            }
        }
    });
  }


  var counter3 = 0;
  $('#show-all').on('click', function(){
  if(allShown){
    $('*[id*=deadline-passed]:visible').closest('.fund_list').css('display', 'none');
    var dateNow = moment();
    var k = 0;
    for(var i = 0; i < fundData.length; i++) {
      var deadline = moment.utc(fundData[i].deadline, "YYYY-MM-DD");
      if(dateNow.isBefore(deadline) || fundData[i].deadline === null) {
        k = k + 1;
      }
    }
    anotherCounter++;
    $('.results p span').html("Your search returned " + k + " results");
    $(this).html("Show all funds - including those which are expired");
    $('.results p span').html("Your search returned " + k + " results");
    allShown = false;

  }
  else{
    var fundCollection = new FundCollection(deadlineArray);
    var fundList = new FundList({collection: fundCollection});
    if(counter3 === 0){
      $(document.body).append(fundList.render().el);
    }
    counter3++;
    $('*[class*=fund_list]:hidden').css('display', 'block');
    var k = fundData.length;
    $(this).html("Only show funds which have not passed their deadline");
    $('.results p span').html("Your search returned " + k + " results");
    allShown = true;
  }
  });


  // if(allShown == true){
  //
  // }



// Readmore
// Scroll 1px onload so results show
 function Scrolldown() {
      window.scroll(0, 1);
 }
 window.onload = Scrolldown;
 //mixpanel checking actions prior to signin
 var mixpanelClickCheck = [];
 $(document).click(function(e){
   console.log(e);
   console.log(e.target);
   mixpanelClickCheck.push(e.target.outerHTML);
   if($(e.target).attr('id') == "signup-button"){
     //track array and page
     mixpanel.track(
       "Pre Signup Action",
       {"page": "results", "actions": mixpanelClickCheck}
     );
   }
   // if(e.target !=)
 });


//Use modernizr to move search bar when screen is mobile
// function doneResizing() {
//   var form = document.getElementsByClassName("search_form");
//
//   if(Modernizr.mq('screen and (min-width:720px)')) {
//     // action for screen widths including and above 768 pixels
//     $(".navbar-header").append(form);
//   }
//   else if(Modernizr.mq('screen and (max-width:720px)')) {
//     // action for screen widths below 768 pixels
//     $("#about").prepend(form);
//   }
//
//   if(Modernizr.mq('screen and (max-width:851px)')) {
//     $("#text_search").attr('placeholder', 'Subject, University, Degree level');
//   }
//   else if(Modernizr.mq('screen and (min-width:851px)')) {
//     $("#text_search").attr('placeholder', 'Keywords-Subject, University, Degree level');
//   }
//
//   if(user && Modernizr.mq('screen and (max-width:767px)')) {
//     $('.navbar-header').css('float', 'left');
//     $('.navbar-collapse.collapse').css('display', 'block');
//     $('.navbar-toggle').css('display', 'none');
//     $('.navbar-nav li').css('float', 'left');
//     $('.navbar-nav li a').css('padding-top', '15px');
//     $('.navbar-nav.navbar-right:last-child').css('margin-right', '-15px');
//     $('.navbar-right').css('float', 'right');
//     $('.navbar-nav').css('margin', '0');
//     $('#container').css('padding-bottom', '5px');
//   }
// }

var id;

// $('.results p span').html("Your search returned " + !$('*[class*=fund_list]').hasClass('#deadline-passed').length + " results");
// if($('*[class*=fund_list]:visible').length == 0){
//   $('.contact-div').css('display', 'block');
//   $('.page-header').css('margin-top', '0');
// }
// $(window).resize(function() {
//   clearTimeout(id);
//   id = setTimeout(doneResizing, 0);
// });
//
// doneResizing();

});
var reformatDate = function(date) {
  if(date){
    date = date.split('T')[0];
    date = date.split('-').reverse().join('-');
    return date;
  }

};

// First letter of each word upperCase function
function upperCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {

       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' ');
}

var i = 0;
