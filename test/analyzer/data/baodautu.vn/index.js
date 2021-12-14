$(document).ready(function() {
    $("#ads_share_topbanner, #ads_share,#ads_share_vip,#ads_share_banner_left,#ads_share_banner_right,#ads_share_middle,#ads_share_right1,#ads_share_right2,#ads_share_right3,#ads_share_right4,#ads_share_right5,#ads_share_right6,#ads_share_right7,#ads_share_right8,#ads_share_right11,#ads_share_right12,#ads_share_middle1,#ads_share_middle2,#ads_share_middle3,#ads_share_middle4,#ads_share_middle5").innerfade({
        animationtype: "fade",
        speed: 2000,
        type: 'random',
        timeout: 15000
    });
});
(function() {
	var cx = '000480117788849223566:qlxi_7rziui';
	var gcse = document.createElement('script');
	gcse.type = 'text/javascript'; 
	gcse.async = true;
	gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
	    './cse/cse.js?cx=' + cx;
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(gcse, s);
})();
$(window).load(function(){
  $("#header").sticky({ topSpacing: 0 });
});
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','./analytics.js','ga');

ga('create', 'UA-38083262-1', 'auto');
ga('send', 'pageview');
_atrk_opts = { atrk_acct:"pe61l1aoHvD0WR", domain:".",dynamic: true};
(function() { var as = document.createElement('script'); as.type = 'text/javascript'; as.async = true; as.src = "./atrk.js"; var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(as, s); })();

(function() {
    var useSSL = 'https:' == document.location.protocol;
    var src = (useSSL ? 'https:' : 'http:') +
        './tag/js/gpt.js';
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
})();
(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "./vi_VN/sdk.js#xfbml=1&version=v2.0";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

$(document).ready(function(){
	$( ".expan_menu_mobile" ).click(function() {
	    $('.sub_menu_mobile').toggleClass('active');
	    $('.sub_menu_mobile li').show();
	    $('.search_item').hide();
	});
})

$(document).ready(function(){
    $( ".expan_search_mobile" ).click(function() {
        $('.sub_menu_mobile').toggleClass('active');
        $('.sub_menu_mobile li').hide();
        $('.search_item').show();
	});
})

var dayNames = [
	"Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư",
	"Thứ Năm", "Thứ Sáu", "Thứ Bảy"
];
function myTimer() {
	var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
	var hourFormatted = hour % 12 || 12;
	if (hourFormatted < 10) hourFormatted = "0" + hourFormatted;
    var minute = date.getMinutes();
    var minuteFormatted = minute < 10 ? "0" + minute : minute;
	var second = date.getSeconds();
    if (second < 10) second = "0" + second;
    var morning = hour < 12 ? "AM" : "PM";
	var dow = date.getDay();
	dow = dayNames[dow];
    var datetime = dow + " " + day + "/" + month + "/" + year + " " + hourFormatted + ":" + minuteFormatted + ":" + second + " " + morning;
    document.getElementById("clock").innerHTML = datetime;
	setTimeout(function(){ myTimer() }, 1000);
}
myTimer();

google_ad_client = "ca-pub-1179740479957749";
google_ad_slot = "1435232117";
google_ad_width = 160;
google_ad_height = 600;

function _showPopup(header, content, action,callback,mess,parent_id) {
    var temp = '<div id="dialog_comment"><div style="margin-top: -100px;"><div class="header">'+header+'</div>' +
                '<div class="content">'+content+'</div>' +
                '<div class="action">' + action + '</div></div></div>';
    $(".box_comment").append(temp);
    
    $('.btnCancel').on("click", function () {
        $('#dialog_comment').remove();
    });
    if(typeof callback !== 'undefined') {
        callback(mess,parent_id);
    }
}

$(".show_cm").click(function(){
    $(this).hide();
    $(this).parent(".cm_pa").children(".input_cm").show();
});

$(".more_cm").click(function(){
    $(this).hide();
    $('.an_cm').show();
});
$(".fb-reply-btn").click(function(){
    var status = $(this).attr("status"); 
    if(status == 1) {
        $(this).parent("div").parent("li").children(".input_cm_rep").hide();
        $(this).attr("status","0"); 
    }  else {
        $(this).parent("div").parent("li").children(".input_cm_rep").show();
        $(this).attr("status","1"); 
    }
    return false;
});
    $(".btn_sendcm").click( function() {
        var name = $(this).parent("div").parent(".input_cm").children(".comment_name").val();
        var email = $(this).parent("div").parent(".input_cm").children(".comment_email").val();
        var content = $(this).parent("div").parent(".input_cm").children(".comment_content").val();
        var parent_id = $(this).attr("data");
        var id = '118060';
        var mod = 'news';
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    
        if(name.trim() == '' || email.trim() == '' || content.trim() == '') {
           _showPopup("THÔNG TIN CHƯA ĐẦY ĐỦ", "Thông tin không thể để trống. Vui lòng điền đầy đủ thông tin cá nhân.",'<button class="btnCancel" style="display: inline-block;">Đóng</button>');
            return false;
        } else if( !pattern.test(email.trim())) {
            _showPopup("THÔNG TIN CHƯA ĐẦY ĐỦ", "Email bạn nhập không chính xác",'<button class="btnCancel" style="display: inline-block;">Đóng</button>');
            return false;
        }  
        else {
            var linkajax = "index.php?mod=home&act=add_comment";
            $.ajax({
                type: "POST",
                url: linkajax,
                data: {
                    name: name,
                    email: email,
                    id: id,
                    mod: mod,                        
                    parent_id: parent_id,
                    content: content
                },
                dataType: "html",
                success: function(msg){
                    _showPopup("THÔNG BÁO", msg,'<button class="btnCancel" style="display: inline-block;">Đóng</button>');
                    $('.txt_cm').val("");
                    $('.txt_text').val("");
                }
            });
        }
        
    });
/*$(".btn_sendcm").click(function() {
    var parent_id = $(this).attr("data");
    var content = $(this).parent("div").parent(".input_cm").children("textarea").val();
    
    if(content.trim() == '') {
        _showPopup("BÌNH LUẬN KHÔNG CÓ NỘI DUNG", "Bình luận không thể để trống. Vui lòng chia sẻ vài dòng suy nghĩ của bạn về bài viết.",'<button class="btnCancel" style="display: inline-block;">Đóng</button>');
    } else {
        _showPopup("THÔNG TIN CÁ NHÂN", '<p>Để gửi bình luận, bạn vui lòng cung cấp thông tin:</p><form><p><label>Họ và tên</label> <input type="text" id="comment_name" maxlength="25"></p><p><label>Email</label> <input type="text" id="comment_email"></p></form>','<button class="btnSubmit" style="display: inline-block;">Gửi bình luận</button><button class="btnCancel" style="display: inline-block;">Đóng</button>',submit_comment,content,parent_id);
    }
    return false;
});*/
$(".btn_like").click(function() {
    var obj = $(this);
    var linkajax = "index.php?mod=home&act=like_comment";
    var data = $(this).attr("data");
    $.ajax({
        type: "POST",
        url: linkajax,
        data: {
            comment_id:data
        },
        context: obj,
        dataType: "html",
        success: function(msg){
            obj.html(msg+" thích");
            _showPopup("THÔNG BÁO", "Cảm ơn bạn đã bình chọn cho comment này !!!",'<button class="btnCancel" style="display: inline-block;">Đóng</button>');
            obj.unbind("click");
        }
    });
});

$('.show_kgkn').click(function(){
    $('.kgkn-intro').hide();
    $('.kgkn-info').show();
});

$(document).ready(function(){
	$('.slide_business').bxSlider({
	  'minSlides': 2,
	  'maxSlides': 6,
	  'moveSlides':1,
	  'slideWidth': 155,
	  'slideMargin': 20,
	  'pager':false,
	  'auto':true
	});
})
if($('._autoplay_vid').length) {
                  var vids = document.getElementsByClassName('_autoplay_vid'); 

                  for (var i = vids.length - 1; i >= 0; i--) {
                    //pause all the videos by default
                    vids[i].pause();
                  }

                  window.onscroll = autoplay;

                  function autoplay(){
                      for (var i = vids.length - 1; i >= 0; i--) {
                          var currentYpos = window.pageYOffset || document.documentElement.scrollTop;
                      if ( currentYpos >= (vids[i].offsetTop-300) && currentYpos <= vids[i].offsetTop + vids[i].offsetHeight+300 ) {
                        vids[i].play();
                      }else{
                        vids[i].pause();
                      }
                    }
                  }
                }

// Load the IFrame Player API code asynchronously.
  var tag = document.createElement('script');
  tag.src = "./player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function onYouTubeIframeAPIReady() {
    $('.youtube-video').inViewAutoplay({
      autohide: 1,
      modestbranding: 1,
      rel: 0,
      quality: 'hd720'
    });
  }
var height_img = $( document ).height();
function _showPopup(img,top) {
    var temp = '<div id="dialog"><div class="dialog_img"><div class="header"><button class="btnCancel" style="display: inline-block;">Đóng</button></div>' +
                '<div class="content">'+img+'</div>' + 
                '<div class="action"></div></div></div>';
    $(".box_img").append(temp);
    
    $('.btnCancel').click(function () {
        $('#dialog').remove();
    });
    $('#dialog').css('height',height_img);
    $('.dialog_img').css('top',top);
}
$('#content_detail_news img').click(function() { 
    var top = $(window).scrollTop();
    var img = $(this).attr('src');
    img = '<img src="./'+img+'"/>';
    _showPopup(img,top);
});

$(document).ready(function(){
    sticky('#sticky_160_','.tag_detail');
});