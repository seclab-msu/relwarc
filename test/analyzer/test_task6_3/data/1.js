// IE8еЇѕеїњ
$(document).ready(function() {
	addBind();
});

function addBind(){
	$("#searchNavi [name=q]").autocomplete({
		source: function(request, response) {
			if (isNullorUndefinedorEmpty(request.term)) {
				return;
			}
			$.ajax({
			url: "/jp/eltex/xsp/ajax/custom/AjaxSuggestBean.json",
			dataType: "json",
			type: "GET",
			cache: false,
			data: { q: request.term },
			success: function(data) {
				return response(data.results);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				response(['']);
			}
			});
		}
	});
	return false;
}

// г‚­гѓјгѓЇгѓјгѓ‰гЃЊжњЄиЁ­е®љгЃ®гЃЁгЃЌгЃЇг‚Ёгѓ©гѓј
function checkKeyWords() {
	// е€†йЎћгѓ—гѓ«гѓЂг‚¦гѓігЃ®еЂ¤г‚’еЏ–еѕ—
	var select = document.getElementById('path');
	var options = document.getElementById('path').options;
	var value = options.item(select.selectedIndex).value;
	var q = $('#q').val();
	// ж¤њзґўг‚­гѓјгѓЇгѓјгѓ‰гЃЁе€†йЎћгѓ—гѓ«гѓЂг‚¦гѓігЃ®еЂ¤г‚’зўєиЄЌ
	if (q === '' && value === '') {
		alert("г‚­гѓјгѓЇгѓјгѓ‰г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚");
		return false;
	}else{
		//URLгЃ«гѓ‘гѓ©гѓЎгѓјг‚їгѓјиїЅеЉ 
		var url = $("#searchNavi").attr("action");
		url = url.split("?q=")[0];
		url += "?q=";
		url += encodeURI(q);
//		url += q;
		$("#searchNavi").attr("action",url);
		return true;
	}
}

function searchGoods(form) {
	if (!checkKeyWords()) {
		return false;
	}else{
		form.submit();
	}
}

function searchGoodsKeyPress(form) {
	form.submit();
}

// jquery.scrollUp.js
//
// 20140903 nakano
//
$(function () {
  $.scrollUp();
});

(function ($, window, document) {
    'use strict';

    // Main function
    $.fn.scrollUp = function (options) {

        // Ensure that only one scrollUp exists
        if (!$.data(document.body, 'scrollUp')) {
            $.data(document.body, 'scrollUp', true);
            $.fn.scrollUp.init(options);
        }
    };

    // Init
    $.fn.scrollUp.init = function (options) {

        // Define vars
        var o = $.fn.scrollUp.settings = $.extend({}, $.fn.scrollUp.defaults, options),
            triggerVisible = false,
            animIn, animOut, animSpeed, scrollDis, scrollEvent, scrollTarget, $self;

        // Create element
        if (o.scrollTrigger) {
            $self = $(o.scrollTrigger);
        } else {
            $self = $('<a/>', {
                id: o.scrollName,
                href: '#top'
            });
        }

        // Set scrollTitle if there is one
        if (o.scrollTitle) {
            $self.attr('title', o.scrollTitle);
        }

        $self.appendTo('.contents');

        // If not using an image display text
        if (!(o.scrollImg || o.scrollTrigger)) {
            $self.html(o.scrollText);
        }

        // Minimum CSS to make the magic happen
        $self.css({
            display: 'none',
            position: 'fixed',
            zIndex: o.zIndex
        });

        // Active point overlay
        if (o.activeOverlay) {
            $('<div/>', {
                id: o.scrollName + '-active'
            }).css({
                position: 'absolute',
                'top': o.scrollDistance + 'px',
                width: '100%',
                borderTop: '1px dotted' + o.activeOverlay,
                zIndex: o.zIndex
            }).appendTo('.contents');
        }

        // Switch animation type
        switch (o.animation) {
            case 'fade':
                animIn = 'fadeIn';
                animOut = 'fadeOut';
                animSpeed = o.animationSpeed;
                break;

            case 'slide':
                animIn = 'slideDown';
                animOut = 'slideUp';
                animSpeed = o.animationSpeed;
                break;

            default:
                animIn = 'show';
                animOut = 'hide';
                animSpeed = 0;
        }

        // If from top or bottom
        if (o.scrollFrom === 'top') {
            scrollDis = o.scrollDistance;
        } else {
            scrollDis = $(document).height() - $(window).height() - o.scrollDistance;
        }

        // Scroll function
        scrollEvent = $(window).scroll(function () {
            if ($(window).scrollTop() > scrollDis) {
                if (!triggerVisible) {
                    $self[animIn](animSpeed);
                    triggerVisible = true;
                }
            } else {
                if (triggerVisible) {
                    $self[animOut](animSpeed);
                    triggerVisible = false;
                }
            }
        });

        if (o.scrollTarget) {
            if (typeof o.scrollTarget === 'number') {
                scrollTarget = o.scrollTarget;
            } else if (typeof o.scrollTarget === 'string') {
                scrollTarget = Math.floor($(o.scrollTarget).offset().top);
            }
        } else {
            scrollTarget = 0;
        }

        // To the top
        $self.click(function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: scrollTarget
            }, o.scrollSpeed, o.easingType);
        });
    };

    // Defaults
    $.fn.scrollUp.defaults = {
        scrollName: 'scrollUp',      // Element ID
        scrollDistance: 300,         // Distance from top/bottom before showing element (px)
        scrollFrom: 'top',           // 'top' or 'bottom'
        scrollSpeed: 300,            // Speed back to top (ms)
        easingType: 'linear',        // Scroll to top easing (see http://easings.net/)
        animation: 'fade',           // Fade, slide, none
        animationSpeed: 200,         // Animation in speed (ms)
        scrollTrigger: false,        // Set a custom triggering element. Can be an HTML string or jQuery object
        scrollTarget: false,         // Set a custom target element for scrolling to. Can be element or number
        scrollText: '', // Text for element, can contain HTML (default: 'Scroll to top')
        scrollTitle: false,          // Set a custom <a> title if required. Defaults to scrollText
        scrollImg: false,            // Set true to use image
        activeOverlay: false,        // Set CSS color to display scrollUp active point, e.g '#00FFFF'
        zIndex: 2147483647           // Z-Index for the overlay
    };

    // Destroy scrollUp plugin and clean all modifications to the DOM
    $.fn.scrollUp.destroy = function (scrollEvent) {
        $.removeData(document.body, 'scrollUp');
        $('#' + $.fn.scrollUp.settings.scrollName).remove();
        $('#' + $.fn.scrollUp.settings.scrollName + '-active').remove();

        // If 1.7 or above use the new .off()
        if ($.fn.jquery.split('.')[1] >= 7) {
            $(window).off('scroll', scrollEvent);

        // Else use the old .unbind()
        } else {
            $(window).unbind('scroll', scrollEvent);
        }
    };

    $.scrollUp = $.fn.scrollUp;

})(jQuery, window, document);