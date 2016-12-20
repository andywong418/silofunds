$(document).ready(function() {
  var initialsCircle = '.initials.circle'
  for(var i = 0; i < 10; i++) {
    newInitialsCircle = initialsCircle + '.' + i.toString();
    if(i % 3 == 2) {
      $(newInitialsCircle).css('background-color', '#00da8d')
    } else if (i % 3 == 0) {
      $(newInitialsCircle).css('background-color', '#7068FF')
    } else {
      $(newInitialsCircle).css('background-color', '#FFC300')
    }
  }
})
