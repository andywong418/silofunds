$(document).ready(function() {
  $("button.enquire").click(function(e) {
    var company_name = e.target.getAttribute('data-name');
    var job_id = e.target.getAttribute('data-id');
    var company_url = e.target.getAttribute('data-url');

    window.location.href = "mailto:andros@silofunds.com?subject=Enquiry about " + company_name + " (id: " + job_id + ") job listing";
  });
});
