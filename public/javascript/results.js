$(document).ready(function() {

//show and hide past deadline funds
  var allShown = true;
  $('#show-all').on('click', function(){
  if(allShown){
    $('*[id*=deadline-passed]:visible').closest('.fund_list').css('display', 'none');
    $(this).html("Show all funds - including those which are expired");
    $('.results h3 span').html("Your search returned " + $('*[class*=fund_list]:visible').length + " results");
    allShown = false;
  }
  else{
    $('*[class*=fund_list]:hidden').css('display', 'block');
    $(this).html("Only show funds which have not passed their deadline");
    $('.results h3 span').html("Your search returned " + $('*[class*=fund_list]:visible').length + " results")
    allShown = true;
  }
  });
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
    tagname: 'ul',
    class: 'database',
    template: _.template($('#fund-template').html()),
    initialize: function(){
      this.render();
      this.fundDisplay();
      this.infoToggle();
      this.profileLink();
    },
    events: {
      'click .fund_link a': 'addApplication'
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this; // enable chained calls
    },
    fundDisplay: function(){
      // Do the date
      var dateNow = new Date();
      dateNow = dateNow.toISOString();
      var deadline = this.model.get('deadline');
      console.log(deadline);
      var id = this.model.get('id');
      console.log(id);
      var tags = this.model.get('tags');
      var countries = this.model.get('country_of_residence');
      var minimum_amount = this.model.get('minimum_amount');
      var maximum_amount = this.model.get('maximum_amount');
      var minimum_age = this.model.get('minimum_age');
      var maximum_age = this.model.get('maximum_age');
      if (deadline < dateNow){
        this.$('.deadline-passed' + id).css('display', 'block');
        this.$('.deadline-passed' + id).closest('.fund_list').children().css('opacity', '0.4');
      };

      if(!tags){
        this.$(".fund_tags"+ id).toggle(false);
      }
      else{
        if(tags.length > 8){
          for(var x = 0; x < 7; x++){
            var searchTags = tags[x].split(" ").join("+");
            this.$(".fund_tags" + id).append("<span class = 'badge badge-tags' style = 'margin-top: 10px;'><a class='display' href= '/results?tags=" + searchTags + "'>" + tags[x] + "</a></span>");

          }
            this.$(".fund_tags" + id).append("<span class = 'etc' style = 'margin-top: 10px;' '> ... </span>");
        }
        else{
          for(var y = 0; y < tags.length; y++){
            var searchTags = tags[y].split(" ").join("+");
            this.$(".fund_tags" + id).append("<span class = 'badge badge-tags'><a class='display' href= '/results?tags=" + searchTags + "'>" + tags[y] + "</a></span>");

          }
        }

      }

      if(!countries){
         this.$(".nationalities"+ id).toggle(false);
      }
      else{
        if(countries.length > 4){
          for(var k = 0; k < 4; k++){
             this.$(".nationalities" + id).append("<span class = 'badge badge-error'><a class='display' href= '/results?tags=&age=&nationality='" + countries[k] + "'>" + countries[k] + "</a></span>");
             this.$(".nationalities" + id + " span").css("margin-left", "5px");
             this.$(".nationalities" + id).css('textTransform', 'capitalize');
             if(k == 3){
               this.$(".nationalities" + id).append("<span> ... </span>");
             }
           }
         }
         else{
           for(var j = 0; j < countries.length; j++){
             this.$(".nationalities" + id).append("<span class = 'badge badge-error'><a class = 'display' href= '/results?tags=&age=&nationality=" + countries[j] + "'>" + countries[j] + "</a></span>");
             this.$(".nationalities" + id+ " span").css("margin-left", "5px");
             this.$(".nationalities" + id).css('textTransform', 'capitalize');
           }
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
      console.log(id);
      var description = this.model.get('description');
      this.$("#" + id).css("margin-top", "7px");
      this.$("#" + id).css("margin-bottom", "15px");
      this.$("#" + id).css("font-size", "16px");

      var splitDescriptionArray = description.split(/<\/.*?>/g);
      splitDescriptionArray = splitDescriptionArray.filter(function(element){
        return element.length > 5
      });
      var splitNumber = Math.floor((splitDescriptionArray.length)/2);
      if(splitNumber > 1){
        var index = description.indexOf(splitDescriptionArray[1]);
        if(index < 60){
          index = description.indexOf(splitDescriptionArray[2]);
          if (index < 60){
            index = description.indexOf(splitDescriptionArray[3]);
          }
        }
        var constant = description.substring(0, index);
        var readMore = description.substring(index);
        var finalDescription = constant + "<div id = 'read-more" + id + "' class = 'read-more'>" + readMore + "</div> <a class='read-link' id = 'read-link" + id +  "'> Read more </a>";
        this.$("#" + id).children('.description_control').html(finalDescription);
      }
      else{
        this.$("#" + id).children('.description_control').html(description);
      }


      //Conventionalised the styles in css
      this.$("#" + id).children('.description_control').find('*').css('line-height', '2');
      this.$("#" + id).children('.description_control').find('*').css('font-family', 'Helvetica Neue');
      this.$("#" + id).children('.description_control').find('*').css('font-size', '12pt');

      var fundId = id;
      var readMore = true;
      this.$('#read-link' + fundId).on('click', function(){
        if(readMore){
          $('#read-more' + fundId).slideDown();
          $(this).html("Read less");
          readMore = false;
        }
        else{
          $('#read-more' + fundId).slideUp();
          $(this).html("Read more");
          readMore = true;
        }
      })
    },
    addApplication: function(){
      if(user && !user.fund_or_user){
          var fund_id = this.model.get('id');
          parameters = {"fund_id": fund_id};
          $.post('/users/add-application/'+ user.id, parameters, function(data){
          })

      }
    },
    profileLink: function(){
      var fundId = this.model.get('id');
      var link = this.model.get('link');
      var fund_user = this.model.get(fund_user);
      if (fund_user){
        this.$("#profile_link" + fundId).attr('href', '/funds/public/' + fundId);
      }
      else{
        this.$("#profile_link" + fundId).attr('href',  link)
        this.$("#profile_link" + fundId).attr('target',  "_blank")
      }
    }
  });

  var FundList = Backbone.View.extend({
    el:".page-header",

    render: function(){
      this.collection.each(function(fund){
        if(!fund.application_link){
          fund.application_link = fund.link;
        }

        var deadline;
        if(fund.deadline){
        var deadlineArray = fund.deadline.split("T");
        deadline = deadlineArray[0].split("-").reverse().join("-");
        fund.deadline = deadline;
        }

        var fundView = new FundView({model: fund})
        this.$el.append(fundView.el);
      }, this)
      return this;
    }
 });
var fundCollection = new FundCollection(fundData);
var fundList = new FundList({collection: fundCollection});
$(document.body).append(fundList.render().el);

//Use modernizr to move search bar when screen is mobile
function doneResizing() {
  var form = document.getElementsByClassName("search_form");

  if(Modernizr.mq('screen and (min-width:720px)')) {
    // action for screen widths including and above 768 pixels
    $(".navbar-header").append(form);
  }
  else if(Modernizr.mq('screen and (max-width:720px)')) {
    // action for screen widths below 768 pixels
    $("#about").prepend(form);
  }

  if(Modernizr.mq('screen and (max-width:851px)')) {
    $("#text_search").attr('placeholder', 'Subject, University, Degree level');
  }
  else if(Modernizr.mq('screen and (min-width:851px)')) {
    $("#text_search").attr('placeholder', 'Keywords-Subject, University, Degree level');
  }

  if(user && Modernizr.mq('screen and (max-width:767px)')) {
    $('.navbar-header').css('float', 'left');
    $('.navbar-collapse.collapse').css('display', 'block');
    $('.navbar-toggle').css('display', 'none');
    $('.navbar-nav li').css('float', 'left');
    $('.navbar-nav li a').css('padding-top', '15px');
    $('.navbar-nav.navbar-right:last-child').css('margin-right', '-15px');
    $('.navbar-right').css('float', 'right');
    $('.navbar-nav').css('margin', '0');
    $('#container').css('padding-bottom', '5px');
  }
}

var id;

$(window).resize(function() {
  clearTimeout(id);
  id = setTimeout(doneResizing, 0);
});

doneResizing();



});
