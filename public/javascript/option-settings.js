$(document).ready(function() {
  $("div.settings-tab-menu div.list-group a").click(function(e) {
    e.preventDefault();

    $(this).siblings('a.active').removeClass("active");
    $(this).addClass("active");

    var index = $(this).index();
    $("div.settings-tab div.settings-tab-content").removeClass("active");
    $("div.settings-tab div.settings-tab-content").eq(index).addClass("active");
  });

  // TODO: ABSTRACT BELOW BITCHHHH

  if(fund.gender !== null) {
    $("#" + fund.gender).prop("checked", true);
  }

  if(fund.merit_or_finance !== null) {
    $("#" + fund.merit_or_finance).prop("checked", true);
  }

  $("#clear_gender").click(function(evt) {
    evt.preventDefault();

    $("#male, #female").prop("checked", false);
  });

  $("#clear_merit").click(function(evt) {
    evt.preventDefault();

    $("#merit, #finance").prop("checked", false);
  });

  ///////////
});
