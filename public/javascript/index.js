// jQuery for page scrolling feature - requires jQuery Easing plugin
$(document).ready(function() {
  var Scrollview = Backbone.View.extend({
    el: ".navbar",
    events: {
      "click #features": "scrollToFeatures",
      "click #about-scroll": "scrollToAbout"
    },
    initialize: function() {
      _.bindAll(this, "render", "collapseNavbar");
      this.render();
    },

    render: function(){
      $(window).on("scroll", this.collapseNavbar);
    },

    collapseNavbar: function(){
      if(!resultsPage){
        if (this.$el.offset().top > 50) {
         $(".navbar-fixed-top").addClass("top-nav-collapse");
         $(".cd-signup").css("border", "none");
         $(".cd-signup").css("margin-top", "5px");
        }
        else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
        $(".cd-signup").css("border", "2px solid");
        $(".cd-signup").css("border-radius", "10px");
        $(".cd-signup").css("margin-top", "3px");
        }
      }
    },
    scrollToFeatures: function(){
      $('html, body').animate({
        scrollTop: $("#about-us").offset().top -20
      }, 1500, "easeOutQuart");

      return false;
    },

    scrollToAbout: function() {
      $('html, body').animate({
        scrollTop: $("#about-us").offset().top-80
      }, 1500, "easeOutQuart");

      return false;
    }
  });

  // Closes the Responsive Menu on Menu Item Click
  var Menuview = Backbone.View.extend({
    el: '.navbar-collapse ul li a',

    events:{
      "click": "navbarToggle"
    },

    navbarToggle: function(){
      $('.navbar-toggle:visible').click();
    }
  });

  $('form.subscribe').submit(function(e) {
    e.preventDefault();

    var $form = $(this);
    var email = $form.find('input[name="subscription_email"]').val();
    var url = $form.attr("action");

    var posting = $.post(url, { email: email });

    posting.done(function(data) {
    });
  });

  var scrollView = new Scrollview();
  var menuView = new Menuview();

  // remove parameter from query string if value === ''
  $("form#search-form").submit(function(event) {
    event.preventDefault();
    var currentTarget = event.target;
    var emptyInputFields = 0;
    var searchFormInputs = $("form#search-form input");
    console.log(searchFormInputs);
    for (var i = 0; i < searchFormInputs.length; i++) {
      var id = searchFormInputs[i].id;

      if($("#" + id).val() === "") {
        $("#" + id).attr("name", "");

        emptyInputFields++;
      }
    }

    if (emptyInputFields === searchFormInputs.length) {
      $("button#search_button").prepend("<input id='all', type='hidden', name='all', value='true', style='opacity:0; position:absolute; left:9999px;'>");
      $('.error-text').show();
    }
    else{
      currentTarget.submit();
    }


  });

  $(function() {
    $(window).scroll( function(){

        /* Check the location of each desired element */
        $('.hideme').each( function(i){

            var bottom_of_object = $(this).offset().top + ($(this).outerHeight() /2);
            var bottom_of_window = $(window).scrollTop() + $(window).height();

            /* If the object is completely visible in the window, fade it it */
            if( bottom_of_window > bottom_of_object ){

                $(this).animate({'opacity':'1'},1500);

            }

        });

    });
  });


  (function($) {

    $.fn.visible = function(partial) {

        var $t            = $(this),
            $w            = $(window),
            viewTop       = $w.scrollTop(),
            viewBottom    = viewTop + $w.height(),
            _top          = $t.offset().top,
            _bottom       = _top + $t.height(),
            compareTop    = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;

      return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };

  })(jQuery);

  $(window).scroll(function(event) {

    $(".module").each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("come-in");
      }
    });

  });
$('#start-now, #fund-sign-up').click(function(){
  $('a.cd-signup').click();
});
var parallax = document.querySelectorAll(".parallax"),
      speed = 0.5;


  $(window).scroll(function(event) {
    $(".module-2").each(function(i, el){
       var el = $(el);
        if (el.visible(true)) {
          el.addClass("come-in-2");
        }
    });
    $(".module-3").each(function(i, el){
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("come-in-3");
      }
    });

  });
//   $.stellar({
//     horizontalScrolling: false,
//      verticalOffset: -380,
//      horizontalOffset: 0
// });
  var viewPortWidth = $(window).width();
  if(viewPortWidth < 994){
    $('#relevant-div').css('background-repeat', 'none');
    $('#relevant-div').css('background-position', 'center');
    $('#relevant-div').css('background-attachment', 'fixed');
  }
  if(viewPortWidth < 991){
    $('#application-row').insertBefore($('#application-text'));
  }


  var className;
  $(".footer-distributed .footer-right a").hover(function(){
   var classNameArray = $(this).children().attr('class').split(" ");
    className = classNameArray[1];
    $("i." + className).css("color", "#22313F");
  }, function(){
    $("i." + className).css("color", "white");
  });
  //mixpanel checking actions prior to signin
  var mixpanelClickCheck = [];
  $(document).click(function(e){
    console.log(e);
    console.log(e.target);
    mixpanelClickCheck.push(e.target.outerHTML);
    if($(e.target).attr('id') == 'signup-button'){
      //track array and page
      console.log(mixpanelClickCheck);
      mixpanel.track(
        "Pre Signup Action",
        {"page": "homepage", "actions": mixpanelClickCheck}
      );
    }
    // if(e.target !=)
  });
});
