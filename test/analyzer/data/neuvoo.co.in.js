var app          = new Object();
app.country = "in";
app.language = "en";
function alert_banner_new(){
    if(app.keyword =="" && app.location ==""){
        return true;
    }

    $("#salary-card").addClass("show-elem");
    var request          = new Object();
        request.k        = $("#nv-k").val();
        request.l        = $("#nv-l").val();
        request.country  = app.country ;
        request.lang     = app.language;
        request.source   = "email_registration";

        if(!$("#register-mail-pop").length > 0){

            where = "/services/email-register-popup/email_side_v3.php";

            $.get(where,request,function(data){
                $("#nv-register").append(data);
                $("#nv-register").css("display","inline-block");
            })
        }
}
alert_banner_new();