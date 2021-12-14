window.addEventListener("load", nextNews);


function isInView(elem) {
    if ($(elem).offset().top - $(window).scrollTop() < -$(elem).height()) {
        return 0;
    }

    return $(window).scrollTop() + $(window).height() > $(document).height() - 400;
}

var nextNewsId = 134769;
var currentNewsId = 134770;
var oldNewsId = 0;
var newsUrl = "http://www.amur.info.test.js-training.seclab.test.js-training.seclab/news/2018/02/11/134770";
var newsTitle = "Пожар в центре Благовещенска: горит магазин «Меркурий» (видео) / ИА &quot;Амур.инфо&quot;";


function nextNews() {
    $(window).scroll(function () {
        if (isInView($('#next_news_inf_134770'))) {
            //                console.log('%c LOAD NEWS WITH ID ' + 134770, 'background: #222; color: #bada55');
            //                console.log('next_news_one: ' + nextNewsOnce);
            //                console.log('next_news_id: ' + nextNewsId);
            //                if (nextNewsOnce) {
            if (currentNewsId != oldNewsId) {
                $.ajax({
                    async: true,
                    url: "/news/news/view?id=" + nextNewsId + "&disable_layout=1",
                    type: "GET",
                    success: function (html) {
                        if (html) {
                            $($("#next_news_inf_" + currentNewsId)).html(html);

                            newsTitle = newsTitle.replace(/&quot;/g, '"');
                            document.title = newsTitle;
                            window.history.replaceState({}, newsTitle, newsUrl);

                            //                                console.log('%c UPDATE HTML ', 'background: #222; color: #ff0000');

                            updateLiveInternetCounter();

                            var elements = $(" " + html);
                            var nextNewsId_ = $('#js_next_id', elements);
                            nextNewsId = parseInt(nextNewsId_.text());

                            var currentNewsId_ = $('#js_current_id', elements);
                            currentNewsId = parseInt(currentNewsId_.text());

                            var newsUrl_ = $('#js_news_url', elements);
                            newsUrl = newsUrl_.text();

                            var newsTitle_ = $('#js_news_title', elements);
                            newsTitle = newsTitle_.text();

                            reload_js('/templates/jet/js/separate-js/start.js' + '?' + new Date().getTime());
                            reload_js('/templates/jet/js/main.js' + '?' + new Date().getTime());
                        }
                    }
                });
                oldNewsId = currentNewsId;
            } else {
                console.log(currentNewsId + ' : ' + oldNewsId);
            }
        }
    });
}

function reload_js(src) {
    $('script[src="' + src + '"]').remove();
    $('<script>').attr('src', src).appendTo('head');
}


function updateLiveInternetCounter()
{
    new Image().src = "//counter.yadro.ru/hit?r" +
            escape(document.referrer) + ((typeof (screen) == "undefined") ? "" :
            ";s" + screen.width + "*" + screen.height + "*" + (screen.colorDepth ?
                    screen.colorDepth : screen.pixelDepth)) + ";u" + escape(document.URL) +
            ";h" + escape(document.title.substring(0, 150)) +
            ";" + Math.random();

    console.log('li updated');
}
