/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

var Scrollview = Backbone.View.extend({
    el: ".navbar",
    initialize: function() {
        _.bindAll(this, "render", "collapseNavbar");
        this.render();
    },

    render: function(){
        $(window).on("scroll", this.collapseNavbar);
    },

    collapseNavbar: function(){
        if (this.$el.offset().top > 50) {
         $(".navbar-fixed-top").addClass("top-nav-collapse");
        } 
        else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
        }
    }

})
    var scrollView = new Scrollview();
    
// // jQuery to collapse the navbar on scroll
// $(window).scroll(function() {
//     if ($(".navbar").offset().top > 50) {
//         $(".navbar-fixed-top").addClass("top-nav-collapse");
//     } else {
//         $(".navbar-fixed-top").removeClass("top-nav-collapse");
//     }
// });

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
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

})
var menuView = new Menuview();
// $('.navbar-collapse ul li a').click(function() {
//     $('.navbar-toggle:visible').click();
// });


