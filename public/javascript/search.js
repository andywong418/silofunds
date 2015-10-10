$(document).ready(function() {
    function doneResizing() {
    	var form = document.getElementsByClassName("search_form");
        if(Modernizr.mq('screen and (min-width:920px)')) {
            // action for screen widths including and above 768 pixels 
            $(".navbar-header").append(form);


        }
        else if(Modernizr.mq('screen and (max-width:920px)')) {
            // action for screen widths below 768 pixels 
            	
        	$("#about").prepend(form);

        }
    }

    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(doneResizing, 0);
    });

    doneResizing();
    $("#checkbox").click(function(){
    	
    	$(".description_control").css("display" , "block");
    	$(".description_control").css("margin-top" , "5px");
    	$(".description_control").toggle(this.checked);
    // 	if(!$("checkbox").checked){
    // 	$(".description_control").toggle(this.checked);
    // }
    //   else{

    //   }
       

    })
      
});