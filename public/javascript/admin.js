$(function() {
  $("#clear_gender").click(function(evt) {
    evt.preventDefault();

    $("#male, #female").prop("checked", false);
  });

  $("#clear_merit").click(function(evt) {
    evt.preventDefault();

    $("#merit, #finance").prop("checked", false);
  });

  try {
    if(fund.gender != null) {
      $("#" + fund.gender).prop("checked", true);
    }

    if(fund.merit_or_finance != null) {
      $("#" + fund.merit_or_finance).prop("checked", true);
    }

    if(fund.invite_only) {
      $("#invite").prop("checked", true);
    }
  } catch (e) {
    console.log("Caught the error ;)");
  }
});
