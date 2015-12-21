$(document).ready(function() {
  var bool = false;

  console.log(fundData);
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
          minimum_amount: "£" + fundData[i].minimum_amount,
          minimum_age: fundData[i].minimum_age,
          maximum_age: fundData[i].maximum_age,
          countries: fundData[i].countries,
          fund_id: fundData[i].id,
          description: fundData[i].description,
          fund_link: fundData[i].link
        });

        if(fundData[i].countries){
          console.log(fundData[i].countries);
          fund.countries = fundData[i].countries.toString();
          
        }
      
       
        $(".nationalities" + fundData[i].id).css('textTransform', 'capitalize');
        
        var view = new FundView({ model: fund });

        this.$el.append(view.render().el);
         if(!fundData[i].countries){
            $(".nationalities"+ fundData[i].id).toggle(false);
        }
        $(".nationalities" + fundData[i].id).css('textTransform', 'capitalize');

        if(!fundData[i].minimum_amount){
          $(".fund_min_amount"+ fundData[i].id).toggle(false);
        };


        if(!fundData[i].maximum_amount){
          $(".fund_max_amount"+ fundData[i].id).toggle(false);
        };

        if(!fundData[i].maximum_age){
          $(".fund_max_age"+ fundData[i].id).toggle(false);
        };

        if(!fundData[i].minimum_age){
          $(".fund_min_age"+ fundData[i].id).toggle(false);
        };
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
            $(this).find("li").css("line-height", "30px");
            bool = true;
          }
        });
      }
   });

  var FundList = new FundList();
  }

//   var UserNavView = Backbone.View.extend({
//   tagname: 'ul',
//   template: _.template($('#usernav-template').html()),
//   render: function() {
//         this.$el.html(this.template(this.model.toJSON()));
//         return this; // enable chained calls
//   }

// });



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
