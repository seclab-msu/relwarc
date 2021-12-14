var api = "/api/v0.1/";
function checkSignUpValids() {
	var email = $("#signup_email").val();
	$.post(api+"uniqcheck/uniqcheck.php", {field: "email", value: email}, function(result){
		if (result == "0") {
			$("#signup_email").addClass("input_valid").removeClass("input_unvalid");
			email_valid = true;
		} else {
			$("#signup_email").addClass("input_unvalid").removeClass("input_valid");
			email_valid = false;
		}
		checkSignUp();
	});
}
$("#signup_email, #signup_nick").keyup(function(){
	checkSignUpValids();
});