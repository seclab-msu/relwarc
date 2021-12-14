sticky = function(selector,bottom){
    setTimeout(function(){
        if (!!$(selector).offset()) {
            var stop_top = $(selector).offset().top;
            var ads_height = $(selector).innerHeight();
            var ads_width = $(selector).innerWidth();
            var display = $(bottom).offset().top - stop_top;
            
            if(display > ads_height + 50){
                $(window).scroll(function(){
                    var window_top = $(window).scrollTop();
                    var stop_bottom = $(bottom).offset().top;

                    if(window_top + 30 < stop_top){
                        /*cháº·n trÃªn*/
                        $(selector).css({width: ads_width, position : 'absolute', top : stop_top});
                    }else if((window_top + 30 > stop_top ) && (window_top + ads_height + 40 < stop_bottom)){
                        /*slide*/
                        $(selector).css({width: ads_width, position: 'fixed', top: 10});
                    }else{
                        /*cháº·n dÆ°á»›i*/
                        $(selector).css({width: ads_width, position : 'absolute', top : stop_bottom - ads_height - 30});
                    } 
                });
            }else{
                $(selector).css("display", "block");
            }
        }
    },3000);
};