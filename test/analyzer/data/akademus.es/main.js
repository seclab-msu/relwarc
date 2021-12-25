"use strict";


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/******************* Chart Functions *********************/
var chartData = {};
var chart_colors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'];

/******************* Chart Functions *********************/

/***************** DataTable Functions *******************/
function init_DataTables() {

    console.log('run_datatables');

    if( typeof ($.fn.DataTable) === 'undefined'){ return; }
    console.log('init_DataTables');

    var handleDataTableButtons = function() {
        if ($("#datatable-buttons").length) {
            $("#datatable-buttons").DataTable({
                dom: "Bfrtip",
                buttons: [
                    {
                        extend: "copy",
                        className: "btn-sm"
                    },
                    {
                        extend: "csv",
                        className: "btn-sm"
                    },
                    {
                        extend: "excel",
                        className: "btn-sm"
                    },
                    {
                        extend: "pdfHtml5",
                        className: "btn-sm"
                    },
                    {
                        extend: "print",
                        className: "btn-sm"
                    },
                ],
                responsive: true
            });
        }
    };

    var TableManageButtons = function() {
        "use strict";
        return {
            init: function() {
                handleDataTableButtons();
            }
        };
    }();

    TableManageButtons.init();

};
/***************** DataTable Functions *******************/

//Reporte facturacion profesores (Admin)
function getFacturacionProfesores(from, to)
{
    $.ajax({
        url: '/admin/facturacion-profesores/',
        method: "POST",
        data: {
            from: from.format('YYYY-MM-DD'),
            to: to.format('YYYY-MM-DD')
        },
        success: function (response) {
            var container = $('#datatable_facturacion_profesores tbody');
            container.html('');
            $(response.data.data).each(function (i, e) {
                container.append('<tr>');
                $(e).each(function (indice, elemento) {
                    container.append('<td>' + elemento.user_id + '</td>');
                    container.append('<td>' + elemento.user_name + '</td>');
                    container.append('<td>' + elemento.curso_id + '</td>');
                    container.append('<td>' + elemento.curso_name + '</td>');
                    container.append('<td>' + elemento.playlist_id + '</td>');
                    container.append('<td>' + elemento.playlist_name + '</td>');
                    container.append('<td>' + elemento.precio_venta_directo + '</td>');
                    container.append('<td>' + elemento.ponderacion_producto + '</td>');
                    container.append('<td>' + elemento.precio_ponderado + '</td>');
                    container.append('<td>' + elemento.profesor_id + '</td>');
                    container.append('<td>' + elemento.profesor_name + '</td>');
                    container.append('<td>' + elemento.comision + '</td>');
                    container.append('<td>' + elemento.tipo_compra + '</td>');
                    container.append('<td>' + elemento.fecha + '</td>');
                });
                container.append('</tr>');
            });

            container.append('<tr>');
            $(response.data.totales).each(function (i, elemento) {
                container.append('<td colspan="6"><b>' + elemento.user_id + '</b></td>');
                container.append('<td><b>' + elemento.venta_total + '</b></td>');
                container.append('<td></td>');
                container.append('<td><b>' + elemento.precio_ponderado_total + '</td>');
                container.append('<td colspan="2"></td>');
                container.append('<td><b>' + elemento.comisiones_profesor_total + '</b></td>');
            });
            container.append('</tr>');
        }

    });
}

var Instant = function () {

    var plan_stripe_id = undefined;
    var curso_id = undefined;
    var playlist_id = undefined;
    var clicked_element = null;
    var facturacionProfesoresStartDate;
    var facturacionProfesoresEndDate;

    //Check if im logged into accounts
    function checkLoggedIn(handleData) {
        return $.ajax({
            url: '/api/user/is_logged/',
            dataType: "json",
            success: function(response){
                handleData(response);
            }
        });
    }

    //Compra directa sin subscripcion
    if (typeof global_curso_id !== 'undefined') {
        curso_id = global_curso_id;
    }


    //Compra con Subscripcion
    function buySubscribe() {
        
        if(typeof global_curso_id != 'undefined') {
            curso_id = global_curso_id;
        }
        if(typeof global_playlist_id != 'undefined') {
            playlist_id = global_playlist_id;
        }

        $("#payment_form_subscribe_container").hide();
        $("#plan_options").show();
        $(".plan_footer").show();
        $(".buy_pay_content").hide();
        $(".buy_pay_playlist_content").hide();
        $(".buy_pay_subscribe").show();


        
        
        if($("#cupon_codigo").length){
            if($("#cupon_codigo").val()){
                $('#choose_plan_id').val(4);
                $.ajax({
                    url: '/api/cupon_precios/',
                    method: "POST",
                    dataType: "json",
                    async: false,
                    data: {
                        cupon_codigo: $("#cupon_codigo").val(),
                        plan_stripe_id: 4,
                        curso_id: null,
                        playlist_id: null
                    },
                    success: function (response) {
                        cupon_precios['plan'] = response;
                        $("#ModalSubscribe").modal();
                        console.log($('#subscripcion_precio_cupon').length);
                        setTimeout(function(){
                            //$("#apply_cupon").trigger('click');
                            if($('#subscripcion_precio_cupon').length){
                                $('#subscripcion_precio_cupon').closest('.modal-title').html($('#subscripcion_precio_cupon').closest('.modal-title').html().replace('por', ''));
                            }
                            $("#subscripcion_precio_cupon").html('GRATIS');
                            $('#subscripcion_precio_cupon').show();
                            $("#subscripcion_precio").addClass('subscripcion_precio_original');
                            applyCupon();
                        }, 200)
                        

                    },
                    error: function (response) {
                        if(debug_mode) {
                            console.log(response);
                        }
                    }
                });
                
            }
        }else{
            $("#ModalSubscribe").modal();
        }
       

    }

    //Compra directa de Playlist sin subscripcion

    function update_provincia() {
        if ($('#consulta_pais_id').val() != '1') {
            $('#consulta_provincia_id').removeAttr("enabled");
            $('#consulta_provincia_id').attr("disabled", "disabled");
            $('#consulta_provincia_ext').show();
            $('#consulta_provincia_id').hide();
        }
        else {
            $('#consulta_provincia_id').removeAttr("disabled");
            $('#consulta_provincia_id').attr("enabled", "enabled");
            $('#consulta_provincia_id').show();
            $('#consulta_provincia_ext').hide();
        }
    }

    function hidePopupBand(popoup_id){
        jQuery.ajax({
            url: '/aviso-popup-remove/?do=' + popoup_id,
            cache: false,
            dataType: 'jsonp'
        });
    }
    
    function limpiarTildes(text){
        var text = text.toLowerCase(); // a minusculas
        text = text.replace(/[áàäâå]/, 'a');
        text = text.replace(/[éèëê]/, 'e');
        text = text.replace(/[íìïî]/, 'i');
        text = text.replace(/[óòöô]/, 'o');
        text = text.replace(/[úùüû]/, 'u');
        text = text.replace(/[ýÿ]/, 'y');
        text = text.replace(/[ñ]/, 'n');
        text = text.replace(/[ç]/, 'c');
        // text = text.replace(/['"]/, '');
        // text = text.replace(/[^a-zA-Z0-9-]/, '');
        // text = text.replace(/\s+/, '-');
        // text = text.replace(/' '/, '-');
        // text = text.replace(/(_)$/, '');
        // text = text.replace(/^(_)/, '');
        return text;
    }
    
    // este es para quitar el input provincia_ext
    update_provincia();
    // este es para que se acutalice solo en el change
    $('#consulta_pais_id').on('change', update_provincia);

    var cupon_precios = {plan: {}};
    if ((typeof curso_id !== 'undefined' || typeof playlist_id !== 'undefined') && (typeof global_cupon_codigo !== 'undefined' && global_cupon_codigo!='')) {
        cuponPrecios(null, null);
    }

    function cuponPrecios(plan_id, cupon_codigo){
        if(plan_id != null){
            plan_stripe_id = plan_id;
        }
        if(cupon_codigo == null){
            cupon_codigo = global_cupon_codigo;
        }
        $.ajax({
            url: '/api/cupon_precios/',
            method: "POST",
            dataType: "json",
            async: false,
            data: {
                cupon_codigo: cupon_codigo,
                plan_stripe_id: plan_stripe_id,
                curso_id: curso_id,
                playlist_id: playlist_id
            },
            success: function (response) {
                cupon_precios['plan'] = response;

            },
            error: function (response) {
                if(debug_mode) {
                    console.log(response);
                }
            }
        });
    }

    function resetCupon(){
        $('.curso_precio_cupon').html('');
        $('#subscripcion_precio_cupon').hide();
        $('#subscripcion_precio_cupon span').html('');
        $('.curso_precio').removeClass('curso_precio_original');
        $('#subscripcion_precio').removeClass('subscripcion_precio_original');
        $("#payment_form_subscribe_container #cupon_submit").hide();
        $("#payment_form_subscribe_container .datos-tarjeta-modal").show();
    }

    function applyCupon(){
        var cupon_codigo = $('#payment-form-subscribe #cupon_codigo').val();
        if(cupon_codigo=='')
        {
            $('.curso_precio').removeClass('curso_precio_original');
            $('.message_error .message').html('');
            $('.message_error').hide();
            return false;
        }

        if(current_uri.indexOf('/landing/founders/') !== -1){
            if(cupon_codigo.toLowerCase() != 'founders60'){
                $('.curso_precio_cupon').html('');
                $('#subscripcion_precio_cupon').hide();
                $('#subscripcion_precio_cupon span').html('');
                $('.curso_precio').removeClass('curso_precio_original');
                $('#subscripcion_precio').removeClass('subscripcion_precio_original');
                $('.message_error .message').html('El cupón no es válido');
                $('.message_error').show();
                $("#payment_form_subscribe_container #cupon_submit").hide();
                $("#payment_form_subscribe_container .datos-tarjeta-modal").show();
                return false;
            }
        }

        if(current_uri.indexOf('/landing/founders-alumno/') !== -1){
            if(cupon_codigo.toLowerCase() != 'founders60'){
                $('.curso_precio_cupon').html('');
                $('#subscripcion_precio_cupon').hide();
                $('#subscripcion_precio_cupon span').html('');
                $('.curso_precio').removeClass('curso_precio_original');
                $('#subscripcion_precio').removeClass('subscripcion_precio_original');
                $('.message_error .message').html('El cupón no es válido');
                $('.message_error').show();
                $("#payment_form_subscribe_container #cupon_submit").hide();
                $("#payment_form_subscribe_container .datos-tarjeta-modal").show();
                return false;
            }
        }

        if (typeof global_curso_id !== 'undefined') {
            curso_id = global_curso_id;
        }
        if (typeof global_playlist_id !== 'undefined') {
            playlist_id = global_playlist_id;
        }
        var valid = '';
        if (plan_stripe_id == undefined || (plan_stripe_id != "1" && plan_stripe_id != "6")) {
            if ($('#choose_plan_id').val() == 0) {
                $('.plan_footer').addClass('has-error');
                $('.validation').addClass('text-danger');
                $('.validation').removeClass('text-success');
                valid = false;
                return false;
            }
            plan_stripe_id = $('#choose_plan_id').val();
        }
        //if(cupon_codigo != global_cupon_codigo){
            cuponPrecios(plan_stripe_id, cupon_codigo);
        //}
        //if(debug_mode) {
        //     console.log('cupon_precios');
        //     console.log(cupon_precios);
        //     console.log(plan_stripe_id);
        // //}
        if(plan_stripe_id in cupon_precios['plan']) {
            var response = cupon_precios['plan'][plan_stripe_id];
            //$('.message_success .message').html(response.message);
            //$('.message_success').show();

            if(response.success) {
                $("#payment_form_subscribe_container #cupon_submit").hide();
                $('#subscripcion_precio_cupon').show();
                $('#subscripcion_precio').addClass('subscripcion_precio_original');
                $('.curso_precio_cupon').html(response.precio_final);
                $('.curso_precio').addClass('curso_precio_original');
                $('#playlist_precio_cupon').html(response.precio_final);
                $('#playlist_precio').addClass('curso_precio_original');
                $('.message_error').hide();
                if(response.precio_final == "99,00 €") {
                    $("#payment_form_subscribe_container .datos-tarjeta-modal").show();
                    $('#subscripcion_precio_cupon span').html("99 €");
                    $("#div_aplicar_cupon").show();
                    $("#div_continuar_compra_gratuita").hide();
                }else if(response.precio_final != '0,00 €') {
                    $("#payment_form_subscribe_container .datos-tarjeta-modal").show();
                    $('#subscripcion_precio_cupon span').html(response.precio_final);
                    $("#div_aplicar_cupon").show();
                    $("#div_continuar_compra_gratuita").hide();
                }else {

                    //100% FREE
                    if($('#subscripcion_precio_cupon').length){
                        $('#subscripcion_precio_cupon').closest('.modal-title').html($('#subscripcion_precio_cupon').closest('.modal-title').html().replace('por', ''));
                    }
                    $('#subscripcion_precio_cupon').html('GRATIS');
                    $("#payment_form_subscribe_container .datos-tarjeta-modal").hide();
                    $("#payment_form_subscribe_container #cupon_submit").show();
                    $("#div_aplicar_cupon").hide();
                    $("#div_continuar_compra_gratuita").show();
                }
            }else{
                $('.curso_precio_cupon').html('');
                $('.curso_precio').removeClass('curso_precio_original');
                $('#playlist_precio_cupon').html('');
                $('#playlist_precio').removeClass('curso_precio_original');
                $('#subscripcion_precio_cupon').hide();
                $('#subscripcion_precio_cupon span').html('');
                $('.message_error .message').html(response.message);
                $('.message_error').show();
                $("#payment_form_subscribe_container #cupon_submit").hide();
                $("#payment_form_subscribe_container .datos-tarjeta-modal").show();
            }
        }else{
            $('.curso_precio_cupon').html('');
            $('#subscripcion_precio_cupon').hide();
            $('#subscripcion_precio_cupon span').html('');
            $('#playlist_precio_cupon').html('');
            $('#playlist_precio').removeClass('curso_precio_original');
            $('#curso_precio').removeClass('curso_precio_original');
            $('#subscripcion_precio').removeClass('subscripcion_precio_original');
            $('.message_error .message').html('El cupón no es válido');
            $('.message_error').show();
            $("#payment_form_subscribe_container #cupon_submit").hide();
            $("#payment_form_subscribe_container .datos-tarjeta-modal").show();
            //$('.message_success').hide();
        }
    }

    function applySaldo() {
        console.log('applySaldo');
        var saldo_disponible = $('#payment-form-subscribe #saldo_disponible').val();
        if (saldo_disponible == '') {
            $('.curso_precio').removeClass('curso_precio_original');
            $('.message_error .message').html('');
            $('.message_error').hide();
            return false;
        }

        if (typeof global_curso_id !== 'undefined') {
            curso_id = global_curso_id;
        }
        if (typeof global_playlist_id !== 'undefined') {
            playlist_id = global_playlist_id;
        }
        var precio_original = 0;
        if (plan_stripe_id == undefined || (plan_stripe_id != "1" && plan_stripe_id != "6")) {
            if ($('#choose_plan_id').val() == 0) {
                $('.plan_footer').addClass('has-error');
                $('.validation').addClass('text-danger');
                $('.validation').removeClass('text-success');
                return false;
            }
            plan_stripe_id = $('#choose_plan_id').val();
            precio_original = $.trim($('#subscripcion_precio').html().replace('€/mes', '').replace('€/año', '').replace(',', '.'));
        } else {
            precio_original = $.trim(curso_precio.replace('€', '').replace(',', '.'));
        }

        var descuento = $.trim($('#saldo_disponible').val().replace('€', '').replace(',', '.'));
        if(!isNaN(descuento))
        {
            $('#saldo_disponible').parent().removeClass("has-error").addClass("has-success");
            var precio_descuento = 0;
            if(Number(precio_original) > Number(descuento))
            {
                precio_descuento = (precio_original - descuento).toFixed(2);
            }
            if(Number(precio_descuento) !== Number(precio_original))
            {
                $('#subscripcion_precio_cupon').show();
                $('#subscripcion_precio_cupon span').html(precio_descuento);
                $('.curso_precio_cupon').html(precio_descuento + ' €');
                $('.curso_precio').addClass('curso_precio_original');
                $('#subscripcion_precio').addClass('subscripcion_precio_original');
                $('.message_error').hide();
            }


        } else {
            $('#saldo_disponible').parent().removeClass("has-success").addClass("has-error");
            $('#subscripcion_precio_cupon').hide();
            $('.curso_precio_cupon').html('');
            $('.curso_precio').removeClass('curso_precio_original');
            $('#subscripcion_precio').removeClass('subscripcion_precio_original');
            $('.message_error').show();
        }
        
    }

    return {
        init: function () {

            if($('#nombre-searcher').length>0){
                $('#nombre-searcher').on('keyup', function () {
                    var search = $(this).val();
                    if(search.length>3){
                        $(".serp-back .item_serp").css("display", "none");
                        $(".serp-back .item_serp")
                            .filter(function (index, elem) {
                                var nombre = limpiarTildes($(elem).find('.padding_item_serp').html().toLowerCase());
                                var n = nombre.search(limpiarTildes(search.toLowerCase()));
                                return n > 0;
                            })
                            .css("display", "block");
                    }
                    if(search.length==0){
                        $(".serp-back .item_serp").css("display", "block");
                    }
                    $('#count_cursos').html($(".serp-back .item_serp:visible").length);
                });
            }

            if($(".btn-modal-wiziq").length>0){
                $(".btn-modal-wiziq").on('click', function(){
                    setTimeout(function(){ 
                        jQuery('#Footermaster_dvDetailedFooter').remove();
                        jQuery('.login_tp_nav').parent().parent().remove();
                    }, 3000);
                });
            }
            
            // hace que los modals no se muestren 2 a la vez
            $('.modal').on('show.bs.modal', function () {
                $('.modal').not($(this)).each(function () {
                    $(this).modal('hide');
                });
            });/**/

            if ($(".summernote").length) {
                $('.summernote').summernote({
                    height: 200,                 // set editor height
                    minHeight: null,             // set minimum height of editor
                    maxHeight: null,             // set maximum height of editor
                    focus: true,                  // set focus to editable area after initializing summernote
                });
            }


            if ($("#filtros-instructor").length) {
                $('#filtros-instructor select').on('change', function () {
                    jQuery('#filtros-instructor form').submit()
                });
            }

           $("#ModalMesGratis").on("hidden.bs.modal", function () {
                hidePopupBand('ModalMesGratis');
                $("#ModalMesGratis").modal('close');
            });
            $("#ModalMesGratis").on("shown.bs.modal", function () {
                $("body").removeClass('modal-open');
            });

            if ($("#mensajes").length) {
                $("#mensajes").addClass("display");
                $("#close-mensajes.mensaje-mayo").on('click',function (event) {
                    event.preventDefault();
                    $(this).parent().addClass("close-mensajes");
                    hidePopupBand('mensajes');
                    if($(this).parent().hasClass('mensaje-mayo')){
                        $(this).parent().remove();
                        $("#mensajes").addClass("display");
                        $("#close-mensajes").on('click',function (event) {
                            event.preventDefault();
                            $(this).parent().addClass("close-mensajes");
                        });
                    }
                });
            }

            //Mostramos pop up de compra si esta logueado sino el de login
            $(".btn_checklogged_and_marticula").on("click", function () {
                checkLoggedIn(function (response) {
                        if (response) {
                            if (response.success === true && response.message === true) {
                                window.location.href = '/oauth/login/?continue=' + window.location.href;
                            } else {
                                $("#ModalLogin").modal();
                            }
                        } else {
                            // Tell the user their password was bad
                        }
                    })
            });

            //Mostramos pop up de compra si esta logueado sino el de login
            $(".check_loggedin").on("click", function () {
                if(!$(this).hasClass('nmodal')) {
                    clicked_element = $(this).attr('id');
                }
                checkLoggedIn(function (response) {
                        if (response) {
                            if (response.success === true && response.message === true) {
                                window.location.href = '/oauth/login/?continue=' + window.location.href + '#clicked_element=' + clicked_element;
                            } else {
                                $("#ModalLogin").modal();
                            }
                        } else {
                            // Tell the user their password was bad
                        }
                    })
            });

            $(".buy_subscribe_type").on("click", function () {
                if(!$(this).hasClass('nmodal')) {
                    clicked_element = $(this).attr('id');
                    if((clicked_element === '' || typeof(clicked_element) !== undefined) && $(this).data('hash')){
                        clicked_element = $(this).data('hash');
                    }

                    modal_registro_texts(clicked_element);
                    show_compra_step(clicked_element);
                }
            });

            function gift_suscribe_texts(plan_id){
                var text = '';
                switch(plan_id){
                    case 9:
                        text = 'Regala 1 mes de suscripción';
                        break;
                    case 10:
                        text = 'Regala 3 meses de suscripción';
                        break;
                    case 11:
                        text = 'Regala 6 meses de suscripción';
                        break;
                    case 12:
                        text = 'Regala 1 año de suscripción';
                        break;
                }
                var modal_title = $("#ModalRegalo .modal-title");
                modal_title.html(text);
            }

            $(".buy_gift_subscribe_type").on("click", function () {
                if(!$(this).hasClass('nmodal')) {
                    // modal_registro_texts(clicked_element);
                    // show_compra_step(clicked_element);
                    var plan_id = $(this).data('target-plan');
                    gift_suscribe_texts(plan_id);
                    $("#ModalRegalo #choose_plan_id_gift").val(plan_id);
                    $("#ModalRegalo").modal('show');
                }
            });

            $("#choose_plan_id_gift").change(function(){
                gift_suscribe_texts(parseInt($(this).val()));
            });

            $(".check_loggedin_and_signup").on("click", function () {
                if(!$(this).hasClass('nmodal')) {
                    clicked_element = $(this).attr('id');
                }
                checkLoggedIn(function (response) {
                        if (response) {
                            if (response.success === true && response.message === true) {
                                window.location.href = '/oauth/login/?continue=' + window.location.href + '#clicked_element=' + clicked_element;
                            } else {
                                $("#ModalRegistro").modal();
                            }
                        } else {
                            // Tell the user their password was bad
                        }
                    })
            });

//Mostramos pop up de importar cursos desde Moodle
            $(".btn_import_curso").on("click", function (event) {
                if($('#moodle_campus').val() == '') {
                    $('.modal_import_curso .message').html('<div class="errores_form"><div class="ico_error">Debes seleccionar un Campus</div>');
                    event.preventDefault();
                    return false;
                }
                if($('#moodle_book_id').val() == '') {
                    $('.modal_import_curso .message').html('<div class="errores_form"><div class="ico_error">Debes ingresar el id del libro del Campus</div>');
                    event.preventDefault();
                    return false;
                }

                var instant_curso_id = false;
                if (typeof global_curso_id !== 'undefined') {
                    instant_curso_id = global_curso_id;
                }

                $('.modal_import_curso .message').html('<div class="alert text-center"><h3>Se está importando el curso. Te redirigiremos cuando esté listo</h3></div>');
                $('.modal_import_curso .import-form').hide();
                $('.modal_import_curso .modal-content').addClass('loading_instant');
                $('.modal_import_curso .modal-header').hide();
                $('.modal_import_curso .btns').hide();
                $('.modal_import_curso .errores_form').hide();

                $.ajax({
                    url: '/api/importCourse/',
                    method: "POST",
                    dataType: "json",
                    data: {
                        moodle_origen: $('#moodle_campus').val(),
                        moodle_curso_id: $('#moodle_book_id').val(),
                        instant_curso_id: instant_curso_id
                    },
                    success: function (response) {
                        if(debug_mode) {
                            console.log(response);
                        }
                        if (response.success === true) {
                            window.location = '/teaching/mis-cursos/' + response.slug + '/';
                        } else {
                            $('.modal_import_curso .message').prepend('<div class="errores_form"><div class="ico_error">' + response.message + '</div>');
                            $('.modal_import_curso .modal-content').removeClass('loading_instant');
                            $('.modal_import_curso .modal-header').show();
                            $('.modal_import_curso .btns').show();
                            $('.modal_import_curso #moodle_book_id').show();
                            $('.modal_import_curso .alert').hide();
                        }
                    },
                    error: function (response) {
                        if(debug_mode) {
                            console.log(response);
                        }
                    }
                });
            });

            $(".check-user-playlist").on("click", function(event) {
                event.preventDefault();
                playlist_id = $(this).data('playlist');
                curso_id = $(this).data('curso');
                var href = $(this).prop('href');

                if(curso_id == '' || curso_id == 'undefined' || playlist_id == '' || playlist_id == 'undefined'){
                    return false;
                }

                $.ajax({
                    url: '/api/check-user-playlist/',
                    method: "POST",
                    dataType: "json",
                    data: {
                        playlist_id: playlist_id,
                        curso_id: curso_id
                    },
                    success: function (response) {
                        if (response.status === true) {
                            window.location.href = href;
                        }else{
                            alertify.notify(response.message, 'error', 5);
                        }
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            });

            //Al clicar en "Inscríbete al curso" matricualo el usuario
            $(".btn_curso_free_matricula").on("click", function () {
                curso_id = global_curso_id;
                $.ajax({
                    url: '/api/curso/matricular/',
                    method: "POST",
                    dataType: "json",
                    data: {
                        curso_id: curso_id
                    },
                    success: function (response) {
                        console.log(response);
                        if (response.success === true) {
                            if(response.slug != undefined) {
                                window.location.href = response.slug;
                            } else {
                                $('.modal_curso_free_matricula').modal();
                                $('.modal_curso_free_matricula .message').html(response.message);
                            }

                        } else {
                            $('.modal_curso_free_matricula').modal();
                            $('.modal_curso_free_matricula .message').html('<div class="alert alert-danger text-center"><h4>' + response.message + '</h4></div>');
                        }
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            });
            
            //Mostramos pop up de compra si esta logueado sino el de login
            $(".buy_pay").on("click", function () {
                //$('#ModalPagoGratis').modal();return false;//QUITAR DESPUES DEL 1ERO

                clicked_element = $(this).attr('id');
                checkLoggedIn(function(response) {
                    if (response.success === true && response.message == true) {
                        buyPay();
                    }else{
                        show_compra_step(clicked_element);
                        $("#ModalRegistro").modal();
                    }
                });
            });

            $("#curso_buy_pay, #curso_buy_subscribe").click(function(){
                if(typeof data_curso !== 'undefined'){
                    if(data_curso.type == 'freebie' && $(this).hasClass('btn_curso_free')) {
                        $('#ModalRegistro .modal-title').html('Suscríbete gratis para matricularte en: <br>' + data_curso.nombre);
                    }else{
                    console.log(data_curso.nombre);
                        $('#ModalRegistro .modal-title').html('Regístrate gratis para matricularte en: <br>' +  data_curso.nombre)
                    }
                }
            });

            //Mostramos pop up de compra si esta logueado sino el de login
            $(".buy_subscribe").on("click", function () {
                //$('#ModalPagoGratis').modal();return false;//QUITAR DESPUES DEL 1ERO

                clicked_element = $(this).attr('id');
                checkLoggedIn(function(response) {
                    if (response.success === true && response.message == true) {
                        buySubscribe();
                    }else{
                        show_compra_step(clicked_element);
                        $("#ModalRegistro").modal();
                    }
                });

            });

            //Mostramos pop up de compra de Playlist si esta logueado sino el de login
            $(".buy_pay_playlist").on("click", function () {
                //$('#ModalPagoGratis').modal();return false;//QUITAR DESPUES DEL 1ERO

                clicked_element = $(this).attr('id');
                var precio = $(this).data('precio');
                checkLoggedIn(function(response) {
                    if (response.success === true && response.message == true) {
                        buyPayPlaylist(precio);
                    }else{
                        show_compra_step(clicked_element);
                        $("#ModalRegistro").modal();
                    }
                });
            });

            //Lading www.akademus.es/series-educacion/mini-mba-digital-power-management/ probar una semana gratis
            $("#curso_free_week").click(function(){
                $("#ModalRegistro .form_signup_instant").append('<input type="hidden" id="next" name="next" value="' + frontend_uri + '/playlist/mba-digital/">');
            });

            //Landing http://www.akademus.es/landing/semana-gratis
            $("#semana_gratis, .semana_gratis").click(function(){
                $("#ModalRegistro .form_signup_instant").append('<input type="hidden" id="plan_semana_gratuita" name="plan_semana_gratuita" value="true">');
                $("#ModalRegistro .form_signup_instant").append('<input type="hidden" id="next" name="next" value="' + frontend_uri + '/mis-compras/">');
                $("#ModalLogin #form_login_instant").append('<input type="hidden" id="plan_semana_gratuita" name="plan_semana_gratuita" value="true">');
                $("#ModalLogin #form_login_instant").append('<input type="hidden" id="next" name="next" value="' + frontend_uri + '/mis-compras/">');
            });

            //Al camciar el tipo de Plan (Mensual/Anual) actualizo los textos
            $('#choose_plan_id').on("change", function () {
                changeTexts(this);
                if(typeof name_landing !== 'undefined' && name_landing === 'landing_founders_alumno') {
                    if($('#choose_plan_id').val() == "4")
                    {
                        $('#cupon_codigo').val('FOUNDERS60');

                    } else if($('#choose_plan_id').val() == "5") {
                        $('#cupon_codigo').val('FOUNDERS60');
                    } else {
                        $('#cupon_codigo').val('');
                    }
                }
                if(typeof name_landing !== 'undefined' && name_landing === 'landing_founders') {
                    if($('#choose_plan_id').val() == "4")
                    {
                        $('#cupon_codigo').val('FOUNDERS60');

                    } else if($('#choose_plan_id').val() == "5") {
                        $('#cupon_codigo').val('FOUNDERS60');
                    } else {
                        $('#cupon_codigo').val('');
                    }
                }
                if(typeof name_landing !== 'undefined' && name_landing === 'landing_mid_season') {
                    if($('#choose_plan_id').val() == "5") {
                        $('#cupon_codigo').val('HBGLM4XM');
                    } else if($('#choose_plan_id').val() == "2") {
                        $('#cupon_codigo').val('VERANO50%');
                    }
                    else {
                        $('#cupon_codigo').val('');
                    }
                }
                if($("#cupon_codigo").val() != ''){
                    $('#apply_cupon').click();
                }
            });

            //Dentro del Modal de compra con subscripcion seleccionamos el Tipo de Plan de subscripción y mostramos las dos opciones del tipo de Plan (Mensual/Anual)
            $(".choose-plan-tipo").on("click", function () {
                var self = this;
                checkLoggedIn(function(response){
                    if (response.success === true && response.message == true) {

                        //$("#cupon_codigo").val('');

                        var plan_tipo = $(self).data('plan-tipo');
                        $('#choose_plan_id').empty();
                        $('#choose_plan_id').append('<option value="0">Seleccione el Tipo de Plan</option>');
                        if (plan_tipo == 'standard') {
                            $('#choose_plan_id').append('<option value="2">Mensual</option><option value="3">Anual</option>');
                        }else if(plan_tipo == 'live'){
                            $('#choose_plan_id').append('<option value="13">Mensual</option><option value="14">Anual</option>');
                        } else {
                            $('#choose_plan_id').append('<option value="4">Mensual</option><option value="5">Anual</option>');
                        }
                        if($(self).data('cupon') !== '' && $(self).data('cupon') != undefined){
                            $("#cupon_codigo").val($(self).data('cupon'));
                        }
                        buySubscribe();
                        changeTexts($('#choose_plan_id'));
                        if(typeof $(self).data('cupon') != 'undefined') {
                            if ($(self).data('cupon')) {
                                var target_plan = 5;
                            }
                        }

                        if($(self).data('target-plan')){
                            target_plan = $(self).data('target-plan');
                            $("#choose_plan_id").val(target_plan).trigger('change');
                        }

                        $("#payment_form_subscribe_container").show();
                        $("#plan_options").hide();

                        if(typeof name_landing !== 'undefined' && name_landing === 'landing_founders_alumno') {
                            $('#choose_plan_id').val("0");
                            if($('#choose_plan_id').val() == "4")
                            {
                                $('.buy_pay_subscribe .plan_text').html("Plan Estandar Mensual");
                                $('.buy_pay_subscribe .modal-title').html("Suscríbete al Plan Premium por 9,90 €/mes");
                            } else if($('#choose_plan_id').val() == "5") {
                                $('.buy_pay_subscribe .plan_text').html("Plan Estandar Anual");
                                $('.buy_pay_subscribe .modal-title').html("Suscríbete al Plan Premium por <span id='subscripcion_precio_cupon'><span></span>/año</span> <span id='subscripcion_precio'>99 €/año</span>");
                            } else {
                                $('.buy_pay_subscribe .plan_text').html("");
                                $('.buy_pay_subscribe .modal-title').html("Suscríbete al Plan Premium");
                            }
                        }

                        if(typeof name_landing !== 'undefined' && name_landing === 'landing_founders') {
                            $('#choose_plan_id').val("0");
                            if($('#choose_plan_id').val() == "4")
                            {
                                $('.buy_pay_subscribe .plan_text').html("Plan Estandar Mensual");
                                $('.buy_pay_subscribe .modal-title').html("Suscríbete al Plan Premium por 12,45 €/mes");
                            } else if($('#choose_plan_id').val() == "5") {
                                $('.buy_pay_subscribe .plan_text').html("Plan Estandar Anual");
                                $('.buy_pay_subscribe .modal-title').html("Suscríbete al Plan Premium por <span id='subscripcion_precio_cupon'><span></span>/año</span> <span id='subscripcion_precio'>124,50 €/año</span>");
                            } else {
                                $('.buy_pay_subscribe .plan_text').html("");
                                $('.buy_pay_subscribe .modal-title').html("Suscríbete al Plan Premium");
                            }
                        }
                        
                    }else {
                        var modal = 'method_subscribe';
                        if(typeof(clicked_element) === undefined || clicked_element === '') {
                            clicked_element = $(self).attr('id');
                        }
                        show_compra_step(clicked_element);
                        $("#ModalRegistro").modal();
                    }
                });
            });

            $(".btn_playlist_free_compra").on("click", function() {
                playlist_id = global_playlist_id;
                $.ajax({
                    url: '/api/compra-playlist-free/',
                    method: "POST",
                    dataType: "json",
                    data: {
                        playlist_id: playlist_id
                    },
                    success: function (response) {
                        if (response.success === true) {
                            if(response.slug != undefined) {
                                window.location.href = response.slug;
                            } else {
                                console.log(response);
                            }

                        } else {
                            $('.modal_curso_free_matricula').modal();
                            $('.modal_curso_free_matricula .message').html('<div class="alert alert-danger text-center"><h4>' + response.message + '</h4></div>');
                        }
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            });

            function changeTexts(plan) {
                var texts = [];
                if ($(plan).val() === "2") {
                    texts['title'] = "Plan Estandar Mensual";
                    texts['message'] = "Suscríbete al Plan Estandar por <span id='subscripcion_precio_cupon'><span></span>/mes</span> <span id='subscripcion_precio'>" + plan_basic_month + "/mes</span>";
                } else if ($(plan).val() === "3") {
                    texts['title'] = "Plan Estandar Anual";
                    texts['message'] = "Suscríbete al Plan Estandar por <span id='subscripcion_precio_cupon'><span></span>/año</span> <span id='subscripcion_precio'>" + plan_basic_year + "/año</span>";
                } else if ($(plan).val() === "4") {
                    texts['title'] = "Plan Premium Mensual";
                    if(typeof name_landing != 'undefined' && name_landing === "landing_founders_alumno"){
                        texts['message'] = "<span id='modal-title-landing'>Suscríbete al Plan Premium por 9,90 €/mes</span>";
                    } else if(typeof name_landing != 'undefined' && name_landing === "landing_founders"){
                        texts['message'] = "<span id='modal-title-landing'>Suscríbete al Plan Premium por 9,90 €/mes</span>";
                    } else {
                        texts['message'] = "Suscríbete al Plan Premium por <span id='subscripcion_precio_cupon'><span></span>/mes</span> <span id='subscripcion_precio'>" + plan_premium_month + "/mes</span>";
                    }
                  
                } else if ($(plan).val() === "5") {
                    if($("#cupon_codigo").val().toUpperCase() == 'FOUNDERS'){
                        texts['message'] = "<span id='modal-title-landing'>Suscríbete al Plan Premium por <span id='subscripcion_precio_cupon'><span></span>/año</span> de por vida <span id='subscripcion_precio'>" + plan_premium_year + "/año</span></span>";
                    }  else if (typeof name_landing != 'undefined' && name_landing === "landing_founders_alumno") {
                        texts['message'] = "<span id='modal-title-landing'>Suscríbete al Plan Premium por 99 €/año</span>";
                    } else if(typeof name_landing != 'undefined' && name_landing === "landing_founders"){
                        texts['message'] = "<span id='modal-title-landing'>Suscríbete al Plan Premium por 99 €/año</span>";
                    } else {
                        texts['message'] = "Suscríbete al Plan Premium por <span id='subscripcion_precio_cupon'><span></span>/año</span> <span id='subscripcion_precio'>" + plan_premium_year + "/año</span>";
                    }
                    texts['title'] = "Plan Premium Anual";
                    
                }else if ($(plan).val() === "13") {
                    texts['title'] = "Plan Live Mensual";
                        texts['message'] = "Suscríbete al Plan Live por <span id='subscripcion_precio_cupon'><span></span>/mes</span> <span id='subscripcion_precio'>" + plan_live_month + "/mes</span>";
                } else if ($(plan).val() === "14") {
                    texts['title'] = "Plan Live Anual";
                    texts['message'] = "Suscríbete al Plan Live por <span id='subscripcion_precio_cupon'><span></span>/año</span> <span id='subscripcion_precio'>" + plan_live_year + "/año</span>";
                } else {
                    texts['title'] = "";
                    texts['message'] = "Selecciona algún tipo de Plan";
                }
                if($(plan).val()!=""){
                    plan_stripe_id = $(plan).val();
                }
                $('.buy_pay_subscribe .plan_text').html(texts['title']);
                $('.buy_pay_subscribe .modal-title').html(texts['message']);
            }

            //Dentro del Modal de compra con subscripcion al presionar volver a plan de pagos muestra los planes
            $(".btn-show-plan-options").on("click", function () {
                //Modal Subscribe
                $("#payment_form_subscribe_container").hide();
                $("#plan_options").show();
                //Modal Upadate Subscription
                $("#payment_form_update_subscription_container").hide();
                $("#subscription_update_plan_options").show();
                $("#div_continuar_compra_gratuita").hide();
                $("#div_aplicar_cupon").show();
                $(".message_error, .message_success").show().find('span').text('');
                resetCupon();

            });

            //Dentro del Modal de compra al hacer click en el botón "aplicar" CUPÓN
            $(".apply-cupon").on("click", function () {
                applyCupon();
            });

            //Dentro del Modal de compra al hacer click en el botón "aplicar" Créditos
            $("#apply-saldo").on("click", function () {
                console.log('$("#apply-saldo").on("click"');
                applySaldo();
            });

            if ($("#consulta").length > 0) {

                $("#consulta").validate({
                    submitHandler: function (form) {
                        showIebsBlockContentForElement("#consulta");
                        $.ajax({
                            type: "POST",
                            url: "/contacta/",
                            data: $("#consulta").serialize(),
                            dataType: "json",
                            success: function (data) {
                                if (data.success == true) {
                                    $("#consulta .form-control").each(function () {
                                        $(this).prop('value', '').parent().removeClass("has-success").removeClass("has-error");
                                    });
                                    $('.message-ok').show();
                                    $('.message-error').hide();
                                } else {
                                    $('.message-ok').hide();
                                    $('.message-error').show();
                                }
                                hideIebsBlockContent();
                            }
                        });
                    },
                    errorPlacement: function (error, element) {
                        error.insertBefore(element);
                    },
                    onkeyup: false,
                    onclick: false,
                    rules: {
                        "consulta[consulta_opcion_id]": {
                            required: true
                        },
                        "consulta[nombre]": {
                            required: true
                        },
                        "consulta[apellido]": {
                            required: true
                        },
                        "consulta[tel1]": {
                            required: true
                        },
                        "consulta[email]": {
                            required: true,
                            email: true
                        },
                        "consulta[pais_id]": {
                            required: true
                        },
                        "consulta[termino]": {
                            required: true
                        },
                        "consulta[comentario]": {
                            required: true
                        }
                    },
                    messages: {
                        "consulta[consulta_opcion_id]": {
                            required: "Debe seleccionar el tipo de consulta."
                        },
                        "consulta[nombre]": {
                            required: "Debe ingresar su nombre."
                        },
                        "consulta[apellido]": {
                            required: "Debe ingresar su apellido."
                        },
                        "consulta[tel1]": {
                            required: "Debe ingresar su teléfono."
                        },
                        "consulta[email]": {
                            required: "Debe ingresar su email.",
                            email: "Debe ingresar un email válido"
                        },
                        "consulta[pais_id]": {
                            required: "Debe seleccionar un país."
                        },
                        "consulta[termino]": {
                            required: "El campo \"Términos legales\" es obligatorio.<br/>"
                        },
                        "consulta[comentario]": {
                            required: "Debe ingresar un comentario."
                        }
                    },
                    errorElement: "span",
                    highlight: function (element) {
                        $(element).parent().removeClass("has-success").addClass("has-error");
                        $(element).siblings("label").addClass("hide");
                    },
                    success: function (element) {
                        //$(element).parent().removeClass("has-error").addClass("has-success");
                        $(element).siblings("label").removeClass("hide");
                    }
                });
            }
            ;

            if ($("#consulta_empresa").length > 0) {

                $("#consulta_empresa").validate({
                    submitHandler: function (form) {
                        showIebsBlockContentForElement("#consulta");
                        $.ajax({
                            type: "POST",
                            url: "/landing/empresas/",
                            data: $("#consulta_empresa").serialize(),
                            dataType: "json",
                            success: function (data) {
                                if (data.success == true) {
                                    $("#consulta_empresa .form-control").each(function () {
                                        $(this).prop('value', '').parent().removeClass("has-success").removeClass("has-error");
                                    });
                                    $(".message-ok").show();
                                    $(".errores_form").hide();
                                    window.location.href = data.redirect;
                                } else {
                                    $(".message-ok").hide();
                                    $(".errores_form").find("ol").empty();
                                    console.log(data.message);
                                    $.each(data.message, function (index, value) {
                                        value = value.replace("Nombre", "Persona de contacto");
                                        value = value.replace("Apellido", "Nombre de la empresa");
                                        value = value.replace("Teléfono Principal", "Teléfono");
                                        value = value.replace("E-mail", "Email");
                                        var error_container = $("<li>");
                                        var error = $("<label>")
                                            .addClass("error")
                                            .html(value || "");
                                        error_container.append(error);
                                        $(".errores_form").find("ol").append(error_container);
                                    });
                                    $(".errores_form").show();
                                }
                                hideIebsBlockContent();
                            }
                        });
                    },
                    errorPlacement: function (error, element) {
                        error.insertBefore(element);
                    },
                    onkeyup: false,
                    onclick: false,
                    rules: {
                        "consulta[consulta_opcion_id]": {
                            required: true
                        },
                        "consulta[nombre]": {
                            required: true
                        },
                        "consulta[apellido]": {
                            required: true
                        },
                        "consulta[tel1]": {
                            required: true
                        },
                        "consulta[email]": {
                            required: true,
                            email: true
                        },
                        "consulta[pais_id]": {
                            required: true
                        },
                        "consulta[termino]": {
                            required: true
                        }
                    },
                    messages: {
                        "consulta[consulta_opcion_id]": {
                            required: "Debe seleccionar el tipo de consulta."
                        },
                        "consulta[nombre]": {
                            required: "Debe ingresar su nombre."
                        },
                        "consulta[apellido]": {
                            required: "Debe ingresar su apellido."
                        },
                        "consulta[tel1]": {
                            required: "Debe ingresar su teléfono."
                        },
                        "consulta[email]": {
                            required: "Debe ingresar su email.",
                            email: "Debe ingresar un email válido"
                        },
                        "consulta[pais_id]": {
                            required: "Debe seleccionar un país."
                        },
                        "consulta[termino]": {
                            required: "*El campo \"Términos legales\" es obligatorio.<br/>"
                        }
                    },
                    errorElement: "span",
                    highlight: function (element) {
                        $(element).parent().removeClass("has-success").addClass("has-error");
                        $(element).siblings("label").addClass("hide");
                    },
                    success: function (element) {
                        //$(element).parent().removeClass("has-error").addClass("has-success");
                        $(element).siblings("label").removeClass("hide");
                    }
                });
            }
            ;
            
            if ($("#perfil_data").length > 0) {

                $("#perfil_data").validate({
                    errorPlacement: function (error, element) {
                        error.insertBefore(element);
                    },
                    onkeyup: false,
                    onclick: false,
                    rules: {
                        /* "perfil_data[profile_picture]": {
                         required: true
                         },*/
                        "perfil_data[first_name]": {
                            required: true
                        },
                        "perfil_data[last_name]": {
                            required: true
                        },
                        "perfil_data[pais_id]": {
                            required: true
                        },
                        "perfil_data[ciudad]": {
                            required: true
                        },
                        "perfil_data[sexo]": {
                            required: true
                        },
                        "perfil_data[f_nacimiento][day]": {
                            required: true
                        },
                        "perfil_data[f_nacimiento][month]": {
                            required: true
                        },
                        "perfil_data[f_nacimiento][year]": {
                            required: true
                        }
                    },
                    messages: {
                        /*"perfil_data[profile_picture]": {
                         required: "Debe agregar una imagen."
                         },*/
                        "perfil_data[first_name]": {
                            required: "Debe ingresar su nombre."
                        },
                        "perfil_data[last_name]": {
                            required: "Debe ingresar su apellido."
                        },
                        "perfil_data[pais_id]": {
                            required: "Debe ingresar su país."
                        },
                        "perfil_data[ciudad]": {
                            required: "Debe ingresar su ciudad."
                        },
                        "perfil_data[sexo]": {
                            required: "Debe seleccionar su sexo."
                        },
                        "perfil_data[f_nacimiento][day]": {
                            required: ""
                        },
                        "perfil_data[f_nacimiento][month]": {
                            required: ""
                        },
                        "perfil_data[f_nacimiento][year]": {
                            required: ""
                        }
                    },
                    errorElement: "span",
                    highlight: function (element) {
                        $(element).parent().removeClass("has-success").addClass("has-error");
                        $(element).siblings("label").addClass("hide");
                    },
                    success: function (element) {
                        $(element).siblings("label").removeClass("hide");
                    }
                });

                $("#perfil_data").submit(function (event) {
                    if (!$('#perfil_data').valid()) {
                        event.preventDefault();
                        return false;
                    } else {
                        $("#profile-container").show();
                        $("#edit-profile-container").hide();
                    }
                });

                if ($('#perfil_data .alert-error').length > 0) {
                    $("#profile-container").hide();
                    $("#edit-profile-container").show();
                }


            }

            if(window.location.hash.indexOf('#method_subscribe') !== -1 ) {
                checkLoggedIn(function(response){
                    if(debug_mode) {
                        console.log(response);
                    }
                    clicked_element = 'curso_buy_subscribe';
                    if (response.success === true && response.message == true) {
                        if($('.upgrade-plan').length){
                            window.location.href = $('.upgrade-plan').eq(0).prop('href');
                        }else {
                            buySubscribe();
                        }
                    }else {
                        var modal = 'method_subscribe';
                        $("#ModalLogin").modal();
                    }
                });

            }
            if(window.location.hash.indexOf('#method_pay') !== -1) {
                checkLoggedIn(function(response) {
                    clicked_element = 'curso_buy_pay';
                    if (response.success === true && response.message == true) {
                        if(typeof global_curso_id != 'undefined') {
                            buyPay();
                        }else if(typeof global_playlist_id != 'undefined'){
                            buyPayPlaylist($('.precio-curso').data('precio'));
                        }
                    } else {
                        var modal = 'method_pay';
                        $("#ModalLogin").modal();
                    }
                });
            }

            //Login into accounts
            
            //Login into accounts
            $('#form_login_instant').submit(function (e) {
                e.preventDefault();
                var next = $(this).find("input[name='next']").val();
                $.ajax({
                    url: '/api/login/',
                    dataType: "json",
                    method: 'POST',
                    data: {
                        username: $("#form_login_instant #username").val(),
                        password: $("#form_login_instant #password").val(),
                        plan_semana_gratuita: $("#form_login_instant #plan_semana_gratuita").val()
                    },
                    success: function (response) {
                        if (response.status === true) {
                            var modal = "";
                            if(clicked_element != 'undefined') {
                                switch(clicked_element) {
                                    case 'curso_buy_subscribe':
                                        modal = '#method_subscribe';
                                        break;
                                    case 'curso_buy_pay':
                                        modal = '#method_pay';
                                        break;
                                    case 'buy_subscribe_premium':
                                        modal = '#buy_subscribe_premium';
                                        break;
                                    case 'buy_subscribe_standard':
                                        modal = '#buy_subscribe_standard';
                                        break;
                                    case 'buy_subscribe_live':
                                        modal = '#buy_subscribe_live';
                                        break;
                                    case 'modal_canje_cupon':
                                        modal = '#modal_canje_cupon';
                                        break;
                                }
                            }
                            if(modal) {
                                window.location.hash = modal;
                            }
                            if(next){
                                window.location.href = next;
                            }else{
                                window.location.reload();
                            }
                        } else {
                            $('#form_login_instant .errores_form').show();
                            $('#form_login_instant .errores_form').html(response.message);
                        }
                    },
                    error: function (response) {
                        if(debug_mode) {
                            console.log(response);
                        }
                    }
                });
            });

            //Sigin into accounts
           

            $('.btn-facebook-signup').on('click', function(e){
                e.preventDefault();
                if($('#terminos').is(':checked') !== true)
                {
                    $('#form_signup_instant').find('#terminos').parent().addClass('alert-danger');
                    $('#form_signup_instant').find('.terminos-error-message').html('Debe aceptar los "Términos y condiciones"');
                    $('#form_signup_instant').find('.terminos-error-message').show();
                    return false;
                }
                document.location.href="/facebook-connect/";
            });
            //Sigin into accounts
            $('#form_signup_instant, .form_signup_instant').submit(function (e) {
                e.preventDefault();
                var self = this;
                $(self).find('.errores_form').html('');
                $(self).find('.errores_form').show();
                if(!validateEmail($(self).find('#username').val())){
                    $(self).find('#username').addClass('alert-danger');
                    $(self).find('.errores_form').html('El email no es válido');
                    $(self).find('.errores_form').show();
                    return false;
                }
                if($(self).find('#terminos').is(':checked') !== true)
                {
                    $(self).find('#terminos').parent().addClass('alert-danger');
                    $(self).find('.terminos-error-message').html('Debe aceptar los "Términos y condiciones"');
                    $(self).find('.terminos-error-message').show();
                    return false;
                }
                $.ajax({
                    url: '/api/signup/',
                    dataType: "json",
                    method: 'POST',
                    data: {
                        username: $(self).find("#username").val(),
                        plan_semana_gratuita: $(self).find("#plan_semana_gratuita").val()
                    },
                    success: function (response) {
                        if (response.success === true) {
                            //var url = '/oauth/login/?continue=' + window.location.href;
                            var next = '';
                            if($(self).find('#next').val() != '' && $(self).find('#next').val() != 'undefined' && typeof $(self).find('#next').val() != 'undefined'){
                                next = $(self).find('#next').val();
                            }else{
                                next = window.location.href;
                            }
                            // si viene signup desde la home, lo mandamos a bienvenida, de otro lado no porque debe estar en alguna página específica
                            if(clicked_element=='registro-home' || clicked_element=='registro-home-header'){
                                next = frontend_uri + '/bienvenida/';
                            }
                            var url = frontend_uri + '/complete-data/new-user/?clicked_element=' + clicked_element + '&next=' + next;
                            // window.location.href = '/oauth/login/?continue=' + window.location.href + '&clicked_element=' + clicked_element + '#ModalCompletarDatos';
                            //var url = '/oauth/login/?continue=' + window.location.href + '#' + clicked_element;
                            window.location.href = url;
                            //$("#ModalCompletarDatos").modal();
                        } else {

                            if(response.message=='Ya existe un usuario con ese email.'){
                                if(!$('#ModalLogin #form_login_instant #message-inicio-sesion').length){
                                    $('#ModalLogin #form_login_instant').prepend('<div id="message-inicio-sesion"></div>');
                                }
                                $('#ModalLogin #form_login_instant #message-inicio-sesion').html('<p>Ya existe un usuario registrado con ese email.<br> Inicia sesión o recupera la contraseña.</p>');
                                $('#form_login_instant #username').val($(self).find("#username").val());

                                $('#ModalRegistro').modal('hide');
                                $('#ModalLogin').modal('show');
                            }else{
                                $(self).find('.errores_form').show();
                                $(self).find('.errores_form').html(response.message);
                            }
                        }
                    },
                    error: function (response) {
                        if(debug_mode) {
                            console.log(response);
                        }
                    }
                });
            });

             //Completar datos

            //modal
            if($('#form_completar_datos_instant').length) {

                $("#form_completar_datos_instant").validate({
                    submitHandler: function (form) {
                        showIebsBlockContentForElement("#form_completar_datos_instant");
                        $.ajax({
                            url: '/api/user/complete-data/',
                            dataType: "json",
                            method: 'post',
                            data: {
                                first_name: $("#complete_data_first_name").val(),
                                last_name: $("#complete_data_last_name").val(),
                                password: $("#complete_data_password").val(),
                                password_again: $("#complete_data_password_again").val()
                            },
                            success: function (response) {
                                if (response.success === true) {
                                    hideIebsBlockContent();
                                    var uri = frontend_uri;
                                    if(typeof response.next != 'undefined' && response.next != '') {
                                        uri = next;
                                    }else {
                                        uri = frontend_uri + '/inicio/';
                                    }
                                    var modal = '';
                                    switch(clicked_element) {
                                        case 'curso_buy_subscribe':
                                            modal = '#method_subscribe';
                                            break;
                                        case 'curso_buy_pay':
                                            modal = '#method_pay';
                                            break;
                                    }
                                    window.location.href = uri + modal;
                                } else {
                                    $("#complete_data .errores_form").show();
                                    $("#complete_data .errores_form").html(response.message);
                                }
                            },
                            error: function (response) {
                                if(debug_mode) {
                                    console.log(response);
                                }
                            }
                        });
                    },
                    errorPlacement: function (error, element) {
                        error.insertBefore(element);
                    },
                    onkeyup: false,
                    onclick: false,
                    rules: {
                        "form_completar_datos_instant[first_name]": {
                            required: true
                        },
                        "form_completar_datos_instant[last_name]": {
                            required: true
                        },
                        "form_completar_datos_instant[password]": {
                            required: true,
                            minlength: 6
                        },
                        "form_completar_datos_instant[password_again]": {
                            equalTo: "#form_completar_datos_instant #password"
                        }
                    },
                    messages: {
                        "form_completar_datos_instant[first_name]": {
                            required: "Debe ingresar su nombre"
                        },
                        "form_completar_datos_instant[last_name]": {
                            required: "Debe ingresar su apellido."
                        },
                        "form_completar_datos_instant[password]": {
                            required: "Debe ingresar la contraseña.",
                            minlength: "La contraseña debe contener al menos 6 caracteres"
                        },
                        "form_completar_datos_instant[password_again]": {
                            equalTo: "Las contraseñas deben coincidir."
                        }
                    },
                    errorElement: "span", highlight: function (element) {
                        $(element).parent().removeClass("has-success").addClass("has-error");
                        $(element).siblings("label").addClass("hide");
                    },
                    success: function (element) {
                        //$(element).parent().removeClass("has-error").addClass("has-success");
                        $(element).siblings("label").removeClass("hide");
                    }
                });

            }

            if($('#btn_delete_account').length) {
                $('#user_solicitud_baja_form').submit(function (e) {
                    if (!confirm('¿Está seguro de ELIMINAR tu cuenta?')) {
                        e.preventDefault();
                    }
                });
            }
            
            //página
            if($('#complete_data').length){

                $("#complete_data").validate({

                    submitHandler: function (form) {
                        showIebsBlockContentForElement("#complete_data");
                        $.ajax({
                            url: '/api/user/complete-data/',
                            dataType: "json",
                            method: 'post',
                            data: {
                                first_name: $("#complete_data_first_name").val(),
                                last_name: $("#complete_data_last_name").val(),
                                password: $("#complete_data_password").val(),
                                password_again: $("#complete_data_password_again").val()
                            },
                            success: function (response) {
                                if (response.success === true) {
                                    hideIebsBlockContent();
                                    var uri = frontend_uri;
                                    if(typeof response.next != 'undefined' && response.next != '') {
                                        uri = response.next;
                                    }else {
                                        uri = frontend_uri + '/inicio/';
                                    }
                                    var modal = '';
                                    switch(response.clicked_element) {
                                        case 'curso_buy_subscribe':
                                            modal = '#method_subscribe';
                                            break;
                                        case 'curso_buy_pay':
                                            modal = '#method_pay';
                                            break;
                                        case 'buy_subscribe_premium':
                                            modal = '#buy_subscribe_premium';
                                            break;
                                        case 'buy_subscribe_standard':
                                            modal = '#buy_subscribe_standard';
                                            break;
                                        case 'buy_subscribe_live':
                                            modal = '#buy_subscribe_live';
                                            break;
                                    }
                                    window.location.href = uri + modal;
                                } else {
                                    $("#complete_data .errores_form").show();
                                    $("#complete_data .errores_form").html(response.message);
                                }
                            },
                            error: function (response) {
                                if(debug_mode) {
                                    console.log(response);
                                }
                            }
                        });
                    },
                    errorPlacement: function (error, element) {
                        error.insertBefore(element);
                    },
                    onkeyup: false,
                    onclick: false,
                    rules: {
                        "complete_data[first_name]": {
                            required: true
                        },
                        "complete_data[last_name]": {
                            required: true
                        },
                        "complete_data[password]": {
                            required: true,
                            minlength: 6
                        },
                        "complete_data[password_again]": {
                            equalTo: "#complete_data_password"
                        }
                    },
                    messages: {
                        "complete_data[first_name]": {
                            required: "Debe ingresar su nombre"
                        },
                        "complete_data[last_name]": {
                            required: "Debe ingresar su apellido."
                        },
                        "complete_data[password]": {
                            required: "Debe ingresar la contraseña.",
                            minlength: "La contraseña debe contener al menos 6 caracteres"
                        },
                        "complete_data[password_again]": {
                            equalTo: "Las contraseñas deben coincidir."
                        }
                    },
                    errorElement: "span", highlight: function (element) {
                        $(element).parent().removeClass("has-success").addClass("has-error");
                        $(element).siblings("label").addClass("hide");
                    },
                    success: function (element) {
                        //$(element).parent().removeClass("has-error").addClass("has-success");
                        $(element).siblings("label").removeClass("hide");
                    }
                });
            }

            //Recuperar Contraseña desde accounts
            $('#form_forgot_password_instant').submit(function (e) {
                e.preventDefault();
                if ($("#form_forgot_password_instant #username").val() === "") {
                    $('#ModalRecover .errores_form').show();
                    $('#ModalRecover .errores_form').html('Debe ingresar su email');
                    return false;
                }
                $.ajax({
                    url: '/api/user/forgot-password/',
                    jsonp: "callback",
                    dataType: "jsonp",
                    data: {
                        username: $("#form_forgot_password_instant #username").val(),
                        format: "json"
                    },
                    success: function (response) {
                        if (response.success === true) {
                            $('#ModalRecover').modal('hide');
                            new PNotify({
                                title: 'Restablece tu contraseña',
                                text: 'Se ha enviado un email a tu casilla de correo',
                                type: 'success',
                                styling: 'bootstrap3'
                            });
                        } else {
                            $('#ModalRecover .errores_form').show();
                            $('#ModalRecover .errores_form').html(response.message);
                        }
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            });
            



            if($('#form_aplicar_cupon').length){

                $("#form_aplicar_cupon").validate({

                    submitHandler: function (form) {
                        var form = $("#form_aplicar_cupon");
                        $.ajax({
                            url: '/api/aplicar-cupon/',
                            method: "POST",
                            data: {
                                cupon_codigo: form.find("#cupon_codigo").val()
                            },
                            dataType: 'json',
                            success: function (response) {
                                console.log("CUPON");
                                console.log(response);
                                if (response.status === true) {
                                    form.closest('.modal-body').html("<h3 class='text-green'>El cupón se aplicó correctamente</h3><br><br><a href='javascript:void(0)' id='cerrar_modal_aplicar_cupon'>cerrar</a>");
                                    $('#modal_aplicar_cupon .modal-header').html("");
                                    // window.location.href = frontend_uri + '/inicio/';
                                } else {
                                    form.find(".errores_form").show();
                                    form.find(".errores_form").html(response.message);
                                }
                            },
                            error: function (response) {
                                console.log(response);
                            }
                        });
                    },
                    errorPlacement: function (error, element) {
                        error.insertBefore(element);
                    },
                    onkeyup: false,
                    onclick: false,
                    rules: {
                        "cupon_codigo": {
                            required: true
                        }
                    },
                    messages: {
                        "cupon_codigo": {
                            required: "Debe ingresar un cupón"
                        }
                    },
                    errorElement: "span", highlight: function (element) {
                        $(element).parent().removeClass("has-success").addClass("has-error");
                        $(element).siblings("label").addClass("hide");
                    },
                    success: function (element) {
                        //$(element).parent().removeClass("has-error").addClass("has-success");
                        $(element).siblings("label").removeClass("hide");
                    }
                });
                $(document).on('click', "#cerrar_modal_aplicar_cupon", function(){
                    $("#modal_aplicar_cupon").modal("hide");
                })
            }

            if($('#form_aplicar_cupon_promocion').length){

                $("#form_aplicar_cupon_promocion").validate({

                    submitHandler: function (form) {
                        var form = $("#form_aplicar_cupon_promocion");
                        $.ajax({
                            url: '/api/aplicar-cupon/',
                            method: "POST",
                            data: {
                                cupon_codigo: form.find("#cupon_codigo_promocion").val()
                            },
                            dataType: 'json',
                            success: function (response) {
                                console.log("CUPON");
                                console.log(response);
                                if (response.status === true) {
                                    form.find(".errores_form").show();
                                    form.find(".errores_form").html("<span class='text-green'>El cupón se aplicó correctamente</span>");
                                    window.location.href = frontend_uri + '/mis-compras/';
                                } else {
                                    form.find(".errores_form").show();
                                    form.find(".errores_form").html(response.message);
                                }
                            },
                            error: function (response) {
                                console.log(response);
                            }
                        });
                    },
                    errorPlacement: function (error, element) {
                        error.insertBefore(element);
                    },
                    onkeyup: false,
                    onclick: false,
                    rules: {
                        "cupon_codigo": {
                            required: true
                        }
                    },
                    messages: {
                        "cupon_codigo": {
                            required: "Debe ingresar un cupón"
                        }
                    },
                    errorElement: "span", highlight: function (element) {
                        $(element).parent().removeClass("has-success").addClass("has-error");
                        $(element).siblings("label").addClass("hide");
                    },
                    success: function (element) {
                        $(element).parent().removeClass("has-error").addClass("has-success");
                        $(element).siblings("label").removeClass("hide");
                    }
                });
            }
            
            if ($("#cursos_content").length) {
                if (typeof request_uri !== 'undefined' && typeof count_cursos !== 'undefined') {
                    //var request_uri = 'http://beta-instant.iebschool.com/cursos/';
                    // $(document).on("ready", {request_uri: request_uri}, initGrilla);
                    $('#cursos_content').scrollPagination({
                        nop: 9, // The number of posts per scroll to be loaded
                        offset: 9, // Initial offset, begins at 0 in this case
                        scroll: false,
                        url: request_uri,
                        btnText: "Ver más cursos",
                        btnClass: "btn btn-verde",
                        count_cursos: count_cursos || 9
                    });
                }
            }

            

            


            $('#add-wishlist').click(function (e) {
                if ($('#add-wishlist').find('i').hasClass('fa-heart')) {
                    $('#add-wishlist').find('i').removeClass('fa-heart');
                    $('#add-wishlist').find('i').addClass('fa-heart-o');
                } else {
                    $('#add-wishlist').find('i').removeClass('fa-heart-o');
                    $('#add-wishlist').find('i').addClass('fa-heart');
                }

                $.ajax({
                    url: '/api/add-wishlist/',
                    dataType: "json",
                    data: {
                        curso_id: $('#add-wishlist').attr('data-curso-id'),
                        format: "json"
                    },
                    success: function (response) {
                        if (response === 'add') {
                            new PNotify({
                                title: 'Favoritos',
                                text: 'Curso agregado a favoritos',
                                type: 'success',
                                styling: 'bootstrap3'
                            });
                        } else {
                            new PNotify({
                                title: 'Favoritos',
                                text: 'El curso se ha quitado de tu favoritos',
                                type: 'info',
                                styling: 'bootstrap3'
                            });
                        }
                        console.log(response); // server response
                    },
                    error: function (response) {
                        console.log(response);
                    }
                });
            });

            //Filtro por cursos en curso o completados en mis cursos
            $('#estado_cursos').on("change", function () {
               var estado = $(this).val();
               $('.item_serp_learning').each(function( i, e ) {
                   if(estado) {
                       if($(this).hasClass(estado)){
                            $(this).show();
                       } else {
                           $(this).hide();
                       }
                   } else {
                       $(this).show();
                   }
               });
            });
           
            $('#edit-profile').on("click", function () {
                $("#profile-container").hide();
                $("#edit-profile-container").show();
            });

            $('.subscription-update').on("click", function () {
                // $("#ModalUpdateSubscription").modal();
                $("#payment-form-subscribe").prop('action', '/payment/update/');
                $(".buy_pay_subscribe .modal-title").html('Selecciona algún tipo de Plan');
                $(".buy_pay_subscribe .buy_pay_subscribe").html('');
                $("#payment_form_subscribe_container").find('button[type="submit"]').html('Modificar Suscripción');
                $("#ModalSubscribe .progressbar").hide();
                // $('#suscripcion_tarjeta_credito').hide();
                // $('.logos-tarjeta').hide();
                $('#div_aplicar_saldo').hide();
                buySubscribe();
                var compra_uuid = $(this).data('uuid');
                $('#payment-form-subscribe').append('<input type="hidden" name="uuid" id="uuid" value="' + compra_uuid + '">');
                $('#payment-form-subscribe').append('<input type="hidden" name="action" value="update">');
            });

            if(window.location.hash === '#suscription_update' && $('#subscription-update').length) {
                console.log('update');
                $('#subscription-update').click();
            }

            $('.subscription-update-choose-plan-tipo').on("click", function () {
                $('#payment_form_update_subscription_container').show();
                $('#subscription_update_plan_options').hide();
                var plan_tipo = $(this).data('plan-tipo');
                $('#subscription_update_choose_plan_id').empty();
                $('#subscription_update_choose_plan_id').append('<option value="0">Seleccione el Tipo de Plan</option>');
                if (plan_tipo == 'standard') {
                    $('#subscription_update_choose_plan_id').append('<option value="2">Mensual</option><option value="3">Anual</option>');
                } else {
                    $('#subscription_update_choose_plan_id').append('<option value="4">Mensual</option><option value="5">Anual</option>');
                }
                changeTexts($('#choose_plan_id'));
            });

            //Al cambiar el tipo de Plan (Mensual/Anual) actualizo los textos
            $('#subscription_update_choose_plan_id').on("change", function () {
                changeTexts(this);
            });

            //Cuando el contenido de un capitulo es texto o video distinto a Vimeo seteamos en 100%
            if($('#contenedor_texto').length || $('#contenedor_video_porcentaje_fijo').length && !$('#contenedor_video_porcentaje_fijo').hasClass('vimeo-video')) {

                setProgreso(100);

            }

            //Si el video es de Vimeo seteamo el procentaje visto
            if($('#contenedor_video_porcentaje_fijo').length && $('#contenedor_video_porcentaje_fijo').hasClass('vimeo-video')) {

                var iframe = document.querySelector('iframe');
                var player = new Vimeo.Player(iframe);
                var videoTracker = {};
                videoTracker.progress = [];

                player.on('timeupdate', function (data) {
                    onTimeUpdate(data);
                });

                player.on('ended', function (data) {
                    onEnded(data);
                });

                function onEnded(data)
                {
                    if(debug_mode) {
                        console.log('setProgreso');
                    }
                    setProgreso(100);
                }

                function onTimeUpdate(data)
                {
                    var currentPercent = Math.ceil(data.percent * 100);
                    if (videoTracker.progress.indexOf(currentPercent) != -1) {
                        return;
                    }
                    var timestamp = (new Date()).getTime();
                    timestamp = Math.floor(timestamp / 1000);
                    videoTracker.progress.push(currentPercent);
                    videoTracker.lastUpdate = timestamp;
                    if (videoTracker.lastSent == videoTracker.lastUpdate) {
                        return;
                    }
                    videoTracker.lastSent = videoTracker.lastUpdate;

                    if(debug_mode) {
                        console.log('setProgreso');
                        console.log(videoTracker.progress);
                    }
                    setProgreso(videoTracker.progress);
                }

            }
            
             /****** Estadísticas Profesor *****/
            //Filtro detalle ingresos por fecha http://beta-instant.iebschool.com/detalle-ingresos/
            $('#periodo_detalle_ingresos').on("change", function () {
                var periodo = $(this).val();
                // Apply the search
                var table = $('#datatable_detalle_ingresos').DataTable();
                table.column(3).search(periodo, true, false).draw();
                $("#label_periodo").html($(this).children(':selected').text());
            });
            $("#payment_form_subscribe_container input[name='cupon_codigo']").on("keyup", function(){
                resetCupon();
            });

            $('#facturacion_profesores_descarga').on("click", function () {
                var url = '/admin/facturacion-profesores/descarga/?from=' + facturacionProfesoresStartDate + '&to=' + facturacionProfesoresEndDate;
                window.location.href = url;
            });

            if($('#facturacion_profesores_range').length)
            {
                var last_day = moment().subtract(1, 'months').endOf('month');
                var first_day = moment().subtract(1, 'months').startOf('month');
                facturacionProfesoresStartDate = first_day.format('YYYY-MM-DD');
                facturacionProfesoresEndDate = last_day.format('YYYY-MM-DD');
                $('#facturacion_profesores_start_date').html(facturacionProfesoresStartDate);
                $('#facturacion_profesores_end_date').html(facturacionProfesoresEndDate);

                getFacturacionProfesores(first_day, last_day);

                $('#facturacion_profesores_range').daterangepicker({
                    calender_style: "picker_3",
                    "locale": {
                        "format": "YYYY-DD-MM",
                        "separator": " - ",
                        "applyLabel": "Apply",
                        "cancelLabel": "Cancel",
                        "fromLabel": "From",
                        "toLabel": "To",
                        "customRangeLabel": "Custom",
                        "daysOfWeek": [
                            "Do",
                            "Lu",
                            "Ma",
                            "Mi",
                            "Ju",
                            "Vi",
                            "Sa"
                        ],
                        "monthNames": [
                            "Enero",
                            "Febrero",
                            "Marzo",
                            "Abril",
                            "Mayo",
                            "Junio",
                            "Julio",
                            "Agusto",
                            "Septiembre",
                            "Octubre",
                            "Noviembre",
                            "Diciembre"
                        ],
                        "firstDay": 1
                    }
                }, function (start, end, label) {
                    facturacionProfesoresStartDate = start.format('YYYY-MM-DD');
                    facturacionProfesoresEndDate = end.format('YYYY-MM-DD');
                    $('#facturacion_profesores_start_date').html(facturacionProfesoresStartDate);
                    $('#facturacion_profesores_end_date').html(facturacionProfesoresEndDate);

                    getFacturacionProfesores(start, end);
                });
            }
            /****** Estadísticas Profesor *****/
            
            $('.cursos-home-show-all').on("click", function () {
                var filter = $(this).attr('data-filter');
                var offset = $('#pills-' + filter).find('.item_serp').length;
                $.ajax({
                    type: "POST",
                    url: request_uri,
                    data: {
                        filter: filter,
                        offset: offset
                    },
                    success: function (data) {
                        $('.' + filter).append(data);
                    }
                });
            });

            $('#show_all_tags').on("click", function (e) {
                e.preventDefault();
               $('.secundarios').show();
               return false
            });

            $('#s-tag, #s-precio, #s-duracion').on("change", function (e) {
                var filter = $(this).attr('id');
                var value = $(this).val();
                $.ajax({
                    type: "POST",
                    url: request_uri,
                    data: {
                        filter: filter,
                        value: value
                    },
                    success: function (data) {
                        $('#cursos_content').html(data);
                    }
                });
            })

            $("#payment_form_subscribe_container input[name='cupon_codigo']").on("keyup", function(){
                resetCupon();
            });

        },
        initStripe: function () {
            // if(typeof payment === 'undefined'){
            //     return false;
            // }
            $('[data-numeric]').payment('restrictNumeric');
            $('.cc-number').payment('formatCardNumber');
            $('.cc-exp').payment('formatCardExpiry');
            $('.cc-cvc').payment('formatCardCVC');

            $.fn.toggleInputError = function (erred) {
                this.parent('.form-group').toggleClass('has-error', erred);
                return this;
            };




            /* Stripe Compra Regalo */
           

            $("#step1_back_regala_formacion").click(function(e){
                e.preventDefault();
                $('#ModalRegalo .pasos div').removeClass('active').eq(0).addClass('active');
                $("#step1_regala_formacion").show();
                $("#step2_regala_formacion").hide();
            })

            $("#payment-form-compra-regalo").validate({
                submitHandler: function(form) {
                    $("#payment_gift_confirm").prop("disabled", true).html('VALIDANDO  <img width="16" src="/frontend/assets/img/loading_instant.gif"/>');
                    // $("#payment_gift_confirm");

                    if($("#step2_regala_formacion").is(':visible')){
                        compraRegaloStripe(form, function(result){
                            console.log(result);
                            if(result) {
                                $(form).append($('<input type="hidden" name="stripeToken">').val(result['stripe_token']));
                                $(form).append($('<input type="hidden" name="plan_stripe_id">').val(result['plan_stripe_id']));
                                $.ajax({
                                    type: "POST",
                                    url: "/landing/ajax-process-regala-formacion/",
                                    data: $(form).serialize(),
                                    dataType: "json",
                                    beforeSend: function(){
                                        $('#step1_back_regala_formacion').hide();
                                    },
                                    success: function (data) {
                                        console.log(data);
                                        if (data.status === true) {
                                            window.location.href = data.location;
                                        }else{
                                            $(form).find('.payment-errors').text(data.message);
                                            $(form).find('.validation').hide();
                                            $(form).find('.submit').prop('disabled', false);
                                            $(form).find('.submit').html('Realizar pago');
                                        }
                                    }
                                });
                            }

                        });
                    }

                    $("#step1_regala_formacion").hide();
                    $("#step2_regala_formacion").show();
                    $('#ModalRegalo .pasos div').removeClass('active').eq(1).addClass('active');


                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element);
                },
                onkeyup: false,
                onclick: false,
                rules: {
                    "nombre_de": {
                        required: true
                    },
                    "nombre_ben": {
                        required: true
                    },
                    "email_ben": {
                        required: true,
                        email: true
                    },

                    "choose_plan_id_gift": {
                        required: true
                    },
                    "stripe_email": {
                        required: true,
                        email: true
                    },
                    "cc-number": {
                        required: true
                    },
                    "cc-exp": {
                        required: true
                    },
                    "cvc": {
                        required: true
                    },

                },
                messages: {
                    "nombre_de": {
                        required: "Debes escribir tu nombre"
                    },
                    "nombre_ben": {
                        required: "Debe escribir el nombre del beneficiario"
                    },
                    "email_ben": {
                        required: "Debe ingresar un email.",
                        email: "Debe ingresar un email válido"
                    },
                    "choose_plan_id_gift": {
                        required: "Debe seleccionar un plan"
                    },
                    "stripe_email": {
                        required: "Debes escribir tu email",
                        email: "Debe ingresar un email válido"
                    },
                    "cc-number": {
                        required: "Debe escribir el número de tarjeta"
                    },
                    "cc-exp": {
                        required: "Debe escribir la fecha de la tarjeta"
                    },
                    "cvc": {
                        required: "Debe escribir el cvc de la tarjeta"
                    },
                },
                errorElement: "span",
                highlight: function (element) {
                    $(element).parent().removeClass("has-success").addClass("has-error");
                    // $(element).siblings("label").addClass("hide");
                },
                success: function (element) {
                    //$(element).parent().removeClass("has-error").addClass("has-success");
                    // $(element).siblings("label").removeClass("hide");
                }
            });


            $('.btn-cupon-continuar').click(function (e) {
                e.preventDefault();

                var form = $(this).closest('form');

                $('.validation').removeClass('text-danger text-success');
                $('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success');

                var valid = form.find('#cupon_codigo').val() != '';
                //Si es 1 (Curso) o 6 (Playist) se setea antes
                if (plan_stripe_id == undefined || (plan_stripe_id != "1" && plan_stripe_id != "6")) {
                    if ($('#choose_plan_id').val() == 0) {
                        $('.plan_footer').addClass('has-error');
                        $('.validation').addClass('text-danger');
                        $('.validation').removeClass('text-success');
                        valid = false;
                    }
                    plan_stripe_id = $('#choose_plan_id').val();
                }

                if (valid) {
                    var btn = $(this);
                    btn.prop('disabled', true);
                    btn.html('VALIDANDO <img width="16" src="/frontend/assets/img/loading_instant.gif"/>');


                    $.ajax({
                        url: '/api/suscripcion/create/',
                        method: "POST",
                        data: {
                            cupon_codigo: form.find('#cupon_codigo').val(),
                            curso_id: (typeof global_curso_id !== 'undefined' ? global_curso_id : null),
                            plasylist_id: (typeof global_playlist_id !== 'undefined' ? global_playlist_id : null),
                            plan_stripe_id: plan_stripe_id
                        },
                        success: function (response) {
                            console.log('RESPONSE SUSCRIPCION');
                            console.log(response);
                            console.log('-+---RESPONSE SUSCRIPCION-+--');
                            if (response.status === false || !response.uuid) {
                                form.find('.message_error').show().find('span').text(response.message);
                                form.find('.submit').prop('disabled', false);
                                btn.prop('disabled', false);
                                btn.html('Continuar');
                            } else if(response.uuid){
                                window.location.href = '/payment/gracias/';
                            }
                        }
                    });


                    // Prevent the form from being submitted:
                    return false;
                }
            });





        },
        initModals: function () {
            if($('#ModalCompletarDatos').length){
                if (is_cuenta_completada !== undefined) {
                    if (is_cuenta_completada === false) {
                        $("#ModalCompletarDatos").modal();
                    } else {
                        if (window.location.hash) {
                            var open_modal = false;
                            var hash = window.location.hash;
                            switch(window.location.hash) {
                                case '#curso_buy_subscribe':
                                    open_modal = true;
                                    break;
                                case '#curso_buy_pay':
                                    open_modal = true;
                                    break;
                                case '#buy_subscribe_live':
                                    open_modal = true;
                                    hash = '[data-hash="' + window.location.hash.replace('#', '') + '"]';
                                    break;
                                case '#buy_subscribe_standard':
                                    open_modal = true;
                                    break;
                                case '#buy_subscribe_premium':
                                    open_modal = true;
                                    break;
                            }
                            // console.log(window.location.hash);
                            if(open_modal) {
                                $(hash).click();
                            }
                        }
                    }
                }
            }
            if (logged_in === false) {
                if($('#ModalMesGratis').length){
                    setTimeout(function() {
                        if (!$('.modal').is(':visible')) {
                            $('#ModalMesGratis').modal({
                                backdrop: false
                            });
                        }
                    },30000);
                }
            }
            if($('#modal_tabs').length) {
                if (window.location.hash == '#preguntas') {
                    $('#myCourseTab a:last').tab('show');
                }
                $('#myCourseTab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    $('#modal_tabs').modal('show');
                });
            }

            if($("#modal_aplicar_cupon").length) {

                $("#btn_canje_cupon").click(function(e){
                    e.preventDefault();
                    checkLoggedIn(function (response) {
                        if (response) {
                            if (response.success === true && response.message === true) {
                                $("#modal_aplicar_cupon").modal('show');
                            }else{
                                clicked_element = 'modal_canje_cupon';
                                $("#ModalLogin").modal();
                            }
                        }
                    });
                });

                if(window.location.hash.indexOf('#modal_canje_cupon') !== -1 ) {
                    $("#modal_aplicar_cupon").modal('show');
                }
                if(global_cupon_codigo_suscripcion) {
                    checkLoggedIn(function (response) {
                        if (response) {
                            if (response.success === true && response.message === true) {
                                $("#modal_aplicar_cupon #cupon_codigo").val(global_cupon_codigo_suscripcion);
                                $("#modal_aplicar_cupon").modal('show');
                            }else{
                                $("#ModalLogin").modal();
                            }
                        }
                    });
                }
            }


        },
        titleCameBack: function () {
            $(function () {
                var message = "¡Eh, vuelve!";
                var original;

                $(window).focus(function () {
                    if (original) {
                        document.title = original;
                    }
                }).blur(function () {
                    var title = $('title').text();
                    if (title != message) {
                        original = title;
                    }
                    document.title = message;
                });
            });
        },
        getWistiaStats: function () {
        },
        initRegalaPlan: function (){

            $('#new-user-plan-form').on('submit', function(e){
                e.preventDefault();

                if($('#newuser-email').val()==""){
                    alert('No ha ingresado el email.');
                    return false;
                }

                $.ajax({
                    url: '/api/user/create/',
                    method: "POST",
                    data: {
                        first_name: $("#newuser-nombre").val(),
                        last_name: $("#newuser-apellido").val(),
                        username: $("#newuser-email").val()
                    },
                    success: function (response) {
                        if (response.success === true) {
                            $('#new-user-plan-form .mensajes').removeClass('alert alert-danger');
                            $('#new-user-plan-form .mensajes').addClass('alert alert-success');
                            $('#new-user-plan-form .mensajes').html(response.message);
                        } else {
                            $('#new-user-plan-form .mensajes').removeClass('alert alert-success');
                            $('#new-user-plan-form .mensajes').addClass('alert alert-danger');
                            $('#new-user-plan-form .mensajes').show();
                            $('#new-user-plan-form .mensajes').html(response.message);
                        }
                    }
                });
                return false;
            });


            $('#regala-plan-form').on('submit', function(){

                if($('#regala-email').val()==""){
                    alert('No ha seleccionado un usuario');
                    return false;
                }

                if($('#choose_plan_id').val()==0){
                    alert('No ha seleccionado un plan');
                    return false;
                }
            });

            $('#regala-curso-form').on('submit', function(){

                if($('#regala-email').val()==""){
                    alert('No ha seleccionado un usuario');
                    return false;
                }

                if($('#choose_curso_id').val()==0 && $('#choose_playlist_id').val()==0){
                    alert('No ha seleccionado un curso o playlist');
                    return false;
                }
            });

            if($('#choose_curso_id').length)
            {
                $('#choose_curso_id').on('change', function () {
                    $('#choose_playlist_id').val(0);
                });
            }

            if($('#choose_playlist_id').length)
            {
                $('#choose_playlist_id').on('change', function () {
                    $('#choose_curso_id').val(0);
                });
            }

            //eliminar todos los hash
            // console.log(window.location.hash.indexOf('next'));
            if(window.location.hash.indexOf('#') !== -1 && (window.location.hash.indexOf('next') === -1 || window.location.hash.indexOf('politica-cookies') === -1)) {
                history.replaceState('', document.title, window.location.pathname);
            }
        },
        initCharts: function () {

            if($('#chart_consultas').length) {

                $.ajax({
                    url: '/ajax_get_stats/consultas',
                    method: 'POST',
                    success: function (d) {
                        var data = [];
                        var label = [];
                        $( d ).each(function( i, e ) {
                            data.push(e['COUNT']);
                            label.push(e['MONTH']);
                        });

                        chartData = {
                            labels: label,
                            datasets: [
                                {
                                    label: 'nº de consultas',
                                    data: data,
                                    backgroundColor: chart_colors,
                                    borderColor: chart_colors
                                }
                            ]
                        };
                        loadChart("chart_consultas", "Consultas por Mes");
                    }
                });

            }

            if($('#chart_invitaciones').length) {

                $.ajax({
                    url: '/ajax_get_stats/invitaciones',
                    method: 'POST',
                    success: function (d) {
                        var data = [];
                        var label = [];
                        $( d ).each(function( i, e ) {
                            data.push(e['COUNT']);
                            label.push(e['MONTH']);
                        });

                        chartData = {
                            labels: label,
                            datasets: [
                                {
                                    label: 'nº de invitaciones',
                                    data: data,
                                    backgroundColor: chart_colors,
                                    borderColor: chart_colors
                                }
                            ]
                        };
                        loadChart("chart_invitaciones", "Invitaciones por Mes");
                    }
                });

            }

            if($('#chart_referidos').length) {

                $.ajax({
                    url: '/ajax_get_stats/referidos',
                    method: 'POST',
                    success: function (d) {
                        var data = [];
                        var label = [];
                        $( d ).each(function( i, e ) {
                            data.push(e['COUNT']);
                            label.push(e['MONTH']);
                        });

                        chartData = {
                            labels: label,
                            datasets: [
                                {
                                    label: 'nº de referidos',
                                    data: data,
                                    backgroundColor: chart_colors,
                                    borderColor: chart_colors
                                }
                            ]
                        };
                        loadChart("chart_referidos", "Referidos por Mes");
                    }
                });

            }

            if($('#chart_source_instant').length) {

                $.ajax({
                    url: '/ajax_get_stats/sourceInstant',
                    method: 'POST',
                    success: function (d) {
                        var data = [];
                        var label = [];
                        $( d ).each(function( i, e ) {
                            data.push(e['COUNT']);
                            label.push(e['MONTH']);
                        });

                        chartData = {
                            labels: label,
                            datasets: [
                                {
                                    label: 'nº de registros',
                                    data: data,
                                    backgroundColor: chart_colors,
                                    borderColor: chart_colors
                                }
                            ]
                        };
                        loadChart("chart_source_instant", "Registros por Mes");
                    }
                });

            }

            if($('#chart_source_not_instant').length) {

                $.ajax({
                    url: '/ajax_get_stats/sourceNotInstant',
                    method: 'POST',
                    success: function (d) {
                        var data = [];
                        var label = [];
                        $( d ).each(function( i, e ) {
                            data.push(e['COUNT']);
                            label.push(e['MONTH']);
                        });

                        chartData = {
                            labels: label,
                            datasets: [
                                {
                                    label: 'nº de registros',
                                    data: data,
                                    backgroundColor: chart_colors,
                                    borderColor: chart_colors
                                }
                            ]
                        };
                        loadChart("chart_source_not_instant", "Registros con origen distinto a Akademus");
                    }
                });

            }

            if($('#chart_planes_suscripcion').length) {

                $.ajax({
                    url: '/ajax_get_stats/planes-suscripcion',
                    method: 'POST',
                    success: function (d) {
                        var dataset = [];
                        var label = [];
                        var colors = {"plan_gratuito": "#dbf2f2", "plan_mensual_basico": "#ebe0ff", "plan_mensual_premium": "#ffecd9", "plan_anual_basico": "#e5e5e5", "plan_anual_premium": "#fff5dd"};
                        $.each(d, function( i, e ) {
                            dataset.push({
                                label: i.replace(/_/g, ' '),
                                backgroundColor: colors[i],
                                data: e
                            });
                            // label.push(e['MONTH']);
                        });
                        // console.log(" ## PLANES ##");
                        // console.log(dataset);
                        // console.log(" ## PLANES ##");
                        var ctx = document.getElementById("chart_planes_suscripcion");
                        chartData = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                                datasets: dataset
                            },
                            options: {
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }
                        });

                        // loadBarChart("chart_planes_suscripcion", "Planes Suscripcion");
                    }
                });

            }


        }

    };



}();




$(document).ready(function () {
    Instant.init();
    Instant.initStripe();
    Instant.initModals();
    Instant.titleCameBack();
    Instant.getWistiaStats();
    Instant.initCharts();
    Instant.initRegalaPlan();
    init_DataTables();
    //sfWebDebugToggleMenu();
    socialNetworksReady();
});
