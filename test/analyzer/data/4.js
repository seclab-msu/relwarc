(function () {
	if (typeof fetch === "function") {
		var w = window.location.href;
		if (w.indexOf(".php") == -1) {
			var data = "action=wikiPageView&url=" + encodeURIComponent(w);
			fetch("/stats/", {
				method: "POST",
				headers: new Headers({
					"Content-Type": "application/x-www-form-urlencoded",
				}),
				body: data,
			});
		}
	}
})();
