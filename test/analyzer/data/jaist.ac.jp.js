aform = new Object;
aform.id = '1';
aform.logger_url = '/contact/cgi-bin/aform_logger.cgi';
aform.checker_url = '/contact/cgi-bin/aform_checker.cgi';
aform.phrases = {"Input error:": "入力エラー:"};
aform.static_uri = '/mt-static_mt6/';
aform.require_ajax_check = '';
aform.is_active = 'published';
aform.check_immediate = '1';
aform.parameters = new Object;
aform.datepickers = new Object;
aform.relations = new Object;
aform.relations = {}
aform.payment = { parts_id: '', field_id: '', methods: {} };
aform.recaptcha = new Object;
function postAFormActiveChecker(aform_id) {
	var params = {
		__mode : 'rebuild_aform',
		aform_id : aform_id
	};
	jQuery.ajax({
	    url: aform.checker_url,
	    dataType: 'jsonp',
	    data: params,
	    success: reload_if_rebuild
	});
}