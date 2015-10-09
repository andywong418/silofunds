/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

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
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});


if ( $('body').css("width") === "920px") {
    $('.results').append("<form action='/search' method='post' name='search_form' class='search_form'>
                  <input type='text' name='tags' id='text_search' placeholder='Search terms'/>
                  <input type='number' name='amount' id='amount_req' placeholder='Amount'/>
                  <input type='number' name='age' id='age' placeholder='Age'/>
                  <button id='search_button' type='submit' class='btn btn-danger'>Search</button>
                </form>");
}
