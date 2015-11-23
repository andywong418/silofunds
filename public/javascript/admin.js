$(function() {
  $("#clear_gender").click(function(evt) {
    evt.preventDefault();

    $("#male, #female").prop("checked", false);
  });

  $("#clear_merit").click(function(evt) {
    evt.preventDefault();

    $("#merit, #finance").prop("checked", false);
  });

  /////////////////////////// Download JSON Link

    var array_of_obj = fundData;
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(array_of_obj));

    var a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'data.json';
    a.innerHTML = 'Download JSON';

    var container = document.getElementById('downloader');
    container.appendChild(a);

  ///////////////////////////

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
