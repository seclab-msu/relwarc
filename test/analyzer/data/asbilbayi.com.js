$(".sepeteekle").click(function() {
    var urunkodu = $(this).data("urunkodu");
    var adet_magosa, adet_lefkosa = 0;
    var qty_magosa = $("#qty_magosa").length;
    var qty_lefkosa = $("#qty_lefkosa").length;
    if (qty_magosa >= 1){
        adet_magosa = $("#qty_magosa").val();
    }
    if (qty_lefkosa >= 1){
        adet_lefkosa = $("#qty_lefkosa").val();
    }
    $.ajax({
        type: "GET",
        url: "/sepete-ekle-hizli?islem=hizliekle",
        data: "urunkodu="+urunkodu+"&adet_lefkosa="+adet_lefkosa+"&adet_magosa="+adet_magosa,
        cache: false,
        success: function(sonuc){
            if (sonuc == "OK") {
                TemaSepettekiUrunSayisi_Guncelle();
                $("#lutfenbekleyin").html("SEPETİNİZ GÜNCELLENDİ");
                setTimeout(function(){ 
                    $("#lutfenbekleyin").fadeOut();
                },1000);
            }else{
                $("#lutfenbekleyin").fadeOut();
                alert(sonuc);
            }
        } 
    });
});