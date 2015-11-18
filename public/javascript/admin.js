$(function() {
  $("#clear_gender").click(function(evt) {
    evt.preventDefault();

    $("#male, #female").prop("checked", false);
  });

  $("#clear_merit").click(function(evt) {
    evt.preventDefault();

    $("#merit, #finance").prop("checked", false);
  });
});
