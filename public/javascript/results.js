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
  })

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
      var minimum_amount = this.model.get('minimum_amount');
      var maximum_amount = this.model.get('maximum_amount');
      var minimum_age = this.model.get('minimum_age');
      var maximum_age = this.model.get('maximum_age');
      if(deadline){
        console.log("HI");
        var dateNow = moment();
        deadline = moment.utc(deadline, "DD-MM-YYYY");
        console.log(dateNow);
        console.log(deadline);
        console.log(moment(dateNow).isAfter(moment(deadline)));
        if (dateNow.isAfter(deadline)){
          console.log(this.$('.deadline-passed' + id));
          this.$('.deadline-passed' + id).css('display', 'block');
          this.$('.deadline-passed' + id).closest('.fund_list').children().css('opacity', '0.4');

        }
      }


      // $('#tags').readmore({
      //     collapsedHeight: 20
      // })
      if (!tags) {
          this.$(".fund_tags" + id).toggle(false);
      } else {
          for (var y = 0; y < tags.length; y++) {
              var searchTags = tags[y].split(" ").join("+");
              this.$(".fund_tags" + id).append("<span class = 'badge badge-tags'><a class='display' href= '/results?tags=" + searchTags + "'>" + tags[y] + "</a></span>");
          }
      }
      // console.log($('.fund_tags' +id).css('height'))
      if(tags.length > 8) {
        var tagId = "tagsReadmore" + id
        $('.' + "fund_tags" + id).readmore({
          collapsedHeight: 35,
          moreLink: '<a href="#">...</a>'
        })
      }




      if(!countries){
         this.$(".nationalities"+ id).toggle(false);
      }
      else{
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
        //  console.log(this.$(".min_amount" + id));
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
        this.$("#" + id).children('.description_control').html(description);
      }
      $('.description_control').readmore({
        moreLink: '<a href="#">...read more</a>',
        collapsedHeight: 40,
      })
      // Used following two lines to find the height of 2em + some margins, then inputted into above, useful if you want to change
      // $('.description_control').css("max-height", 'calc(2em + 8px)')
      // console.log($('.description_control').height())

      //Conventionalised the styles in css
      this.$("#" + id).children('.description_control').find('*').css('line-height', '2');
      this.$("#" + id).children('.description_control').find('*').css('font-family', 'Helvetica Neue');
      this.$("#" + id).children('.description_control').find('*').css('font-size', '12pt');
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
      if (fund_user){
        this.$("#profile_link" + fundId).attr('href', '/organisation/options/' + fundId);
      }
      else{
        this.$("#profile_link" + fundId).attr('href',  link)
        this.$("#profile_link" + fundId).attr('target',  "_blank")
      }
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
      console.log(k);
      $('.results h3 span').html("Your search returned " + k + " results");

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
        $('.results h3 span').html("Your search returned " + 0 + " results");
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
    console.log("GO IN here");
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
    $(window).on('scroll', function() {

      console.log(nonDeadlineArray);
        var y_scroll_pos = window.pageYOffset;
               // set to whatever you want it to be
        if(y_scroll_pos > scroll_pos_test && nonDeadlineArray.length > 5) {
            //do stuff
            startPoint = startPoint +5;
            endPoint = endPoint + 5;

            if(endPoint < nonDeadlineArray.length && nonDeadlineArray.length > 5){
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
    $('body').bind('touchmove', function(e){
      e.preventDefault();
    });
    $('.results h3 span').html("Your search returned " + k + " results");
    $(this).html("Show all funds - including those which are expired");
    $('.results h3 span').html("Your search returned " + k + " results");
    allShown = false;

  }
  else{
    var fundCollection = new FundCollection(deadlineArray);
    var fundList = new FundList({collection: fundCollection});
    $(document.body).append(fundList.render().el);

    $('*[class*=fund_list]:hidden').css('display', 'block');
    var k = fundData.length;
    $(this).html("Only show funds which have not passed their deadline");
    $('.results h3 span').html("Your search returned " + k + " results");
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

// $('.results h3 span').html("Your search returned " + !$('*[class*=fund_list]').hasClass('#deadline-passed').length + " results");
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
