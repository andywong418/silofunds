$(document).ready(function() {
  var bool = false;

  console.log(user);
  console.log(session);
// Need user data to do this
//    var UserNavView = Backbone.View.extend({
//   tagname: 'ul',
//   template: _.template($('#usernav-template').html()),
//   render: function() {
//         this.$el.html(this.template(this.model.toJSON()));
//         return this; // enable chained calls
//   }

// });

var UserNav = Backbone.View.extend({
        el: ".nav li",

        initialize: function(){
          if(user){
            $('.pre-signin').css("display", "none");
            $('.post-signin').css("display","inline");
            if(user.fund_or_user){
              console.log("THIS IS A FUND");
              $("#home").attr("href", '/funds/' + user.id + '/'+session);
              $(".settings").attr("href", '/funds/settings/' +user.id + '/' + session);
              $(".logout").attr("href", 'funds/logout');
            }
            else{
               console.log("THIS IS A USER");
              $("#home").attr("href", '/users/' + user.id + '/'+session);
              $(".settings").attr("href", '/users/settings/' +user.id + '/' + session);
              $(".logout").attr("href", 'users/logout');
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
      },

      fundDisplay: function(){
        var fund = new FundModel({
          fund_title: fundData[i].title,
          maximum_amount: "£" + fundData[i].maximum_amount,
          minimum_age: fundData[i].minimum_age,
          maximum_age: fundData[i].maximum_age,
          fund_id: fundData[i].id,
          description: fundData[i].description,
          fund_link: fundData[i].link
        });

        var view = new FundView({ model: fund });

        this.$el.append(view.render().el);
        var countries = fundData[i].countries;
               if(!countries){
                   $(".nationalities"+ fundData[i].id).toggle(false);
               }
               else{
                 console.log(countries.length);
                 if(countries.length > 4){
                   for(var k = 0; k < 4; k++){
                     $(".nationalities" + fundData[i].id).append("<span class= 'label label-info'>" + countries[k] + "</span>");
                     $(".nationalities" + fundData[i].id+ " span").css("margin-left", "5px");
                     $(".nationalities" + fundData[i].id).css('textTransform', 'capitalize');
                     if(k == 3){
                       $(".nationalities" + fundData[i].id).append("<span> ... </span>");
                     }
                   }
                 }
                 else{
                   for(var j = 0; j < countries.length; j++){
                     $(".nationalities" + fundData[i].id).append("<span class= 'label label-info'>" + countries[j] + "</span>");
                     $(".nationalities" + fundData[i].id+ " span").css("margin-left", "5px");
                     $(".nationalities" + fundData[i].id).css('textTransform', 'capitalize');
                   }
                 }
               }

               if(!fundData[i].minimum_amount){
                 $(".fund_min_amount" + fundData[i].id).toggle(false);
                 $(".fund_max_amount" + fundData[i].id).children('.control').addClass("max_amount"+ fundData[i].id);
                 $(".max_amount" + fundData[i].id).addClass("label label-danger");
                 $(".max_amount" + fundData[i].id).html("Under £" + fundData[i].maximum_amount);
               }
               if(!fundData[i].maximum_amount){
                 $(".fund_max_amount"+ fundData[i].id).toggle(false);
                 $(".fund_min_amount"+ fundData[i].id).children('.control').addClass("min_amount"+ fundData[i].id);
                 $(".min_amount" + fundData[i].id).addClass("label label-warning");
                 $(".min_amount"+ fundData[i].id).html("£" + fundData[i].minimum_amount + "+");
               }
               if(fundData[i].maximum_amount && fundData[i].minimum_amount){

                 $(".fund_min_amount"+ fundData[i].id).children('.control').addClass("min_amount"+ fundData[i].id);
                 console.log($(".fund_min_amount"+ fundData[i].id).children('.control'));
                 $(".min_amount" + fundData[i].id).addClass("label label-warning");
                 $(".min_amount"+ fundData[i].id).html("£" + fundData[i].minimum_amount);
                 $(".fund_min_amount" + fundData[i].id).append("<span id='minus-sign'> - </span>");
                  $(".fund_max_amount" + fundData[i].id).children('.control').addClass("max_amount"+ fundData[i].id);
                 $(".max_amount" + fundData[i].id).addClass("label label-danger");
                 $(".max_amount" + fundData[i].id).css("margin-left", "-26px");
               }
               if(!fundData[i].maximum_age){
                 $(".fund_max_age"+ fundData[i].id).toggle(false);
                 $(".fund_min_age"+ fundData[i].id).children('.control').addClass("min_age"+ fundData[i].id);
                 $(".min_age" + fundData[i].id ).addClass('label label-success');
                 $(".min_age"+ fundData[i].id).html(fundData[i].minimum_age + "+");
               }
               if(!fundData[i].minimum_age){
                 $(".fund_min_age"+ fundData[i].id).toggle(false);
                 console.log("THIS IS", fundData[i]);
                 $(".fund_max_age" + fundData[i].id).children('.control').addClass("max_age"+ fundData[i].id);
                 $(".max_age" + fundData[i].id).addClass("label label-success").html("Under " + fundData[i].maximum_age);
               }
               if(fundData[i].maximum_age && fundData[i].minimum_age){
                 $(".fund_min_age"+ fundData[i].id).children('.control').addClass("min_age"+ fundData[i].id);
                 $(".min_age" + fundData[i].id).addClass("label label-success");
                 $(".fund_min_age" + fundData[i].id).append("<span id='minus-sign'> - </span>");
                 $(".fund_max_age" + fundData[i].id).children('.control').addClass("max_age"+ fundData[i].id);
                 $(".max_age" + fundData[i].id).addClass("label label-success");
                 $(".max_age" + fundData[i].id).css("margin-left", "-26px");
               }
      },

      infoToggle: function(){
        $("#" + fundData[i].id).css("margin-top", "20px");
        $("#" + fundData[i].id).css("margin-bottom", "15px");
        $("#" + fundData[i].id).css("font-size", "16px");
        $("#" + fundData[i].id).on("click", function() {
          if(bool){
            $(this).children("span").toggle(false);
            bool = false;
          }
          else{
            $(this).children("span").css("display" , "block");
            $(this).children("span").css("margin-top" , "5px");
            $(this).children("span").css("padding", "15px");
            $(this).find("li").css("list-style-type", "disc");
            bool = true;
          }
        });
      }
   });

  var FundList = new FundList();
  }




  function doneResizing() {
    var form = document.getElementsByClassName("search_form");

    if(Modernizr.mq('screen and (min-width:920px)')) {
      // action for screen widths including and above 768 pixels
      $(".navbar-header").append(form);
    }
    else if(Modernizr.mq('screen and (max-width:920px)')) {
      // action for screen widths below 768 pixels
      $("#about").prepend(form);
    }
  }

  var id;

  $(window).resize(function() {
    clearTimeout(id);
    id = setTimeout(doneResizing, 0);
  });

  doneResizing();
});
