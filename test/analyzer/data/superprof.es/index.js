window.dataLayer = window.dataLayer || [];
dataLayer.push({
    'discipline': 'Matemáticas',
    'siteType': 'BlogPays',
    'ecommerce': {
        'promoView': {
            'promotions': [{
                'name': 'matemáticas-descubrir-numeros-complejos',
                'creative': 'slider',
                'position': 'blogTop'
            }, {
                'name': 'matemáticas-descubrir-numeros-complejos',
                'creative': 'slider',
                'position': 'blogMiddle'
            }, {
                'name': 'matemáticas-descubrir-numeros-complejos',
                'creative': 'form',
                'position': 'blogBottom'
            }, {
                'name': 'covid',
                'creative': 'covidHeaderBanner',
                'position': 'articleBlogHeader'
            }, ]
        }
    }
});
window.addEventListener('load', function () {
    var cta_profs_wrapper_1 = document.getElementById('cta-profs-wrapper-1');
    cta_profs_wrapper_1.onclick = function () {
        console.log('cta_profs_wrapper_1.onclick');
        dataLayer.push({
            'event': 'promotionClick',
            'ecommerce': {
                'promoClick': {
                    'promotions': [{
                        'name': 'matemáticas-descubrir-numeros-complejos',
                        'creative': 'slider',
                        'position': 'blogTop'
                    }, ]
                }
            }
        });
    };
    var cta_profs_wrapper_2 = document.getElementById('cta-profs-wrapper-2');
    cta_profs_wrapper_2.onclick = function () {
        console.log('cta_profs_wrapper_2.onclick');
        dataLayer.push({
            'event': 'promotionClick',
            'ecommerce': {
                'promoClick': {
                    'promotions': [{
                        'name': 'matemáticas-descubrir-numeros-complejos',
                        'creative': 'slider',
                        'position': 'blogMiddle'
                    }, ]
                }
            }
        });
    };
    var cta_search_wrapper = document.getElementById('cta-search-wrapper');
    cta_search_wrapper.onclick = function () {
        console.log('cta_search_wrapper.onclick');
        dataLayer.push({
            'event': 'promotionClick',
            'ecommerce': {
                'promoClick': {
                    'promotions': [{
                        'name': 'matemáticas-descubrir-numeros-complejos',
                        'creative': 'form',
                        'position': 'blogBottom'
                    }, ]
                }
            }
        });
    };
    var cta_online = document.getElementById('cta-online');
    cta_online.onclick = function () {
        console.log('cta_online.onclick');
        dataLayer.push({
            'event': 'promotionClick',
            'ecommerce': {
                'promoClick': {
                    'promotions': [{
                        'name': 'covid',
                        'creative': 'covidHeaderBanner',
                        'position': 'articleBlogHeader'
                    }, ]
                }
            }
        });
    };
});
(function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src =
        '.' + i + dl;
    f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-WVHCQW2');
(function (url) {
    if (/(?:Chrome\/26\.0\.1410\.63 Safari\/537\.31|WordfenceTestMonBot)/.test(navigator.userAgent)) {
        return;
    }
    var addEvent = function (evt, handler) {
        if (window.addEventListener) {
            document.addEventListener(evt, handler, false);
        } else if (window.attachEvent) {
            document.attachEvent('on' + evt, handler);
        }
    };
    var removeEvent = function (evt, handler) {
        if (window.removeEventListener) {
            document.removeEventListener(evt, handler, false);
        } else if (window.detachEvent) {
            document.detachEvent('on' + evt, handler);
        }
    };
    var evts =
        'contextmenu dblclick drag dragend dragenter dragleave dragover dragstart drop keydown keypress keyup mousedown mousemove mouseout mouseover mouseup mousewheel scroll'
        .split(' ');
    var logHuman = function () {
        if (window.wfLogHumanRan) {
            return;
        }
        window.wfLogHumanRan = true;
        var wfscr = document.createElement('script');
        wfscr.type = 'text/javascript';
        wfscr.async = true;
        wfscr.src = url + '&r=' + Math.random();
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(
            wfscr);
        for (var i = 0; i < evts.length; i++) {
            removeEvent(evts[i], logHuman);
        }
    };
    for (var i = 0; i < evts.length; i++) {
        addEvent(evts[i], logHuman);
    }
})('.');
var assetPath = '.';
window.addEventListener("load", function (event) {
    var cta_online_btn_close = document.getElementById('cta-online__close__cross');
    var cta_online_wrapper = document.getElementById('cta-online-wrapper');

    if (cta_online_btn_close !== undefined) {
        cta_online_btn_close.onclick = function () {
            var now = new Date();
            var time = now.getTime();
            var expireTime = time + 30 * 24 * 3600;
            now.setTime(expireTime);
            document.cookie = 'covidDisplayNone=true;expires=' + now.toGMTString() + ';path=/';

            if (cta_online_wrapper !== null) {
                cta_online_wrapper.style.display = "none";
            }
        };
    }
});

// Load the video with the good dimensions according to the screen width
var video = document.getElementById('cta-online__video');
var video_source_value;
var WindowWidth = window.innerWidth;
var source = document.createElement('source');

if (WindowWidth < 768) {
    video_source_value =
        "imgs/apprenez-a-la-maison-mobile.m4v";
} else {
    video_source_value =
        "img/apprenez-a-la-maison-desktop.m4v";
}
source.setAttribute('src', video_source_value);
video.appendChild(source);
video.play();
var ratingsL10n = {
    "plugin_url": "",
    "ajax_url": "\/blog\/wp-admin\/admin-ajax.php",
    "text_wait": "Por favor, valora solo 1 elemento cada vez.",
    "image": "stars_svg",
    "image_ext": "svg",
    "max": "5",
    "show_loading": "1",
    "show_fading": "1",
    "custom": "0"
};
var ratings_mouseover_image = new Image();
ratings_mouseover_image.src =
    "img/rating_over.svg";;
var wpdiscuzAjaxObj = {
    "url": "\/blog\/wp-admin\/admin-ajax.php",
    "customAjaxUrl": "",
    "wpdiscuz_options": {
        "wc_hide_replies_text": "Ocultar las respuestas",
        "wc_show_replies_text": "Mostrar las respuestas",
        "wc_msg_required_fields": "Please fill out required fields",
        "wc_invalid_field": "Una parte del campo es incorrecta",
        "wc_error_empty_text": "Por favor, completa este campo para poder comentar",
        "wc_error_url_text": "URL incorrecta",
        "wc_error_email_text": "Direcci\u00f3n de correo incorrecta",
        "wc_invalid_captcha": "C\u00f3digo Captcha incorrecto",
        "wc_login_to_vote": "Debes conectarte para votar",
        "wc_deny_voting_from_same_ip": "No tienes autorizaci\u00f3n para votar por este comentario",
        "wc_self_vote": "No puedes votar tus propios comentarios",
        "wc_vote_only_one_time": "Ya has votado este comentario",
        "wc_voting_error": "Error en el voto",
        "wc_held_for_moderate": "Comentario a la espera de moderaci\u00f3n",
        "wc_comment_edit_not_possible": "Lo sentimos, ya no se puede editar este comentario",
        "wc_comment_not_updated": "Lo sentimos, el comentario no se ha actualizado",
        "wc_comment_not_edited": "No has efectuado ninguna modificaci\u00f3n",
        "wc_new_comment_button_text": "nuevo comentario",
        "wc_new_comments_button_text": "nuevos comentarios",
        "wc_new_reply_button_text": "nueva respuesta a tu comentario",
        "wc_new_replies_button_text": "nuevas respuestas a tus comentarios",
        "wc_msg_input_min_length": "Input is too short",
        "wc_msg_input_max_length": "Input is too long",
        "wc_follow_user": "Suivre cet utilisateur",
        "wc_unfollow_user": "Ne plus suivre cet utilisateur",
        "wc_follow_success": "Vous avez commenc\u00e9 \u00e0 suivre cet auteur de commentaires",
        "wc_follow_canceled": "Vous avez cess\u00e9 de suivre cet auteur de commentaire.",
        "wc_follow_email_confirm": "Veuillez v\u00e9rifier vos e-mail et confirmer la demande de l\u2019utilisateur.",
        "wc_follow_email_confirm_fail": "D\u00e9sol\u00e9, nous n\u2019avons pas pu envoyer l\u2019e-mail de confirmation.",
        "wc_follow_login_to_follow": "Veuillez vous connecter pour suivre les utilisateurs.",
        "wc_follow_impossible": "Nous sommes d\u00e9sol\u00e9s, mais vous ne pouvez pas suivre cet utilisateur.",
        "wc_follow_not_added": "Le suivi a \u00e9chou\u00e9. Veuillez r\u00e9essayer plus tard.",
        "is_user_logged_in": false,
        "commentListLoadType": "0",
        "commentListUpdateType": "0",
        "commentListUpdateTimer": "30",
        "liveUpdateGuests": "1",
        "wc_comment_bg_color": "#FEFEFE",
        "wc_reply_bg_color": "#F8F8F8",
        "wpdiscuzCommentsOrder": "asc",
        "wpdiscuzCommentOrderBy": "comment_date_gmt",
        "commentsVoteOrder": false,
        "wordpressThreadCommentsDepth": "5",
        "wordpressIsPaginate": "",
        "commentTextMaxLength": null,
        "storeCommenterData": 100000,
        "isCaptchaInSession": true,
        "isGoodbyeCaptchaActive": false,
        "socialLoginAgreementCheckbox": 0,
        "enableFbLogin": 0,
        "enableFbShare": 0,
        "facebookAppID": "",
        "facebookUseOAuth2": 0,
        "enableGoogleLogin": 0,
        "googleAppID": "",
        "cookiehash": "4f408729d2eef992d0454b937de841c0",
        "isLoadOnlyParentComments": 0,
        "ahk": "",
        "enableDropAnimation": 0,
        "isNativeAjaxEnabled": 1,
        "cookieCommentsSorting": "wpdiscuz_comments_sorting",
        "enableLastVisitCookie": 0,
        "version": "5.3.5",
        "wc_post_id": 48839,
        "loadLastCommentId": 0,
        "lastVisitKey": "wpdiscuz_last_visit",
        "isCookiesEnabled": true,
        "wc_captcha_show_for_guest": "0",
        "wc_captcha_show_for_members": "0",
        "is_email_field_required": "1"
    }
};

var AppAjax = {
    "ajaxurl": "\/blog\/wp-admin\/admin-ajax.php",
    "saveNewsletterNonce": "347acb302c"
};