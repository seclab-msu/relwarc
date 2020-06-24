function buscador_mostrar_aeropuertos(
    buscador,
    idioma,
    pais,
    moneda,
    msg_error,
    msg_todos,
    evento
) {
    /*Hacemos que los espacios sean  _ */
    var aux_busqueda = $("#id_input_" + buscador)
        .val()
        .replace(/ /gi, "_");
    if (aux_busqueda.indexOf("(" + msg_todos + ")") > -1) {
        aux_busqueda = aux_busqueda.substr(
            0,
            aux_busqueda.indexOf("(" + msg_todos + ")") - 1
        );
    }
    aux_busqueda = quitaAcentos(aux_busqueda);
    /*OBTENEMOS LOS DATOS DE SKYSCANNER YA EN DIVS*/

    /*$.get( "modulos/skyscanner/obtener_localizaciones.php?buscador="+buscador+"&idioma="+idioma+"&pais="+pais+"&moneda="+moneda+"&busqueda="+aux_busqueda, function( data ) {
    });*/

    $.getJSON(
        "modulos/skyscanner/obtener_localizaciones.php?buscador=" +
            buscador +
            "&idioma=" +
            idioma +
            "&pais=" +
            pais +
            "&moneda=" +
            moneda +
            "&busqueda=" +
            aux_busqueda,
        function (jsonData) {
            var myJson = jsonData;

            $("#id_busqueda_localizaciones_" + buscador).html("");
            var aux_count_item = 0;
            $.each(myJson.Places, function () {
                if (this.PlaceId.length == 7) {
                    /*****AEROPUERTOS MAD-sky******/
                    if (aux_count_item == 0) {
                        $("#id_busqueda_localizaciones_" + buscador).html(
                            $(
                                "#id_busqueda_localizaciones_" + buscador
                            ).html() +
                                '<div class="input_opciones_item_cont" buscador="' +
                                buscador +
                                '" buscar="' +
                                this.PlaceName +
                                " (" +
                                this.PlaceId.substr(0, 3) +
                                ')" iata="' +
                                this.PlaceId +
                                '" nombre="' +
                                this.PlaceName +
                                '" pais="' +
                                this.CountryName +
                                '" item="1" onClick="buscador_resultado_seleccionar(\'' +
                                buscador +
                                "','" +
                                this.PlaceName +
                                " (" +
                                this.PlaceId.substr(0, 3) +
                                ")','" +
                                this.PlaceId +
                                "','" +
                                this.PlaceName +
                                "','" +
                                this.CountryName +
                                "')\">" +
                                this.PlaceName +
                                " (" +
                                this.PlaceId.substr(0, 3) +
                                ")<br><span>" +
                                this.CountryName +
                                "</span></div>"
                        );
                    } else {
                        $("#id_busqueda_localizaciones_" + buscador).html(
                            $(
                                "#id_busqueda_localizaciones_" + buscador
                            ).html() +
                                '<div class="input_opciones_item_cont" buscador="' +
                                buscador +
                                '" buscar="' +
                                this.PlaceName +
                                " (" +
                                this.PlaceId.substr(0, 3) +
                                ')" iata="' +
                                this.PlaceId +
                                '" nombre="' +
                                this.PlaceName +
                                '" pais="' +
                                this.CountryName +
                                '" onClick="buscador_resultado_seleccionar(\'' +
                                buscador +
                                "','" +
                                this.PlaceName +
                                " (" +
                                this.PlaceId.substr(0, 3) +
                                ")','" +
                                this.PlaceId +
                                "','" +
                                this.PlaceName +
                                "','" +
                                this.CountryName +
                                "')\">" +
                                this.PlaceName +
                                " (" +
                                this.PlaceId.substr(0, 3) +
                                ")<br><span>" +
                                this.CountryName +
                                "</span></div>"
                        );
                    }
                    aux_count_item = parseInt(aux_count_item) + 1;
                } else if (this.PlaceId.length == 8) {
                    /***REGIONES TENE-sky****/
                    if (aux_count_item == 0) {
                        $("#id_busqueda_localizaciones_" + buscador).html(
                            $(
                                "#id_busqueda_localizaciones_" + buscador
                            ).html() +
                                '<div class="input_opciones_item_cont" buscador="' +
                                buscador +
                                '" region="si" buscar="' +
                                this.PlaceName +
                                " (" +
                                msg_todos +
                                ')" iata="' +
                                this.PlaceId +
                                '" nombre="' +
                                this.PlaceName +
                                '" pais="' +
                                this.CountryName +
                                '" item="1" onClick="buscador_resultado_seleccionar(\'' +
                                buscador +
                                "','" +
                                this.PlaceName +
                                " (" +
                                msg_todos +
                                ")','" +
                                this.PlaceId +
                                "','" +
                                this.PlaceName +
                                "','" +
                                this.CountryName +
                                "')\">" +
                                this.PlaceName +
                                " (" +
                                msg_todos +
                                ")<br><span>" +
                                this.CountryName +
                                "</span></div>"
                        );
                    } else {
                        $("#id_busqueda_localizaciones_" + buscador).html(
                            $(
                                "#id_busqueda_localizaciones_" + buscador
                            ).html() +
                                '<div class="input_opciones_item_cont" buscador="' +
                                buscador +
                                '"  region="si" buscar="' +
                                this.PlaceName +
                                " (" +
                                msg_todos +
                                ')" iata="' +
                                this.PlaceId +
                                '" nombre="' +
                                this.PlaceName +
                                '" pais="' +
                                this.CountryName +
                                '" onClick="buscador_resultado_seleccionar(\'' +
                                buscador +
                                "','" +
                                this.PlaceName +
                                " (" +
                                msg_todos +
                                ")','" +
                                this.PlaceId +
                                "','" +
                                this.PlaceName +
                                "','" +
                                this.CountryName +
                                "')\">" +
                                this.PlaceName +
                                " (" +
                                msg_todos +
                                ")<br><span>" +
                                this.CountryName +
                                "</span></div>"
                        );
                    }
                    aux_count_item = parseInt(aux_count_item) + 1;
                }
            });

            if (aux_count_item == 0) {
                $("#id_busqueda_localizaciones_" + buscador).html(
                    '<div class="input_opciones_item_cont" buscador="0" buscar="" iata="" style="padding-left:10px; font-weight:normal;" >' +
                        msg_error +
                        "</div>"
                );
            }

            $("#id_buscador_" + buscador)
                .stop(true, false, true)
                .fadeIn(200);
            $("#id_input_" + buscador).css(
                "border-radius",
                "10px 10px 0px 10px"
            );
            $("#id_input_" + buscador).css(
                "-webkit-border-radius",
                "10px 10px 0px 10px"
            );
            $("#id_input_" + buscador).css(
                "-moz-border-radius",
                "10px 10px 0px 10px"
            );
            $("#id_input_icono_cerrar_" + buscador).fadeIn(200);
        }
    );
}

function index_nws(email) {
    /**NEWSLETTER**/
    var aux_error = false;
    var input = new Array();
    input[1] = email; //Email
    input[2] = ""; //Nombre
    input[3] = ""; //Apellidos
    input[4] = ""; //Código postal
    input[5] = ""; //Política privacidad

    aux_campo = 1; //Email
    var patronEmail = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
    var compEmail = patronEmail.test(input[1]);
    if (!compEmail) {
        aux_error = true;
    }

    if (aux_error == false) {
        $(".precarga_contenido").fadeIn(200);

        localStorage.setItem("js_permiso_mysql", "si");
        $.get(
            "modulos/mysql/query.php?accion=rtt_bd_1&input1=" +
                input[1] +
                "&input2=" +
                input[2] +
                "&input3=" +
                input[3] +
                "&input4=" +
                input[4] +
                "&input5=" +
                input[5],
            function (data) {
                var data_respuesta = data.substr(
                    parseInt(data.indexOf("::")) + 2
                ); //Obtener respuesta sin script

                if (data_respuesta == "OK") {
                    //Registro completado

                    /*MOSTRAR ALERT*/
                    $("#usuario_identificarse_capa_negra").hide();
                    usuario_menu_mostrar(1);
                    $(".alert_titulo").hide(); //Resetear alert
                    $(".alert_mensaje").hide(); //Resetear alert
                    $('.buscador_btn[estilo="alert"]').hide(); //Resetear alert

                    $(".alert_mensaje[ok='001']").show(); //CAMBIAR MSG DE ERROR <-------------------------
                    $(".alert_mensaje[ok='002']").show(); //CAMBIAR MSG DE ERROR <-------------------------

                    $("body, html").css("overflow", "hidden");
                    $(".alert_titulo[titulo='002']").show(); //CAMBIAR MSG DE TITULO <-------------------------
                    $(".buscador_btn[boton='002']").show(); //CAMBIAR BOTON DE ACCION <-------------------------
                    $(".alert").show(0);
                    $("#id_analytics_pixel_reg").attr(
                        "src",
                        "modulos/analytics/pixel.php?pixel=reg_registrarse"
                    );
                }
                permiso_registro = true;
                localStorage.setItem("js_permiso_mysql", "no");
                $(".precarga_contenido").fadeOut(200);
            }
        );
    }
}

function validar_contacto() {
    if (permiso_login == true) {
        permiso_login = false;
        var aux_campo = 0; //para el número del input
        var aux_error = false;
        var input = new Array();
        input[1] = ""; //Nombre
        input[2] = ""; //Email
        input[3] = ""; //Mensaje

        $(".buscador_btn[estilo='alert']").hide(); //Resetear alert
        $(".alert_titulo").hide(); //Resetear alert
        $(".alert_mensaje").hide(); //Resetear alert

        aux_campo = 1; //Nombre
        if ($("#id_input_contacto_" + aux_campo).val().length < 3) {
            aux_error = true;
            $("#id_input_contacto_" + aux_campo).attr("error", "true");
            $(".alert_mensaje[error='005']").show(); //CAMBIAR MSG DE ERROR <-------------------------
        } else {
            $("#id_input_contacto_" + aux_campo).attr("error", "false");
            input[aux_campo] = $("#id_input_contacto_" + aux_campo).val();
        }

        aux_campo = 2; //Email
        var patronEmail = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
        var compEmail = patronEmail.test(
            $("#id_input_contacto_" + aux_campo).val()
        );
        if (!compEmail) {
            aux_error = true;
            $("#id_input_contacto_" + aux_campo).attr("error", "true");
            $(".alert_mensaje[error='006']").show(); //CAMBIAR MSG DE ERROR <-------------------------
        } else {
            $("#id_input_contacto_" + aux_campo).attr("error", "false");
            input[aux_campo] = $("#id_input_contacto_" + aux_campo).val();
        }

        aux_campo = 3; //mensaje
        if ($("#id_input_contacto_" + aux_campo).val().length < 10) {
            aux_error = true;
            $("#id_input_contacto_" + aux_campo).attr("error", "true");
            $(".alert_mensaje[error='022']").show(); //CAMBIAR MSG DE ERROR <-------------------------
        } else {
            $("#id_input_contacto_" + aux_campo).attr("error", "false");
            input[aux_campo] = $("#id_input_contacto_" + aux_campo).val();
        }

        if (aux_error) {
            $("#usuario_contacto_capa_negra").hide();
            $("body, html").css("overflow", "hidden");
            $(".alert_titulo[titulo='001']").show(); //CAMBIAR MSG DE TITULO <-------------------------
            $(".buscador_btn[boton='005']").show(); //CAMBIAR BOTON DE ACCION <-------------------------
            $(".alert").show();
            permiso_login = true;
        } else {
            $(".precarga_contenido").fadeIn(200);
            //alert(input[1]+" /// "+input[2]+" /// "+input[3]);
            /*depende de query.php*/
            localStorage.setItem("js_permiso_mysql", "si");
            $.get(
                "modulos/mysql/query.php?accion=rtt_bd_8&input1=" +
                    input[1] +
                    "&input2=" +
                    input[2] +
                    "&input3=" +
                    input[3].replace(/\r?\n/g, "<br>"),
                function (data) {
                    /*MOSTRAR ALERT*/
                    $("#id_form_contacto").hide();
                    $("#id_form_contacto_ok").show();
                    permiso_login = true;
                    localStorage.setItem("js_permiso_mysql", "no");
                    $(".precarga_contenido").fadeOut(200);
                }
            );
        }
    }
}

function validar_baja() {
    var aux_campo = 0; //para el número del input
    var aux_error = false;
    var input = new Array();
    input[1] = ""; //Email

    $(".buscador_btn[estilo='alert']").hide(); //Resetear alert
    $(".alert_titulo").hide(); //Resetear alert
    $(".alert_mensaje").hide(); //Resetear alert

    aux_campo = 1; //Email
    var patronEmail = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
    var compEmail = patronEmail.test($("#id_input_baja_" + aux_campo).val());
    if (!compEmail) {
        aux_error = true;
        $("#id_input_baja_" + aux_campo).attr("error", "true");
        $(".alert_mensaje[error='006']").show(); //CAMBIAR MSG DE ERROR <-------------------------
    } else {
        $("#id_input_baja_" + aux_campo).attr("error", "false");
        input[aux_campo] = $("#id_input_baja_" + aux_campo).val();
    }
    if ($("#g-recaptcha-response").val() == "") {
        aux_error = true;
        $(".g-recaptcha").css("border", "1px solid #bd0000");
        $(".g-recaptcha").css("background-color", "#fef4f4");
        $(".g-recaptcha").css("padding-top", "10px");
        $(".g-recaptcha").css("padding-bottom", "12px");
    } else {
        $(".g-recaptcha").css("border", "none");
        $(".g-recaptcha").css("background-color", "");
        $(".g-recaptcha").css("padding-top", "0px");
        $(".g-recaptcha").css("padding-bottom", "0px");
    }

    if (aux_error) {
        $("body, html").css("overflow", "hidden");
        $(".alert_titulo[titulo='001']").show(); //CAMBIAR MSG DE TITULO <-------------------------
        $(".buscador_btn[boton='001']").show(); //CAMBIAR BOTON DE ACCION <-------------------------
        $(".alert").fadeIn(200);
    } else {
        $(".precarga_contenido").fadeIn(200);
        /*WS + RESPUESTA*/
        $("#id_email_ok").html(input[1]);
        $("#id_email_ko").html(input[1]);
        /*depende de query.php*/
        localStorage.setItem("js_permiso_mysql", "si");
        $.get(
            "modulos/mysql/query.php?accion=rtt_bd_12&input1=" + input[1],
            function (data) {
                var data_respuesta = data.substr(
                    parseInt(data.indexOf("::")) + 2
                ); //Obtener respuesta sin script

                if (data_respuesta == "OK") {
                    $("#id_baja_texto").hide();
                    $("#id_baja_formulario").hide();
                    $("#id_baja_resultado_ok").show();
                } else if (data_respuesta == "KO – NO encontrado") {
                    $("#id_baja_texto").hide();
                    $("#id_baja_formulario").hide();
                    $("#id_baja_resultado_ok").show();
                } else {
                    $("#id_baja_texto").hide();
                    $("#id_baja_formulario").hide();
                    $("#id_baja_resultado_ko").show();
                }

                localStorage.setItem("js_permiso_mysql", "no");
                $(".precarga_contenido").fadeOut(200);
            }
        );
    }
}
