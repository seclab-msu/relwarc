baseUri = '/';
var page;
var deferScripts = [
    "/assets/bootstrap4/js/tether.min.js",
    "/assets/bootstrap4/js/bootstrap.min.js",
    "/js/tr_dl.js?v=4",
    "/js/tr_functions.js",
    "/assets/suggest/searchbox_tv.min.js?v=1",
];

var deferCsss = [
    "/assets/css/font-awesome.min.css",
    /* "/assets/scss/tv-main.min.css", */
];
function jqr() {

    for (i in deferScripts) {
        var element = document.createElement("script");
        var arr = deferScripts[i].split(/\//);
        var arr2 = arr[arr.length - 1].split(/\./);
        arr2.pop();
        var scriptName = arr2.join('_');
        scriptName = scriptName.replace(/\-/i, '_');

        if (typeof window[scriptName + '_ready'] != 'undefined') {
            element.onload = window[scriptName + '_ready'];
        }
        element.src = deferScripts[i];
        document.body.appendChild(element);
    }

    jqr_eb();
}

function jquery_bpopup_ready() {
}

function jwplayer_ready() {
}

function byteark_player_min_ready() {
                window.mobilecheck = function() {
                var check = false;
                (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
                return check;
            };
            var playerOptions = {};
            if (playerOptions.adOptions) {
                var descriptionUrl = document.location.href;
                if (mobilecheck()) {
                    playerOptions.adOptions.adTagUrl = playerOptions.adOptions.adTagUrl.replace('[description_url]', encodeURIComponent(descriptionUrl));
                }
                else {
                    playerOptions.adOptions.adTagUrl = playerOptions.adOptions.adTagUrl.replace('[description_url]', descriptionUrl);
                }

                if (cX && cX.getUserSegmentIds) {
                    var userSegments = cX.getUserSegmentIds({persistedQueryId:'5cc530d31c224fa7f39b5355f1429a8e0be00f42'});
                    if (userSegments.length) {
                        var cxSegmentKV = userSegments.join('%2C');
                        playerOptions.adOptions.adTagUrl += '&cust_params=CxSegments%3D' + cxSegmentKV;
                    }
                }
            }

    var player = byteark('video-145220', playerOptions);player.on('ended', function() {
    var src_videoJs = player.currentSrc();
    var src_video = '/vod/2017/07/19/145220/hls_index.m3u8';
    var nextUrl = '/clip/164802';
    if(src_videoJs == src_video){
        $.get(urlGetSession, function(data, status){
             var result = JSON.parse(data);
             if(result.status === true){
                $('#progressVideo').css("display", 'inherit');
                setTimeout(function(){
                    window.location.href = nextUrl
                }, 2300);
             }
         });
    }
});}

var suggestUrl = baseUri + 'search/suggest';

new Vue({
	el: '.suggestion',
	data: {
		q: '',
		type: 'tv',
		result: []
	},
	computed: {
		// Flag à¸ªà¸³à¸«à¸£à¸±à¸šà¹€à¸Šà¹‡à¸„à¸§à¹ˆà¸²à¸ˆà¸°à¹ƒà¸«à¹‰à¹à¸ªà¸”à¸‡à¸œà¸¥ Suggestion Box à¸«à¸£à¸·à¸­à¹„à¸¡à¹ˆ
		isShow: function(){
			if(this.result.length <= 0 || this.q.trim().length == 0){
				return false; // à¸—à¸¸à¸à¸›à¸£à¸°à¹€à¸ à¸—à¹„à¸¡à¹ˆà¸¡à¸µà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹à¸ªà¸”à¸‡à¹€à¸¥à¸¢ à¹„à¸¡à¹ˆà¸•à¹‰à¸­à¸‡à¹à¸ªà¸”à¸‡ Suggestion Box
			}
			return true;
		}
	},
	watch: {
		q: function(query){
			if(query.trim().length > 0){
				this.getResult();
			} else {
				this.result = [];
			}
		}
	},
	methods: {
		getResult: function(){
			var vm = this
			axios.get(suggestUrl,{
					params: {
						q: this.q,
						type: this.type
					}
				})
				.then(function(response){
					vm.result = response.data.items;
					
					// Highlight Keyword
					for(var type in vm.result){
						for(var x in vm.result[type]){
							var text = vm.result[type][x].title;
							var re = new RegExp("(" + vm.q + ")(?![^<]*>|[^<>]*</)",'g');
							vm.result[type][x].title = text.replace(re,'<strong>$1</strong>');
						}
					}
					
					// à¸•à¸±à¸”à¸œà¸¥à¸¥à¸±à¸žà¸˜à¹Œà¸šà¸²à¸‡à¸ªà¹ˆà¸§à¸™à¸­à¸­à¸à¸«à¸²à¸à¹€à¸›à¹‡à¸™à¸à¸²à¸£à¹à¸ªà¸”à¸‡à¸œà¸¥à¹ƒà¸™ Mobile
					var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
					if(width < 768){
						vm.result.tvprogram = vm.result.tvprogram.slice(0,2);
						vm.result.videoplaylist = vm.result.videoplaylist.slice(0,2);
						vm.result.video = vm.result.video.slice(0,2);
					}
				})
				.catch(function(error){
					vm.result = []
					console.log(error);
				})
		}
	}
});

var re = new RegExp(/^.*\//);
var baseUrl = re.exec(window.location.href);
var url = baseUri + 'clip/ondemandapi';
var urlSession = baseUri + 'clip/setSessionAjax';
var urlGetSession = baseUri + 'clip/getSessionVideo';

function loadmore(){
	var playlistItem = $('.itemsList');
    var arrId = [];
    var arrClip = [];
    playlistItem.map(function(item, no) {
   		arrId.push($(this).attr('data-id'));
   	});
    var data = {'type': 'loadmore', 'arrId': arrId, 'id': id};
    $.ajax({
		 type: 'POST',
		 url: url,
		 data: {result:JSON.stringify(data)},
		 success: function(res){
			 if(!jQuery.isEmptyObject(res)){
				 jQuery.each(res, function(index, item){
					 arrClip.push(item);
					 if(index == 0){
						 nextId = item.id;
					 };
					 html  = "<article class='col-12 col-lg-4 itemsList' data-id='" + item.id + "'>\n";
					 html += "<div class='row'>\n";
					 html += "<div class='col-12 col-lg-12'>\n";
					 html += "<a href='" + item.url + "' class='icon-play'>\n";
					 html += "<img src='" + item.imagePath + "' class='img-fluid'>\n</a>\n";
					 html += "</div>\n";
					 html += "<div class='col-12 col-lg-12 pt-2 pb-2'>\n";
					 html += "<div>\n";
					 html += "<a href='" + item.url + "'><h3>" + item.title + "</h3></a>\n";
					 html += "</div>\n";
					 html += "<div class='time'>" + item.publishTime + "</div>\n";
					 html += "</div></div></article>";
					 
					 $('#load-more-content').append(html);
				 });
				 $('html, body').animate({
					scrollTop: ($('.itemsList[data-id='+nextId+']').offset().top - 50)
				 }, 500);
			 }else{
				 $('.btn-loadMore').remove();
				 $('#noContent').text("No more content");
				 return false
			 }
		 }
	});
};


$('#e').on('change', function(e){
	e.stopPropagation();
	this.value = this.checked ? 1 : 0;
	
	$.ajax({
		 type: 'POST',
		 url: urlSession,
		 data: {
			toggle: this.value 
		 },
		 success: function(data){
	        
		 }
	 });
});

var re = new RegExp(/^.*\//);
var baseUrl = re.exec(window.location.href);
var url2 = baseUri + 'tv/clipapi';

new Vue({
	  el: '#clip-ondemand',
	  data: {
	    clip: [],
	  },
	  mounted () {
		    this.getPosts('clipapi');
	},
	  methods: {
	    getPosts(section) {
	      axios.post(url, {
		    	'section': 'clip',
		    	'id': id
		    }).then((response) => {
		    	this.clip = response.data;
	      }).catch( error => { console.log(error); });
	    } 
	 }
});

new Vue({
	  el: '#load-more',
	  data: {
		  moreclip: []
	  },
	  methods: { 
	    loadmore: function (event) {
	    	var self =  this;
	       var clipItems = $('.itemsList');
	       var arrId = [];
	       clipItems.map(function(item, no) {
		   		arrId.push($(this).attr('data-id'));
		   	});
	  	      axios.post(url2, {
	  		    	'section': 'loadmore',
	  		    	'id': id,
	  		    	'arrId': arrId,
	  		    }).then((response) => {
	  		    	response.data.map(function(item, key) {
	  		    		self.moreclip.push(item);
	  		    		if(key == 0){
	  		    			 nextId = item.id;
	  		    		}
	  		    	});
	  		    	 this.moreclip = self.moreclip; 	        
	  	      }).catch( error => { console.log(error); });  
	    	} 
	  },
	  updated () {
		  $('html, body').animate({
				scrollTop: ($('.itemsList[data-id='+nextId+']').offset().top - 50)
				}, 500);
	  }
});