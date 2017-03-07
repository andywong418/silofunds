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

  // Segmentation for Postgrad
  $('form[name="seg_pg"]').submit(function(e) {
    e.preventDefault();

    // Alert if input is empty;
    var input = $('input[form="seg_pg"]').val();
    if (input === '') {
      alert("Input cannnot be empty");
      return false;
    }

    var url = e.currentTarget.action;
    var params = $('input[form="seg_pg"]').val().split(",").map(function(tag) {
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

      $('td#seg-pg-result').html(str);
    });

    return false;
  });

  // Segmentation for Undergrad
  $('form[name="seg_ug"]').submit(function(e) {
    e.preventDefault();

    // Alert if input is empty;
    var input = $('input[form="seg_ug"]').val();
    if (input === '') {
      alert("Input cannnot be empty");
      return false;
    }

    var url = e.currentTarget.action;
    var params = $('input[form="seg_ug"]').val().split(",").map(function(tag) {
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

      $('td#seg-ug-result').html(str);
    });

    return false;
  });

  // Segmentation for Colleges
  $('form[name="seg_colleges"]').submit(function(e) {
    e.preventDefault();

    // Clear existing entries so won't duplicate the appends later.
    $('tr').remove('.seg-colleges');

    var url = e.currentTarget.action;

    $.ajax({
      url: url,
      method: "GET",
    }).done(function(college_counts) {
      for (var key in college_counts) {
        // skip loop if the property is from prototype
        if (!college_counts.hasOwnProperty(key)) continue;

        var count = college_counts[key];
        var percentage = (count / userCount) * 100;
        var countStr = count + " (" + percentage.toFixed(2) + "%)";

        $('table#seg-colleges tbody').append("<tr class='seg-colleges'><td>" + key + "</td><td>" + countStr + "</td></tr>");
      }
    });

    return false;
  });

  // Segmentation for Subjects
  $('form[name="seg_subjects"]').submit(function(e) {
    e.preventDefault();

    // Clear existing entries so won't duplicate the appends later.
    $('tr').remove('.seg-subjects');

    var url = e.currentTarget.action;

    $.ajax({
      url: url,
      method: "GET",
    }).done(function(subject_counts) {
      for (var key in subject_counts) {
        // skip loop if the property is from prototype
        if (!subject_counts.hasOwnProperty(key)) continue;

        var count = subject_counts[key];
        var percentage = (count / userCount) * 100;
        var countStr = count + " (" + percentage.toFixed(2) + "%)";

        $('table#seg-subjects tbody').append("<tr class='seg-subjects'><td>" + key + "</td><td>" + countStr + "</td></tr>");
      }
    });

    return false;
  });
});
