$(document).ready(function() {

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
        console.log(splitDescriptionArray);
        console.log(description);
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
          console.log(finalDescription);
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
