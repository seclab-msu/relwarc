params = "content_type="+"announcement";
var formFields = params + "&nocache="+Math.random();
formFields += '&jxcall=cms-fetch-jx';
$.ajax({
	type: "POST",
	cache: false,
	url: "/urlAjax.php",
	data : formFields,
	dataType:"json"
}).done(function( data ) {
	$("#showcontent").html( data.msg );
	if(data.status == "*OK*"){
		//ret = data.msg
		pagination(data.recs);
		displaycontent(data.msg)
	} else if(data.status == "*NO*"){
		displaycontent('');
	}
});