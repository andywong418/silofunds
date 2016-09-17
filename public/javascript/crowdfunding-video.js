$(document).ready(function() {
  initialWidth = $('.iframe').width();
  initialHeight = $('.iframe').height();
  videoRatio = initialWidth / initialHeight;
  iframeResize();
  $(window).resize(function() {
    iframeResize()
  })
})

var initialWidth;
var initialHeight;
var videoRatio;

function iframeResize() {
  if($(window).width() < 780) {
    var conclusionWidth = $('#conclusion').css('width')
    var newWidth = parseInt(conclusionWidth.split('p')[0])
    var widthChange = initialWidth - newWidth
    console.log(widthChange)
    // console.log(newWidth, 'NEW WIDTH')
    var newHeight = initialHeight - widthChange/videoRatio
    console.log(newHeight, 'NEW HEIGHT')
    $('.iframe').css('width', conclusionWidth);
    $('.iframe').css('height', newHeight);
  }
}
