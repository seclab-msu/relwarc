<script type="text/javascript">
$(document).ready(function()
{
	$("#aa").css("width", "100%");
	$('select').on('change', function() 
	{
		$("#aa").css("width", "50%");
		$('#sel_sub_position').css('display', 'block');
		var posi_id= $("#sel_posi").val();
		$.ajax({
			type : "POST",
			url  : '/educba.com/sel_sub_posi.php',
			data: { 'mposi': posi_id },
			async: true,
			success : function(resp1)
			{
				$("#sel_sub_position").html("");
				$("#sel_sub_position").html(resp1);
			}
		});
	});
});
</script>
<div class="col-md-6" id="aa">
<select class="form-control" name="sel_posi" id="sel_posi" placeholder="Validate Select" style="border-radius:5px" required>
	<option value="">Select Position</option>
					<option value="1">GRAPHICS & ANIMATION</option>
					<option value="2">SALES & MARKETING</option>
					<option value="3">TECHNOLOGY</option>
					<option value="4">COURSE COORDINATOR</option>
					<option value="12">Freelance IT & Software Trainers</option>
	</select>
</div>
<div class="col-md-6 " id="sel_sub_position" style="display:none;">
	<select class="form-control" name="sel_sub_posi" id="sel_sub_posi" placeholder="Validate Select" style="border-radius:5px;" required>
		<option value="">Select Sub Position</option>
	</select>
</div>