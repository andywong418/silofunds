$(document).ready(function() {
  var bool = false;

  console.log(user);
// Need user data to do this
//    var UserNavView = Backbone.View.extend({
//   tagname: 'ul',
//   template: _.template($('#usernav-template').html()),
//   render: function() {
//         this.$el.html(this.template(this.model.toJSON()));
//         return this; // enable chained calls
//   }

// });

console.log(query);

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

$("#grants").click(function(){
    $("#advanced-search").slideDown();
    $("#advanced-search-2").toggle(false);
    $("#grants span").css("display","inline");
    $("#users span").css("display","none");
    advanced = false;
    return true;
  });
$(document).on('click', '#refine-search', function(){
  console.log("REFINE");
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
});
$(document).click(function(e) {
  if ( $(e.target).closest('#advanced-search').length == 0 && e.target.closest('#grants') === null && e.target.closest('#refine-search') === null && e.target.closest('#search_button') === null && e.target.closest('#text_search') === null) {
      $("#advanced-search").toggle(false);

  }
  else{
        return true;
      }

  if ( $(e.target).closest('#advanced-search-2').length == 0 && e.target.closest('#users' && e.target.closest('#search_button') === null) && e.target.closest('#text_search') === null) {
    $("#advanced-search-2").toggle(false);
  }
  else{
        return true;
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
              console.log("THIS IS A FUND");
              $("#home").attr("href", '/funds/' + user.id );
              $(".settings").attr("href", '/funds/settings/' +user.id);
              $(".logout").attr("href", 'funds/logout');
            }
            else{
               console.log("THIS IS A USER");
              $("#home").attr("href", '/users/' + user.id);
              $(".settings").attr("href", '/users/settings/' +user.id );
              $(".logout").attr("href", 'users/logout/' + user.id);
            }
          }
          else{
            $('.post-signin').css("display","none");
          }
        // $('.pre-signin').css("display","none");
      }

  });
 var userNav = new UserNav();
//   console.log(userNav);

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
      },

      fundDisplay: function(){
        var deadlineArray = fundData[i].deadline.split("T");
        var deadline = deadlineArray[0].split("-").reverse().join("-");
        var fund = new FundModel({
          fund_title: fundData[i].title,
          maximum_amount: "£" + fundData[i].maximum_amount,
          minimum_age: fundData[i].minimum_age,
          maximum_age: fundData[i].maximum_age,
          fund_id: fundData[i].id,
          description: fundData[i].description,
          fund_link: fundData[i].link,
          deadline: deadline
        });

        var view = new FundView({ model: fund });

        this.$el.append(view.render().el);
        // Do the date
        var dateNow = new Date();
        dateNow = dateNow.toISOString();
        console.log("NOW", dateNow);
        console.log("DEADLINE", fundData[i].deadline);
        if (fundData[i].deadline < dateNow){
          console.log("TRUE");
          $('#deadline-passed').css('display', 'block');
        };
        var tags = fundData[i].tags;
        if(!tags){
          $(".fund_tags"+ fundData[i].id).toggle(false);
        }
        else{
          if(tags.length > 8){
            for(var x = 0; x < 7; x++){
              $(".fund_tags" + fundData[i].id).append("<span class = 'badge badge-tags' style = 'margin-top: 10px;' '>" + tags[x] + "</span>");

            }
            $(".fund_tags" + fundData[i].id).append("<span class = 'etc' style = 'margin-top: 10px;' '> ... </span>");
          }
          else{
            for(var y = 0; y < tags.length; y++){
              $(".fund_tags" + fundData[i].id).append("<span class = 'badge badge-tags'>" + tags[y] + "</span>");
            }
          }

        }
        var countries = fundData[i].countries;
        if(!countries){
           $(".nationalities"+ fundData[i].id).toggle(false);
        }
        else{
          console.log(countries.length);
          if(countries.length > 4){
            for(var k = 0; k < 4; k++){
               $(".nationalities" + fundData[i].id).append("<span class = 'badge badge-error'>" + countries[k] + "</span>");
               $(".nationalities" + fundData[i].id+ " span").css("margin-left", "5px");
               $(".nationalities" + fundData[i].id).css('textTransform', 'capitalize');
               if(k == 3){
                 $(".nationalities" + fundData[i].id).append("<span> ... </span>");
               }
             }
           }
           else{
             for(var j = 0; j < countries.length; j++){
               $(".nationalities" + fundData[i].id).append("<span class = 'badge badge-error'>" + countries[j] + "</span>");
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
           console.log($(".fund_min_amount"+ fundData[i].id).children('.control'));
           $(".min_amount" + fundData[i].id).addClass("label label-warning badge badge-warning");
           $(".min_amount"+ fundData[i].id).html("£" + fundData[i].minimum_amount);
           $(".fund_min_amount" + fundData[i].id).append("<span id='minus-sign'> - </span>");
            $(".fund_max_amount" + fundData[i].id).children('.control').addClass("max_amount"+ fundData[i].id);
           $(".max_amount" + fundData[i].id).addClass("label label-danger badge badge-warning");
           $(".max_amount" + fundData[i].id).css("margin-left", "-26px");
         }
         if(!fundData[i].maximum_age){
           $(".fund_max_age"+ fundData[i].id).toggle(false);
           $(".fund_min_age"+ fundData[i].id).children('.control').addClass("min_age"+ fundData[i].id);
           $(".min_age" + fundData[i].id ).addClass('label label-success badge badge-info');
           $(".min_age"+ fundData[i].id).html(fundData[i].minimum_age + "+");
         }
         if(!fundData[i].minimum_age){
           $(".fund_min_age"+ fundData[i].id).toggle(false);
           console.log("THIS IS", fundData[i]);
           $(".fund_max_age" + fundData[i].id).children('.control').addClass("max_age"+ fundData[i].id);
           $(".max_age" + fundData[i].id).addClass("label label-success badge badge-info").html("Under " + fundData[i].maximum_age);
         }
         if(fundData[i].maximum_age && fundData[i].minimum_age){
           $(".fund_min_age"+ fundData[i].id).children('.control').addClass("min_age"+ fundData[i].id);
           $(".min_age" + fundData[i].id).addClass("label label-success badge badge-info");
           $(".fund_min_age" + fundData[i].id).append("<span id='minus-sign'> - </span>");
           $(".fund_max_age" + fundData[i].id).children('.control').addClass("max_age"+ fundData[i].id);
           $(".max_age" + fundData[i].id).addClass("label label-success badge badge-info");
           $(".max_age" + fundData[i].id).css("margin-left", "-26px");
         }
      },

      infoToggle: function(){
        $("#" + fundData[i].id).css("margin-top", "20px");
        $("#" + fundData[i].id).css("margin-bottom", "15px");
        $("#" + fundData[i].id).css("font-size", "16px");
        $("#" + fundData[i].id).on("click", function() {
          if(bool){
            console.log($(this).children("span").html());
            $(this).children('i').replaceWith('<i class="fa fa-chevron-circle-down"></i>')
            $(this).children("span").slideUp();
            bool = false;

          }
          else{
            console.log($(this).children('i'));
            $(this).children('i').replaceWith('<i class="fa fa-chevron-circle-up"></i>')
            $(this).children("span").slideDown();
            $(this).children("span").css("margin-top" , "5px");
            $(this).children("span").css("padding", "15px");
            $(this).find("li").css("list-style-type", "disc");
            bool = true;
          }
        });
      },
      addApplication: function(){
        if(user && !user.fund_or_user){
          $(".fund_link a").click(function(){
            var fund_id = $(this).parent().siblings('label').attr("id");
            parameters = {"fund_id": fund_id};
            $.post('/users/add-application/'+ user.id, parameters, function(data){
              console.log(data)
            })
          })
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
      // action for screen widths including and above 768 pixels
      $("#text_search").attr('placeholder', 'Subject, University, Degree level');
    }
    else if(Modernizr.mq('screen and (min-width:851px)')) {
      // action for screen widths including and above 768 pixels
      $("#text_search").attr('placeholder', 'Keywords-Subject, University, Degree level');
    }
  }

  var id;

  $(window).resize(function() {
    clearTimeout(id);
    id = setTimeout(doneResizing, 0);
  });

  doneResizing();
});
