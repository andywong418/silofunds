$(document).ready(function() {
  var bool = false;


for(var field in query){
  $('.' + field).attr('value', query[field]);
  if(field == 'merit_or_finance'){
      $('#' + query[field]).attr("checked", "true");
  }
  if(field == 'gender'){
    $('#' + query[field]).attr("checked", "true");
  }
}
var advanced = true;
var advanced_2 = true;
function split( val ) {
    return val.split(" ");
};
$("#grants").click(function(){
    $("#advanced-search").slideDown();
    $("#advanced-search-2").toggle(false);
    $("#grants span").css("display","inline");
    $("#users span").css("display","none");
    advanced = false;
    $("#search-form").attr('action', '/results');
    $("#text_search").attr('placeholder', 'Keywords - Subject, University, Degree level');
    $("input#text_search" ).autocomplete({
      source: "../autocomplete",
      minLength: 1,
      select: function( event, ui ) {
        var terms = split( this.value );
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push( ui.item.value );
        // add placeholder to get the comma-and-space at the end
        terms.push( "" );
        this.value = terms.join(" ");
        return false;
      },
      focus: function() {
        // prevent value inserted on focus
        return false;
      }
    });

    return true;
  });
$(document).on('click', '#refine-search', function(){

  $("#advanced-search").slideDown();
   advanced = false;
    return true;
});

$("#users").click(function(){
    $("#advanced-search-2").toggle(true);
    $("#advanced-search").toggle(false);
    $("#users span").css("display","inline");
    $("#grants span").css("display","none");
    advanced_2 = false;
    $("#search-form").attr('action', '/results/users');
    $("#text_search").attr('placeholder', 'Search for users by name or by interests');
    $("input#text_search" ).autocomplete({
      source: "../autocomplete/users",
      minLength: 1,
      select: function( event, ui ) {
        var terms = split( this.value );
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push( ui.item.value );
        // add placeholder to get the comma-and-space at the end
        terms.push( "" );
        this.value = terms.join(" ");
        return false;
      },
      focus: function() {
        // prevent value inserted on focus
        return false;
      }
    });
});
$(document).click(function(e) {
  if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null && e.target.closest('#refine-search') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
      $("#advanced-search").toggle(false);

  }
  else{
        return true;
      }

  if ( $(e.target).closest('#advanced-search-2').length == 0 && e.target.closest('#users') === null && e.target.closest('#refine-search') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
    $("#advanced-search-2").toggle(false);
  }
  else{
        return true;
  }
});

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

var UserNav = Backbone.View.extend({
        el: ".nav li",

        initialize: function(){
          if(user){
            $('.pre-signin').css("display", "none");
            $('.post-signin').css("display","inline");
            $('.post-signin').css("z-index", "11");
            if(user.fund_or_user){
              $("#home").attr("href", '/funds/' + user.id );
              $(".settings").attr("href", '/funds/settings/' +user.id);
              $(".logout").attr("href", '/funds/logout/' + user.id);
            }
            else{
              $("#home").attr("href", '/users/' + user.id);
              $(".settings").attr("href", '/users/settings/' +user.id );
              $(".logout").attr("href", '/users/logout/' + user.id);
            }
          }
          else{
            $('.post-signin').css("display","none");
          }
        // $('.pre-signin').css("display","none");
      }

  });
 var userNav = new UserNav();


  for (var i = 0; i < fundData.length; i++) {
    var FundModel = Backbone.Model.extend({
      defaults: {
        fund_title: '',
        maximum_amount: 0,
        minimum_age: 0,
        maximum_age: 0,
        fund_id: 0,
        description: '',
        fund_link: ''
      }
    });

    var FundView = Backbone.View.extend({
      tagname: 'ul',

      template: _.template($('#fund-template').html()),

      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
    });

    var FundList = Backbone.View.extend({
      el:".page-header",

      initialize: function(){
        this.fundDisplay();
        this.infoToggle();
        this.addApplication();
        this.profileLink();
      },

      fundDisplay: function(){
        var deadline;
        if(fundData[i].deadline){
        var deadlineArray = fundData[i].deadline.split("T");
        deadline = deadlineArray[0].split("-").reverse().join("-");
        }

        var fund = new FundModel({
          fund_title: fundData[i].title,
          maximum_amount: "£" + fundData[i].maximum_amount,
          minimum_age: fundData[i].minimum_age,
          maximum_age: fundData[i].maximum_age,
          fund_id: fundData[i].id,
          description: fundData[i].description,
          fund_link: fundData[i].link,
          application_link: fundData[i].application_link,
          deadline: deadline
        });
        if(!fundData[i].application_link){
          fund.set("application_link", fundData[i].link);
        }
        var view = new FundView({ model: fund });

        this.$el.append(view.render().el);
        // Do the date
        var dateNow = new Date();
        dateNow = dateNow.toISOString();
        if (fundData[i].deadline < dateNow){
          $('.deadline-passed' + fundData[i].id).css('display', 'block');
          $('.deadline-passed' + fundData[i].id).closest('.fund_list').children().css('opacity', '0.4');
        };
        var tags = fundData[i].tags;
        if(!tags){
          $(".fund_tags"+ fundData[i].id).toggle(false);
        }
        else{
          if(tags.length > 8){
            for(var x = 0; x < 7; x++){
              var searchTags = tags[x].split(" ").join("+");
              $(".fund_tags" + fundData[i].id).append("<span class = 'badge badge-tags' style = 'margin-top: 10px;'><a class='display' href= '/results?tags=" + searchTags + "'>" + tags[x] + "</a></span>");

            }
            $(".fund_tags" + fundData[i].id).append("<span class = 'etc' style = 'margin-top: 10px;' '> ... </span>");
          }
          else{
            for(var y = 0; y < tags.length; y++){
              var searchTags = tags[y].split(" ").join("+");
              $(".fund_tags" + fundData[i].id).append("<span class = 'badge badge-tags'><a class='display' href= '/results?tags=" + searchTags + "'>" + tags[y] + "</a></span>");
            }
          }

        }
        var countries = fundData[i].countries;
        if(!countries){
           $(".nationalities"+ fundData[i].id).toggle(false);
        }
        else{
          if(countries.length > 4){
            for(var k = 0; k < 4; k++){
               $(".nationalities" + fundData[i].id).append("<span class = 'badge badge-error'><a class='display' href= '/results?tags=&age=&nationality='" + countries[k] + "'>" + countries[k] + "</a></span>");
               $(".nationalities" + fundData[i].id+ " span").css("margin-left", "5px");
               $(".nationalities" + fundData[i].id).css('textTransform', 'capitalize');
               if(k == 3){
                 $(".nationalities" + fundData[i].id).append("<span> ... </span>");
               }
             }
           }
           else{
             for(var j = 0; j < countries.length; j++){
               $(".nationalities" + fundData[i].id).append("<span class = 'badge badge-error'><a class = 'display' href= '/results?tags=&age=&nationality=" + countries[j] + "'>" + countries[j] + "</a></span>");
               $(".nationalities" + fundData[i].id+ " span").css("margin-left", "5px");
               $(".nationalities" + fundData[i].id).css('textTransform', 'capitalize');
             }
           }
         }

         if(!fundData[i].minimum_amount){
           $(".fund_min_amount" + fundData[i].id).toggle(false);
           $(".fund_max_amount" + fundData[i].id).children('.control').addClass("max_amount"+ fundData[i].id);
           $(".max_amount" + fundData[i].id).addClass("label label-danger badge badge-warning");
           $(".max_amount" + fundData[i].id).html("Under £" + fundData[i].maximum_amount);
         }
         if(!fundData[i].maximum_amount){
           $(".fund_max_amount"+ fundData[i].id).toggle(false);
           $(".fund_min_amount"+ fundData[i].id).children('.control').addClass("min_amount"+ fundData[i].id);
           $(".min_amount" + fundData[i].id).addClass("label label-warning badge badge-warning");
           $(".min_amount"+ fundData[i].id).html("£" + fundData[i].minimum_amount + "+");
         }
         if(fundData[i].maximum_amount && fundData[i].minimum_amount){

           $(".fund_min_amount"+ fundData[i].id).children('.control').addClass("min_amount"+ fundData[i].id);
           $(".min_amount" + fundData[i].id).addClass("label label-warning badge badge-warning");
           $(".min_amount"+ fundData[i].id).html("£" + fundData[i].minimum_amount);
           $(".fund_min_amount" + fundData[i].id).append("<span id='minus-sign'> - </span>");
            $(".fund_max_amount" + fundData[i].id).children('.control').addClass("max_amount"+ fundData[i].id);
           $(".max_amount" + fundData[i].id).addClass("label label-danger badge badge-warning");
           $(".max_amount" + fundData[i].id).css("margin-left", "-10px");
         }
         if(!fundData[i].maximum_age){
           $(".fund_max_age"+ fundData[i].id).toggle(false);
           $(".fund_min_age"+ fundData[i].id).children('.control').addClass("min_age"+ fundData[i].id);
           $(".min_age" + fundData[i].id ).addClass('label label-success badge badge-info');
           $(".min_age"+ fundData[i].id).html(fundData[i].minimum_age + "+");
         }
         if(!fundData[i].minimum_age){
           $(".fund_min_age"+ fundData[i].id).toggle(false);
           $(".fund_max_age" + fundData[i].id).children('.control').addClass("max_age"+ fundData[i].id);
           $(".max_age" + fundData[i].id).addClass("label label-success badge badge-info").html("Under " + fundData[i].maximum_age);
         }
         if(fundData[i].maximum_age && fundData[i].minimum_age){
           $(".fund_min_age"+ fundData[i].id).children('.control').addClass("min_age"+ fundData[i].id);
           $(".min_age" + fundData[i].id).addClass("label label-success badge badge-info");
           $(".fund_min_age" + fundData[i].id).append("<span id='minus-sign'> - </span>");
           $(".fund_max_age" + fundData[i].id).children('.control').addClass("max_age"+ fundData[i].id);
           $(".max_age" + fundData[i].id).addClass("label label-success badge badge-info");
           $(".max_age" + fundData[i].id).css("margin-left", "-10px");
         }
      },

      infoToggle: function(){
        $("#" + fundData[i].id).css("margin-top", "7px");
        $("#" + fundData[i].id).css("margin-bottom", "15px");
        $("#" + fundData[i].id).css("font-size", "16px");

        var description = fundData[i].description;
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
          var finalDescription = constant + "<div id = 'read-more" + fundData[i].id + "' class = 'read-more'>" + readMore + "</div> <a class='read-link' id = 'read-link" + fundData[i].id +  "'> Read more </a>";
          $("#" + fundData[i].id).children('.description_control').html(finalDescription);
        }
        else{
          $("#" + fundData[i].id).children('.description_control').html(fundData[i].description);
        }


        //Conventionalised the styles in css
        $("#" + fundData[i].id).children('.description_control').find('*').css('line-height', '2');
        $("#" + fundData[i].id).children('.description_control').find('*').css('font-family', 'Helvetica Neue');
        $("#" + fundData[i].id).children('.description_control').find('*').css('font-size', '12pt');

        var fundId = fundData[i].id;
        var readMore = true;
        $('#read-link' + fundId).on('click', function(){
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

        // $("#" + fundData[i].id).on("click", function() {
        //   if(bool){
        //     $(this).children('i').replaceWith('<i class="fa fa-chevron-circle-down"></i>')
        //     $(this).children("span").slideUp();
        //     bool = false;
        //
        //   }
        //   else{
        //     $(this).children('i').replaceWith('<i class="fa fa-chevron-circle-up"></i>')
        //     $(this).children("span").slideDown();
        //     $(this).children("span").css("margin-top" , "5px");
        //     $(this).children("span").css("padding", "15px");
        //     $(this).find("li").css("list-style-type", "disc");
        //     bool = true;
        //   }
        // });
      },
      addApplication: function(){
        if(user && !user.fund_or_user){
          $(".fund_link a").click(function(){
            var fund_id = $(this).parent().siblings('label').attr("id");
            parameters = {"fund_id": fund_id};
            $.post('/users/add-application/'+ user.id, parameters, function(data){
            })
          })
        }
      },
      profileLink: function(){
        var fundId = fundData[i].id;
        var link = fundData[i].link;
        if (fundData[i].fund_user){
          $("#profile_link" + fundId).attr('href', '/funds/public/' + fundId);
        }
        else{
          $("#profile_link" + fundId).attr('href',  link)
          $("#profile_link" + fundId).attr('target',  "_blank")
        }
      }
   });

  var FundList = new FundList();
  }




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
