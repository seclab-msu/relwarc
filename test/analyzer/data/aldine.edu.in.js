var params = "";
function fetchContent(){
    var ret='';
    var formFields = params + "&nocache="+Math.random();
        formFields += '&jxcall=cms-fetch-jx';
    $.ajax({
        async:false,
        type: "POST",
        cache: false,
        url:"./urlAjax.php",
        data : formFields,
        dataType:"json"
    }).done(function( data ){ /* ... */ });
    return ret;
}

function fetchNdisplay(){
    var ret='';
    var formFields = params + "&nocache="+Math.random();
        formFields += '&jxcall=cms-fetch-jx';
    $.ajax({
        //async:false,
        type: "POST",
        cache: false,
        url: "/urlAjax.php",
        data : formFields,
        dataType:"json"
    }).done(function( data ) { /* ... */
    });
    //return ret;
}
params = "content_type="+"announcement";
fetchNdisplay();