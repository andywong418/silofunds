

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
    var bool = false;

    $(".fund_description").click(function(){
    	if(bool){
    		$(this).children("span").toggle(false);
    		bool = false;
    		
    	}
    	else{

         $(this).children("span").css("display" , "block");
    	   $(this).children("span").css("margin-top" , "5px");
    	   bool = true;
         
    	}

    })
      
});