$('.success img, .warning img, .attention img, .information img').live('click', function() {
    $(this).parent().fadeOut('slow', function() {
        $(this).remove();
    });
});

//--> 
jQuery(document).ready(function() {
    var lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy_inst"
    });
    window.lazyLoadInstance = lazyLoadInstance;
});


var button_shopping = "Перейти в каталог товаров";
var text_compare = "Сравнение товаров";
var text_wishlist = "Отложенное";
var link_compare = "https://immunitet.org/compare-products/";
var link_wishlist = "https://immunitet.org/wishlist/";
var button_checkout = "Оформить заказ";
var link_checkout = "https://immunitet.org/checkout/";


$(document).ready(function() {
    $("input[name='quantities']").keyup(function() {
        document.getElementsByName("quantity")[0].value = $(this).val();
    });
    $('.btn-quickorder').colorbox({
        close: "<button class='btn btn-default' type='button'><i class='fa fa-fw fa-times'></i></button>",
        href: "#quickorder_form",
        inline: true,
        width: "550px",
        onComplete: function() {
            $('.btn-quickorder').tooltip('destroy');
            if (navigator.appVersion.indexOf("MSIE 8.") != -1) {
                $("html, body").animate({
                    scrollTop: 0
                }, 'slow');
            };
        },
        onCleanup: function() {
            $('#quickorder_result').html('');
        }
    });
    $("#quickorder_form .btn-primary").click(function() {
        $('#quickorder_result').html('<div class="alert alert-info"><i class="fa fa-spinner fa-spin"></i> Обработка</div>');
        $('#quickorder_form').colorbox.resize()
        $.post("catalog/view/javascript/moneymaker_quickorder.php", {
                'product_title': $('#product_title2').val(),
                'product_price': $('#product_price2').val(),
                'product_code': $('#product_code2').val(),
                'product_url': $('#product_url2').val(),
                'mmr_quickorder_fields[]': [$('#mmr_quickorder_field0').val(), $('#mmr_quickorder_field1').val(), ],
                'mmr_quickorder_fields_label[]': ["Имя", "Телефон", ],
                'mmr_quickorder_fields_required[]': [0, 1, ],
                'email': "info@immunitet.org",
                'email_subject': "ООО Иммунитет.орг - Новый запрос Быстрого Заказа (2021.03.02 20:18)",
                'email_order_received': "Вы получили заказ",
                'email_order_detail': "Детали заказа",
                'email_url': "Адрес страницы",
                'country': 'Белиз',
                'city': 'Белиз',
            },
            function(data) {
                if (data == '0') {
                    $('#quickorder_result').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Внимание: Пожалуйста, заполните обязательные поля</div>');
                    $('#quickorder_form').colorbox.resize();
                } else {
                    sendEvent('buy_one_click_product', 'form');
                    if ('undefined' !== typeof yaCounter29549115) yaCounter29549115.reachGoal('buy_one_click_product');
                    $('#quickorder_result').html('<div class="alert alert-success"><i class="fa fa-check-circle"></i> Успешно: ваш запрос был отправлен, мы свяжемся с вами как можно быстрее!</div>');
                    $('#quickorder_form').colorbox.resize();
                    $('#quickorder_form .btn-primary').attr('disabled', 'disabled');
                    setTimeout(function() {
                        $('#quickorder_form').colorbox.close()
                    }, 1500);
                }
            });
    });

    $('.btn-quickorder2').colorbox({
        close: "<button class='btn btn-default' type='button'><i class='fa fa-fw fa-times'></i></button>",
        href: "#quickorder_form2",
        inline: true,
        width: "550px",
        onComplete: function() {
            $('.btn-quickorder2').tooltip('destroy');
            if (navigator.appVersion.indexOf("MSIE 8.") != -1) {
                $("html, body").animate({
                    scrollTop: 0
                }, 'slow');
            };
        },
        onCleanup: function() {
            $('#quickorder_result2').html('');
        }
    });
    $("#quickorder_form2 .btn-primary").click(function() {
        $('#quickorder_result2').html('<div class="alert alert-info"><i class="fa fa-spinner fa-spin"></i> Обработка</div>');
        $('#quickorder_form2').colorbox.resize()
        $.post("catalog/view/javascript/moneymaker_quickorder.php", {
                'product_title': $('#product_title').val(),
                'product_price': $('#product_price').val(),
                'product_code': $('#product_code').val(),
                'product_url': $('#product_url').val(),
                'mmr_quickorder_fields[]': [$('#mmr_quickorder_field901').val(), $('#mmr_quickorder_field902').val(), $('#mmr_quickorder_field905').val(), $('#mmr_quickorder_field903').val(), $('#mmr_quickorder_field904').val()],
                'mmr_quickorder_fields_label[]': ['Имя', 'Email', 'Телефон', 'Ссылка', 'Комментарий'],
                'mmr_quickorder_fields_required[]': [0, 1, 0, 0, 0],
                'email': "info@immunitet.org",
                'email_subject': "ООО Иммунитет.орг - 'Запрос снижения цены' (2021.03.02 20:18)",
                'email_order_received': 'Новый запрос',
                'email_order_detail': 'Детали',
                'email_url': "Адрес страницы",
                'country': 'Белиз',
                'city': 'Белиз',
            },
            function(data) {
                if (data == '0') {
                    $('#quickorder_result2').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Внимание: Пожалуйста, заполните обязательные поля</div>');
                    $('#quickorder_form2').colorbox.resize();
                } else {
                    $('#quickorder_result2').html('<div class="alert alert-success"><i class="fa fa-check-circle"></i> Успешно: ваш запрос был отправлен, мы свяжемся с вами как можно быстрее!</div>');
                    $('#quickorder_form2').colorbox.resize();
                    $('#quickorder_form2 .btn-primary').attr('disabled', 'disabled');
                }
            });
    });

    $('.colorbox a').colorbox({
        next: "<button class='btn btn-default' type='button'><i class='fa fa-fw fa-chevron-right'></i></button>",
        previous: "<button class='btn btn-default' type='button'><i class='fa fa-fw fa-chevron-left'></i></button>",
        close: "<button class='btn btn-default' type='button'><i class='fa fa-fw fa-times'></i></button>",
        rel: "colorbox",
        onOpen: function() {
            $("#colorbox").prepend("<div id='image-appendix'><div class='title hidden-xs'><span>Витафон-Т</span></div><div class='btn-group btn-group-lg hidden-xs additional-buttons'><button class='btn btn-primary' type='button' title='Купить' onclick='$(\"#image-appendix\").remove();$(\"#button-cart\").click();'><i class='fa fa-shopping-cart'></i> Купить</button><input type='text' class='form-control input-lg' name='quantities' size='2' value='1' title='Количество:' /><a class='btn btn-default' title='Заказать у производителя!' onclick='$(\"#image-appendix\").remove();$(\".btn-quickorder\").click();'><i class='fa fa-flip-horizontal fa-reply-all'></i> <span>Заказать у производителя!</span></a></div></div>");
            $('input[name=\"quantities\"]').keyup(function() {
                document.getElementsByName('quantity')[0].value = $(this).val();
            });
        },
        onComplete: function() {
            if (navigator.appVersion.indexOf("MSIE 8.") != -1) {
                $("html, body").animate({
                    scrollTop: 0
                }, 'slow');
            };
        },
        onClosed: function() {
            $("#image-appendix").remove()
        }
    });



});
//--> 
$('#button-cart').bind('click', function() {
    $.ajax({
        url: 'index.php?route=checkout/cart/add',
        type: 'post',
        data: $('#product-controls input[type=\'text\'], #product-controls input[type=\'date\'], #product-controls input[type=\'datetime-local\'], #product-controls input[type=\'time\'], #product-controls input[type=\'hidden\'], #product-controls input[type=\'radio\']:checked, #product-controls input[type=\'checkbox\']:checked, #product-controls select, #product-controls textarea'),
        dataType: 'json',
        success: function(json) {
            $('.success, .warning, .attention, .information, .error').remove();

            if (json['error']) {
                if (json['error']['option']) {
                    $.colorbox.close();
                    $('.options .collapse').show();
                    $('.options .options-expand').hide();
                    for (i in json['error']['option']) {
                        $('#input-option' + i).after('<span class="error">' + json['error']['option'][i] + '</span>');
                    }
                }
            }
            if (json['success']) {
                $.colorbox({
                    width: '550px',
                    close: "<button class='btn btn-default' type='button'><i class='fa fa-fw fa-times'></i></button>",
                    onComplete: function() {
                        if (navigator.appVersion.indexOf("MSIE 8.") != -1) {
                            $("html, body").animate({
                                scrollTop: 0
                            }, 'slow');
                        };
                    },
                    html: "<h4 class='col-xs-12 text-center'>" + json['success'] + "</h4><p class='text-center'><a href='https://immunitet.org/checkout/' class='btn btn-lg btn-primary'><i class='fa fa-fw fa-share'></i> <span>Оформить заказ</span></a></p><p class='text-center'><a onclick='$.colorbox.close()' class='btn btn-default'>Перейти в каталог товаров</a></p>",
                    title: ""
                });
                $('#cart').load('index.php?route=module/cart' + ' #cart > *');
            }

        }
    });
});
//--> 
$('button[id^=\'button-upload\']').on('click', function() {
    var node = this;
    $('#form-upload').remove();
    $('body').prepend('<form enctype="multipart/form-data" id="form-upload" class="hidden"><input type="file" name="file" /></form>');
    $('#form-upload input[name=\'file\']').trigger('click');
    $('#form-upload input[name=\'file\']').on('change', function() {
        $.ajax({
            url: 'index.php?route=product/product/upload',
            type: 'post',
            dataType: 'json',
            data: new FormData($(this).parent()[0]),
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function() {
                $(node).find('i').replaceWith('<i class="fa fa-spinner fa-spin"></i>');
                $(node).prop('disabled', true);
            },
            complete: function() {
                $(node).find('i').replaceWith('<i class="fa fa-upload"></i>');
                $(node).prop('disabled', false);
            },
            success: function(json) {
                if (json['error']) {
                    $(node).parent().find('input[name^=\'option\']').after('<span class="error">' + json['error'] + '</span>');
                }
                if (json['success']) {
                    alert(json['success']);
                    $(node).parent().find('input[name^=\'option\']').attr('value', json['file']);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });
});
//--> 
$('#review .pagination_buttons a').live('click', function() {
    $('#review').fadeOut('slow');
    $('#review').load(this.href);
    $('#review').fadeIn('slow');
    return false;
});

//$('#review').load('index.php?route=product/product/review&product_id=66');
$('.button-review').bind('click', function() {
    $.ajax({
        url: 'index.php?route=product/product/write&product_id=66',
        type: 'post',
        dataType: 'json',
        data: 'name=' + encodeURIComponent($('input[name=\'name\']').val()) + '&text=' + encodeURIComponent($('textarea[name=\'text\']').val()) + '&rating=' + encodeURIComponent($('input[name=\'mmr_rating\']').val() ? $('input[name=\'mmr_rating\']').val() : '') + '&captcha=' + encodeURIComponent($('input[name=\'captcha\']').val()),
        beforeSend: function() {
            $('.alert-success, .alert-danger').remove();
            $('.button-review').attr('disabled', true);
            $('.button-review').parent().parent().before('<div class="alert alert-info"><i class="fa fa-spinner fa-spin"></i> Пожалуйста, подождите!<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
        },
        complete: function() {
            $('.button-review').attr('disabled', false);
            $('.alert-info').remove();
        },
        success: function(data) {
            if (data['error']) {
                $('.button-review').parent().parent().before('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> ' + data['error'] + '<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
            }
            if (data['success']) {
                $('.button-review').parent().parent().before('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + data['success'] + '<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                $('input[name=\'name\']').val('');
                $('textarea[name=\'text\']').val('');
                $('input[name=\'mmr_rating\']').val('');
                $('input[name=\'captcha\']').val('');
            }
        }
    });
});
//--> 

if ($.browser.msie && $.browser.version == 6) {
    $('.date, .datetime, .time').bgIframe();
}
$('.date').datepicker({
    dateFormat: 'yy-mm-dd'
});
$('.datetime').datetimepicker({
    dateFormat: 'yy-mm-dd',
    timeFormat: 'h:m'
});
$('.time').timepicker({
    timeFormat: 'h:m'
});

var elm = $('#htop');

function spin(vl) {
    elm.val(parseInt(elm.val(), 10) + vl);
}

if (elm.val() > 0) {
    $('#increase').click(function() {
        spin(1);
    });
    $('#decrease').click(function() {
        spin(-1);
    });
}

//--> 

function jivosite() {
    var widget_id = 'pgAre7J5pu';
    var d = document;
    var w = window;

    function l() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//code.jivosite.com/script/widget/' + widget_id;
        var ss = document.getElementsByTagName('script')[0];
        ss.parentNode.insertBefore(s, ss);
    }
    if (d.readyState == 'complete') {
        l();
    } else {
        if (w.attachEvent) {
            w.attachEvent('onload', l);
        } else {
            w.addEventListener('load', l, false);
        }
    }
}
setTimeout(jivosite, 4000);




jQuery.colorbox.settings.maxWidth = '95%';
jQuery.colorbox.settings.maxHeight = '95%';
var resizeTimer;

function resizeColorBox() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (jQuery('#cbox_mmrOverlay').is(':visible')) {
            jQuery.colorbox.load(true);
        }
    }, 300);
}
jQuery(window).resize(resizeColorBox);
window.addEventListener("orientationchange", resizeColorBox, false);
//--> 

$(document).ready(function() {
    $('.btn-callback').colorbox({
        close: "<button class='btn btn-default' type='button'><i class='fa fa-fw fa-times'></i></button>",
        href: "#callback_form",
        inline: true,
        width: "550px",
        onComplete: function() {
            $('.btn-callback').tooltip('destroy');
            if (navigator.appVersion.indexOf("MSIE 8.") != -1) {
                $("html, body").animate({
                    scrollTop: 0
                }, 'slow');
            };
        },
        onCleanup: function() {
            $('#callback_result').html('');
        }
    });
    $("#callback_form .btn-primary").click(function() {
        $('#callback_result').html('<div class="alert alert-info"><i class="fa fa-spinner fa-spin"></i> Обработка</div>');
        $('#callback_form').colorbox.resize()
        $.post("catalog/view/javascript/moneymaker_callback.php", {
                'page_url': $('#page_url').val(),
                'mmr_callback_fields[]': [$('#mmr_callback_field0').val(), $('#mmr_callback_field1').val(), ],
                'mmr_callback_fields_label[]': ["Имя", "Телефон", ],
                'mmr_callback_fields_required[]': [0, 1, ],
                'email': "info@immunitet.org",
                'email_subject': "ООО Иммунитет.орг - Новый запрос обратного звонка (2021.03.02 20:18)",
                'email_order_received': "Вы получили запрос обратного звонка",
                'email_order_detail': "Детали обратного звонка:",
                'email_url': "Адрес страницы",
                'country': "Белиз",
                'city': "Белиз",
            },
            function(data) {
                if (data == '0') {
                    $('#callback_result').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Внимание: Пожалуйста, заполните обязательные поля</div>');
                    $('#callback_form').colorbox.resize();
                } else {
                    sendEvent('callback_done', 'feedback');
                    //if('undefined' !== typeof yaCounter29549115) yaCounter29549115.reachGoal('callback_done');
                    $('#callback_result').html('<div class="alert alert-success"><i class="fa fa-check-circle"></i> Успешно: ваш запрос был отправлен, мы свяжемся с вами как можно быстрее!</div>');
                    $('#callback_form').colorbox.resize();
                    $('#callback_form .btn-primary').attr('disabled', 'disabled');
                }
            });
    });
    $('.callme_viewform').colorbox({
        close: "<button class='btn btn-default' type='button'><i class='fa fa-fw fa-times'></i></button>",
        href: "#ask_form",
        inline: true,
        width: "550px",
        onComplete: function() {
            $('.btn-callme_viewform').tooltip('destroy');
            if (navigator.appVersion.indexOf("MSIE 8.") != -1) {
                $("html, body").animate({
                    scrollTop: 0
                }, 'slow');
            };
        },
        onCleanup: function() {
            $('#askform_result2').html('');
        }
    });
    $("#ask_form .btn-primary").click(function() {
        $('#askform_result2').html('<div class="alert alert-info"><i class="fa fa-spinner fa-spin"></i> text_mmr_quickorder_processing</div>');
        $('#ask_form').colorbox.resize()
        $.post("catalog/view/javascript/moneymaker_callback.php", {
                'page_url': $('#page_url2').val(),
                'mmr_callback_fields[]': [$('#phone').val(), $('#mail').val(), $('#ask').val()],
                'mmr_callback_fields_label[]': ['Телефон', 'Email', 'Вопрос'],
                'mmr_callback_fields_required[]': [1, 0, 1],
                'email': "info@immunitet.org",
                'email_subject': "ООО Иммунитет.орг - 'Новый вопрос' (2021.03.02 20:18)",
                'email_order_received': 'Новый вопрос',
                'email_order_detail': 'Детали',
                'email_url': "Адрес страницы",
                'country': 'Белиз',
                'city': 'Белиз',
            },
            function(data) {
                if (data == '0') {
                    $('#askform_result2').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Внимание: Пожалуйста, заполните обязательные поля</div>');
                    $('#ask_form').colorbox.resize();
                } else {
                    sendEvent('question', 'form');
                    //if('undefined' !== typeof yaCounter29549115) yaCounter29549115.reachGoal('question');
                    $('#askform_result2').html('<div class="alert alert-success"><i class="fa fa-check-circle"></i> Успешно: ваш запрос был отправлен, мы свяжемся с вами как можно быстрее!</div>');
                    $('#ask_form').colorbox.resize();
                    $('#ask_form .btn-primary').attr('disabled', 'disabled');
                }
            });
    });
    $('.colorbox_popup').colorbox({
        close: "<button class='btn btn-default' type='button'><i class='fa fa-fw fa-times'></i></button>",
        onComplete: function() {
            if (navigator.appVersion.indexOf("MSIE 8.") != -1) {
                $("html, body").animate({
                    scrollTop: 0
                }, 'slow');
            };
        },
        width: 910,
        height: 700,
        href: function() {
            return $(this).attr('data-to');
        }
    });
    $().UItoTop({
        easingType: 'easeOutQuart'
    });
});
//--> 
$('.external-reference').replaceWith(function() {
    return '<a onclick="return !window.open(this.href)" href="' + $(this).data('link') + '" title="' + $(this).text() + '">' + $(this).html() + '</a>';
})

$('.head_menu li').find("a[href]").each(function() {
    var link = $(this).attr("href");
    $(this).parent().attr("onclick", "location.href='" + link + "'");
});
if (screen.width < 767) {
    $('.head_menu li').find("a:not([href])").each(function() {
        $(this).parent().attr("onclick", "$(this).children('ul').toggle(100)");
    });
}


// Загружаем сам код счетчика сразу
(function(m, e, t, r, i, k, a) {
    m[i] = m[i] || function() {
        (m[i].a = m[i].a || []).push(arguments)
    };
    m[i].l = 1 * new Date();
    k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
})
(window, document, 'script', '//mc.yandex.ru/metrika/tag.js', 'ym');

setTimeout(function() {
    ym(29549115, 'init', {
        id: 29549115,
        clickmap: true,
        trackLinks: true,
        triggerEvent: true,
        accurateTrackBounce: true,
        trackHash: true,
        ecommerce: "dataLayer"
    });
}, 2000);

setTimeout(function() {
    ym(48782735, 'init', {
        id: 48782735,
        clickmap: true,
        trackLinks: true,
        triggerEvent: true,
        accurateTrackBounce: true,
        webvisor: true,
        trackHash: true,
        ecommerce: "dataLayer"
    });
}, 2000);


(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

setTimeout(function() {
    ga('create', 'UA-61593402-2', 'auto');
    ga('require', 'linkid', 'linkid.js');
    ga('send', 'pageview');
}, 2000);