var msg_id_md5 = '';
var domain   = '.7654.com';
var user_url = "http://u.7654.com";
var web_url  = "http://www.7654.com";

$(".connectService").on("click",function(){
    $(".mask").fadeIn();
    return false;
});
$(".mask .close").on("click",function(){
    $(".mask").fadeOut();
});

$(function(){
	$('#btn_package_download_one').click(function() {
	    var username = $.cookie('_name');
        var $this = $(this);
        var href = $(this).attr('href');
        var url = "http://u.7654.com/Package/"+href+"/uid//pid/243";
        var has_pass = 2;
	    if ( !username ) {
            window.location.href = "http://u.7654.com/login";
            return false;
	    }else{
	    	//是否已通过推广认证
	    	if(hasPass(has_pass) == false){
	    		return false;
	    	}
            if(href === 'download_one'||href === 'download_qq_ky_dz'){
                $.get(url, function(d){
                    if(!d.success){
                        $(".popupMain").popupMeans({
                            popid: "#popupMessage2", // 弹出框ID.
                            width: 500, // 弹出框宽.
                            height: 300, // 弹出框高.
                            shade: false, // 弹出遮罩层, true为有遮罩层，false为没有遮罩层.
                            callback: function () {
                                //var str = "<p>亲爱的技术员朋友：</p>";
                                //str += "<p></p>"
                                //str += "<p>官方反馈推广方式异常，请推广其他产品。</p>";
                                //$(".p-title").text("下载提示");
                                //$(".popupMain").html(str).height("200");
                                $("#popupMessage2").find("[data-close]").click(function () {
                                    location.reload();
                                });
                            } // 弹出回调函数.
                        });
                    }else{
                        href = d.data;
                        $this.attr('href',href);
                        window.location.href = href;
                        //$this.click();
                        return true;
                    }
                },'jsonp');
                return false;
            }else{
                return true;
            }
        }
	    //return true;
	});

    var d_url = "http://u.7654.com/Badge/light_badge";
    $("#light_badge").click(function(){
        $.get(d_url,{type:2}, function(d){
            if (d.code == 0){
                location.reload();
            }else{
                alert(d.message);
            }
        },'jsonp');
    })
});

(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?a2bb08e67b27e93f8c42eaa8bb65f91a";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();
  // 自动推送
  (function(){
      var bp = document.createElement('script');
      bp.src = '//push.zhanzhang.baidu.com/push.js';
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(bp, s);
  })();
  var _mouth = _mouth || [];
  _mouth.push(['_setAccount', '7654union']);

  (function() {
      var eater = document.createElement('script'); eater.type = 'text/javascript'; eater.async = true;
      eater.src = 'http://eater.xiaoxiangbz.com/eater.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(eater, s);
  })();
