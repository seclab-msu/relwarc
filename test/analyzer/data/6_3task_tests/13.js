
$(".type_id").click(function(){

    $(".typeul").stop().slideDown();

});

$(".type_id").mouseleave(function(){

    $(".typeul").hide();

});


$(".typeul ul li").click(function(){

    var re = $(this).index();

    var va = $(this).html();

    $("#typename").html(va);

    $(".typename").val(re);

    $(this).parent().parent().hide();

});


function shenqing(id) {

    var ajaxUrl="?m=zhongce&c=index&a=getstatus";
    $.ajax({
        type:"POST",
        url:ajaxUrl,
        data:{id:id},
        dataType:"",
        success:function(data){

            if(data == 0){

                var name="未登陆";
                window.top.art.dialog({content:name, fixed:true});

            }

            if(data == 5){

                var name="申请尚处于冷却中";
                window.top.art.dialog({content:name, fixed:true})

            }


            if(data == 1){

                var name="已申请";
                window.top.art.dialog({content:name, fixed:true});

            }
            if(data == 2){

                var name="已结束";
                window.top.art.dialog({content:name, fixed:true});

            }
            if(data == 3){

                var name="发烧值不足";
                window.top.art.dialog({content:name, fixed:true})

            }

            if(data == 4){

                window.top.art.dialog({id:'add_shenqing'}).close();
                window.top.art.dialog({title:'产品申请',id:'add_shenqing',iframe:'?m=zhongce&c=index&a=shenqing&id='+id,width:'600',height:'280',fixed:true}, function(){var d = window.top.art.dialog({id:'add_shenqing'}).data.iframe;d.document.getElementById('dosubmit').click();return false;
                }, function(){window.top.art.dialog({id:'add_shenqing'}).close();});
                
            }

            
        }
    })
   
}

function vote(id,catid,obj) {
    $.getJSON('/index.php?m=mood&c=index&a=post&id='+id+'&catid='+catid+'&site=1&'+Math.random()+'&callback=?', function(data){
        if(data.status==3)  {
            $(obj).find("span.addNumber").fadeIn().animate({top:"-35px"},"normal").fadeOut(300);
            $(obj).attr("class","zan current");scored("#details-zan","current");
            if($(obj).find("em").length>0){
                $(obj).find("em").html(Number($(obj).find("em").html())+1);
                $(obj).find("span.scoreAnimate").fadeIn().animate({top:"-35px"},"normal").fadeOut(300);
            }else{
                if($(obj).parents(".show_exp_zan").find("em").length>0){
                    $(obj).parents(".show_exp_zan").find("em").html(Number($(obj).parents(".show_exp_zan").find("em").html())+1)
                }else{
                    $(obj).parents(".show_exp_zan").find(".grey").html("已有<em>1</em>人赞过")
                }
            }
            $(obj).removeAttr("onclick");$(obj).css("cursor","default");return
         }else{

            alert(data.data);
         }
    })

}



