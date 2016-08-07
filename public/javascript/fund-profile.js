$(document).ready(function(){
	var FundModel = Backbone.Model.extend({

	});
	$("#name").html(fund.username);


$("#profile-figure").hover(function(){
$("#add-profile").css("display", "inline");
}, function(){
$("#add-profile").css("display", "none");
});

$("#add-profile").click(function() {
    $("input[id='my_file']").click();
	});
	$("input[id='my_file']").change(function(){

    if (this.files && this.files[0]) {

      var reader = new FileReader();

      reader.onload = function (e) {

      $('#fund-picture')
        .attr('src', e.target.result)
        .width(250)
        .height(250);
      };

		 		reader.readAsDataURL(this.files[0]);
		}
		var file = this.files[0];
		var data = new FormData();
		data.append('profile_picture', file);
		data.append('fund', fund.id);
		$.ajax({
			type: "POST",
			url: "/user-edit/profile-picture",
			data: data,
			processData: false,
			contentType: false,
		}).then(function(data){
			Logger.info("SUCCESS", data);
		})
})






})
