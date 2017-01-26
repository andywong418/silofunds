$(document).ready(function() {

  // Segmentation for UK and NON-UK
  $('form[name="seg_uk"]').submit(function(e) {
    e.preventDefault();

    // Alert if input is empty
    var input = $('input[form="seg_uk"]').val();
    if (input === '') {
      alert("Input cannot be empty.");
      return false;
    }

    var url = e.currentTarget.action;
    var params = $('input[form="seg_uk"]').val().split(",").map(function(tag) {
      return tag.trim();
    });

    $.ajax({
      url: url,
      method: "GET",
      data: {
        tags: params,
      },
    }).done(function(res) {
      var percentage = (res / userCount) * 100;
      var str = res + " (" + percentage.toFixed(2) + "%)";

      $('td#seg-uk-result').html(str);
    });

    return false;
  });
});
