(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'./gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5VLJZ5B');
var request_uri = './';
var count_cursos = 9;
var iebs_user_id = '';
var debug_mode = 0;
var logged_in = false;
    var tNow = 1584362024;
var tEnd = 1584376424;
        var is_cuenta_completada = undefined;
    var get_wistia_stats = false;
        var accounts_uri = "https://accounts.iebschool.com";
var frontend_uri = ".";
        var current_uri = "/";
var plan_instant = "9,99 €";
var plan_basic_month = "19,90 €";
var plan_basic_year = "199,00 €";
var plan_premium_month = "24,90 €";
var plan_premium_year = "249,00 €";
var plan_live_month = "7,90 €";
var plan_live_year = "79,00 €";
var global_cupon_codigo = "";
var global_cupon_codigo_suscripcion = "";
Stripe.setPublishableKey('pk_live_pT4FS0jQBytnndHioz5SKpfy');
var query_programas = '{"size": 10,"_source": ["nombre","slug","id","full_slug"],"query": {"filtered": {"query": {"multi_match": {"query": "QUERY","operator": "AND","fields": ["nombre","tags.name","categoria.name","subcategoria.name","tipo.name"]}},"filter": {"and": [{"not": {"filter": {"ids": {"type": "curso","values": [[]]}}}},{"term": {"estado": "publicado"}},{"term":{"is_freebie":false}}]}}}}';

	var query_profesores = '{"size": 10,"_source": ["slug", "name"], "query": {"match": {"name": {"query": "QUERY","operator": "and"}}}}';
	
    var query_playlist = '{"size": 10,"_source": ["slug", "nombre"], "query": {"match": {"nombre": {"query": "QUERY","operator": "and"}}}}';

    var domain = '.';

    function getTextValue()
    {
        var text_value = "";
        $.each($('.tt-input'), function(index, input) {
            if($(input).val() != ''){
                text_value = $(input).val();
            }
        });
        return text_value;
    }
    jQuery(document).ready(function ($) {

        var search_programas = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 12,
            remote: {
                url: domain + '/instant/curso/_search',
                filter: function (search_programas) {

                    return $.map(search_programas.hits.hits, function (object) {
                        return {
                            value: object._source.nombre,
                            full_slug: object._source.full_slug
                        };
                    });
                },
                ajax: {
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: domain + '/instant/curso/_search',
                    data: query_programas,
                    success: function (data) {

                        var search = getTextValue();
                        if(search.length >= 3){
                            var uuid = undefined;
                            var origen = 'search';
                            var name = "INSTANT_GA=";
                            var ca = document.cookie.split(';');

                            for (var i = 0; i < ca.length; i++) {
                                var c = ca[i];
                                while (c.charAt(0) == ' ') c = c.substring(1);
                                if (c.indexOf(name) == 0) {
                                    uuid = c.substring(name.length, c.length);
                                }
                            }

                            var xmlhttp; //Make a variable for a new ajax request.
                            if (window.XMLHttpRequest) { //If it's a decent browser...
                                // code for IE7+, Firefox, Chrome, Opera, Safari
                                xmlhttp = new XMLHttpRequest(); //Open a new ajax request.
                            }
                            else { //If it's a bad browser...
                                // code for IE6, IE5
                                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); //Open a different type of ajax call.
                            }
                            var url = "/analytics.php?uuid=" + uuid + "&origen=" + origen + "&search=" + search ; //Send the time on the page to a php script of your choosing.
                            xmlhttp.open("GET", url, false); //The false at the end tells ajax to use a synchronous call which wont be severed by the user leaving.
                            xmlhttp.send(null);
                        }
                    }
                },
                replace: function (url, query) {
                    var text_value = getTextValue();
                    search_programas.remote.ajax.data = query_programas.replace(/QUERY/g, text_value);
                    return url + '#' + query;
                }
            }
        });

		var search_profesores = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 12,
            remote: {
                url: domain + '/instant/profesor/_search',
                filter: function (search_profesores) {

                    return $.map(search_profesores.hits.hits, function (object) {
                        return {
                            value: object._source.name,
                            slug: object._source.slug
                        };
                    });
                },
                ajax: {
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: domain + '/instant/profesor/_search',
                    data: query_profesores,
                    success: function (data) {

                    }
                },
                replace: function (url, query) {
                    var text_value = getTextValue();
                    search_profesores.remote.ajax.data = query_profesores.replace(/QUERY/g, text_value);
                    return url + '#' + query;
                }
            }
        });
		
        var search_playlists = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: domain + '/instant/playlist/_search',
                filter: function (search_playlists) {
                    return $.map(search_playlists.hits.hits, function (object) {
                        return {
                            value: object._source.nombre,
                            slug: object._source.slug
                        };
                    });
                },
                ajax: {
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: domain + '/instant/playlist/_search',
                    data: query_playlist,
                    success: function (data) {
                        //Do Nothing
                    }
                },
                replace: function (url, query) {
                    var text_value = getTextValue();
                    search_playlists.remote.ajax.data = query_playlist.replace(/QUERY/g, text_value);
                    return url + '#' + query;
                }
            }
        });

        //Initialize search engine
        search_programas.initialize();
		search_profesores.initialize();
        search_playlists.initialize();

        var searchHomeTypeahead = $('#searchHome.typeahead');

        searchHomeTypeahead.typeahead({
            hint: true,
            highlight: true
        },
        {
            name: 'Cursos',
            source: search_programas.ttAdapter(),
            templates: {
                header: '<h5 class="tt-tag-heading"></h5>',
                suggestion: function (data) {
                    //return '<div class="tt-row"><a href="./'+data.full_slug+'"><p>' + data.value + '</p></a></div><div class="clear"></div>';
                }
            }
        } 
		,{
            name: 'Profesores',
            source: search_profesores.ttAdapter(),
            templates: {
                header: '<h5 class="tt-tag-heading">Profesores</h5>',
                suggestion: function (data) {
                    //return '<div class="tt-row"><a href="./profesor/'+data.slug+'/"><p><strong>' + data.value + '</strong></p></a></div><div class="clear"></div>';
                }
            }
        },{
            name: 'Playilist',
            source: search_playlists.ttAdapter(),
            templates: {
                header: '<h5 class="tt-tag-heading">Playlists</h5>',
                suggestion: function (data) {
                    //return '<div class="tt-row"><a href="./playlist/'+data.slug+'/"><p><strong>' + data.value + '</strong></p></a></div><div class="clear"></div>';
                }
            }
        }
        ).on('typeahead:selected', function (event, datum, name) {
                if (datum == undefined) {
                    $('.typeahead.tt-input').val($('#misspell_text').html());
                    $('#form_search_home').submit();
                }else{
                    if(name=='Playilist'){
                        document.location.href="." + datum.slug;
                    }
                    if(name=='Cursos'){
                        document.location.href = "." + datum.full_slug;
                    }
					if(name=='Profesores'){
                        document.location.href= "./profesor/" + datum.slug;
                    }
                }
        });

        searchHomeTypeahead.on('keydown', function (event) {
            if (event.which == 13) {
                return false;
                //$('#form_search_home').submit();
            }
        });

        var usuarios = new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/admin/usersPlan/?q=%QUERY',

            }
        });
        usuarios.initialize();
        $('#searchUserPlan.typeahead').typeahead(null, {
            displayKey: 'value',
            source: usuarios.ttAdapter(),
            templates: {
                header: '<h5 class="tt-tag-heading"></h5>',
                suggestion: function (data) {
                    if(data.id==0){
                        return '<div class="tt-row" style="background-color:white;"><p>Sin resultados - Crear usuario</p></div><div class="clear"></div>';
                    }else{
                        return '<div class="tt-row" style="background-color:white;"><p>' + data.first_name + ' ' + data.last_name + ' (' + data.email_address + ')</p></div><div class="clear"></div>';
                    }
                }
            }
        }).on('typeahead:selected', function (event, datum, name) {
            if (datum.id==0){
                $('.new-user-dashform').show();
                $('#newuser-nombre').focus();
            }else{
                $('.new-user-dashform').hide();
                $('.search-user-sel').html('Usuario: ' +datum.first_name + ' ' + datum.last_name + ' (' + datum.email_address + ')');
                $('#regala-email').val(datum.email_address );
            }
        });

    });

var InstantAnalytics = function () {

        function getCookieName() {
            return 'INSTANT_GA';
        }

        function generateUUID() {
            var d = new Date().getTime();

            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });

            return uuid;
        }

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
        }

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');

            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }

            return "";
        }

        return {
            init: function () {

                var ga = getCookie(getCookieName());

                if (ga != "") {
                    var uuid = ga;
                } else {
                    var uuid = generateUUID();
                }

                setCookie(getCookieName(), uuid, 15);

                window.onload = function () { //When the user leaves the page(closes the window/tab, clicks a link)...
                    if(typeof origen !== 'undefined'){
                        var curso_id = null; //Obtengo el curso id en caso que estemos en frontend o backend.
                        if(typeof global_curso_id !== 'undefined') {
                            curso_id = global_curso_id;
                        }
                        var xmlhttp; //Make a variable for a new ajax request.
                        if (window.XMLHttpRequest) { //If it's a decent browser...
                            // code for IE7+, Firefox, Chrome, Opera, Safari
                            xmlhttp = new XMLHttpRequest(); //Open a new ajax request.
                        }
                        else { //If it's a bad browser...
                            // code for IE6, IE5
                            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); //Open a different type of ajax call.
                        }
                        var url = "/analytics.php?curso_id=" + curso_id + "&uuid=" + uuid + "&origen=" + origen + "&user_id=" + user_id; //Send the time on the page to a php script of your choosing.
                        xmlhttp.open("GET", url, false); //The false at the end tells ajax to use a synchronous call which wont be severed by the user leaving.
                        xmlhttp.send(null); //Send the request and don't wait for a response.
                    }
                }
            }
        };

    }();

    InstantAnalytics.init();

var is_hidden = false;

    function hideCookiesBand(){
        jQuery.ajax({
            url: './aviso-cookies-remove/?do=true',
            cache: false,
            dataType: 'jsonp'
        });
        $('#cookies_band').animate({
            bottom: "-300px"
        });
        is_hidden = true;
    }

    jQuery(document).ready(function(){
            setTimeout(function() {
                jQuery("#cookies_band").animate({
                    bottom: "0px"
                });
            },2000);
    });

    jQuery(document).bind('ready', function() {
        jQuery('.close_cookies_band').click(function(e) {
            e.preventDefault();
            hideCookiesBand();
        });
    });