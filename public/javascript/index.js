// jQuery for page scrolling feature - requires jQuery Easing plugin
$(document).ready(function() {
  var Scrollview = Backbone.View.extend({
    el: ".navbar",
    events: {
      "click #features": "scrollTo"
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
    scrollTo: function(){
        $('html, body').animate({
        scrollTop: $("#showcase").offset().top -20
        }, 1500, "easeOutQuart");
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
    console.log('Email is ' + email);
    console.log('posting....');

    var posting = $.post(url, { email: email });

    posting.done(function(data) {
      console.log('Finished post request.');
    });
  });

  var scrollView = new Scrollview();
  var menuView = new Menuview();
  $("#about-scroll").click(function(){
    $('html, body').animate({
        scrollTop: $("#about-us").offset().top-80
        }, 1500, "easeOutQuart");
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


  $(window).scroll(function(event) {
    $(".module-2").each(function(i, el){
       var el = $(el);
        if (el.visible(true)) {
          el.addClass("come-in-2");
        }
    })
  });
  var className;
  $(".footer-distributed .footer-right a").hover(function(){
   var classNameArray = $(this).children().attr('class').split(" ");
    className = classNameArray[1];
    $("i." + className).css("color", "#22313F");
  }, function(){
    console.log("CLASS", className);
    $("i." + className).css("color", "white");
  })
});
