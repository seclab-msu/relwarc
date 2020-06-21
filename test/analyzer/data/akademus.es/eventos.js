var tipo = "all";
var fecha_inicio = moment().format('YYYY-MM-DD');
//var fecha_fin = moment().add(7, 'days').format('YYYY-MM-DD');
var fecha_fin = moment().add(1, 'y').format('YYYY-MM-DD');
function initDataTable()
{
    if ($("#tbl_lives").length) {

        $('#tbl_lives').DataTable({
            language: {
                processing: "Procesando...",
                lengthMenu: "Mostrar _MENU_ eventos",
                zeroRecords: "No se econtraron eventos",
                emptyTable: "No se econtraron eventos",
                info: "Evento _START_ al _END_ de _TOTAL_",
                infoEmpty: "<a href='javascript:remove_filter_fecha()' class='remove_filtro_fecha'>Elimina el filtro de fecha</a>",
                infoFiltered: "(filtrado de un total de _MAX_ eventos)",
                infoPostFix: "",
                search: "Buscar:",
                url: "",
                infoThousands: ".",
                loadingRecords: "Cargando...",
                paginate: {
                    first: "<<",
                    last: ">>",
                    next: ">",
                    previous: "<"
                }
            },
            pageLength: 5,
            searching: false,
            bSort: false,
            //order: [[ 2, "asc" ]],
            bLengthChange: false,
            ordering: false,
            //info: false,
            "ajax": "/ajax-eventos/?tipo[]=" + tipo + "&fecha_inicio=" + fecha_inicio + "&fecha_fin=" + fecha_fin+"",
            columns: [{
                "title": "Próximos eventos:",
                "render": function (data, type, full, meta) {
                    // return '<a href="' + full[1] + '" class="bloque_evento_general ' + full[4] + '"><p class="tag_bloque_evento">' + full[3] + '</p><span class="fecha_evento_agenda">' + full[2] + '</span><h5 class="titulo_evento_agenda">' + full[0] + '</h5><input type="hidden" class="fecha_sin_formatear" value="' + full[5] + '"><input type="hidden" class="tipo_evento" value="' + full[3] + '"></a>';
                    /*return '<div class="bloque_evento_general bloque_evento_seminario">\n' +
                        '        <div class="col-md-9 left_button">\n' +
                        '            <p class="tag_bloque_evento">' + full[3] + '</p>\n' +
                        '            <div class="clear"></div>\n' +
                        '            <span class="fecha_evento_agenda"><i class="fa fa-calendar-o"></i> <b>Fecha:</b> ' + full[2] + '</span>\n' +
                        '            <span class="hora_evento_agenda"><i class="fa fa-clock-o"></i> <b>Hora de inicio:</b> ' + full[6] + '</span>\n' +
                        '            <span class="profe_evento_agenda"><i class="fa fa-user"></i> <b>Profesor:</b> ' + full[7] + '</span>\n' +
                        '            <div class="clear"></div>\n' +
                        '            <h5 class="titulo_evento_agenda">' + full[0] + '</h5>\n' +
                        '        </div>\n' +
                        '\n' +
                        '        <div class="col-md-3">\n' +
                        '            <a class="btn btn-naranja" href="' + full[1] + '" class="bloque_evento_general bloque_evento_webinar">Apúntate</a>\n' +
                        '        </div>\n' +
                        '\n' +
                        '    </div>';*/

                        return '<div class="bloque_evento_general bloque_evento_seminario" itemscope itemtype="http://schema.org/EducationEvent">\n' +
                        '        <div class="col-md-9 left_button">\n' +
                        '            <p class="tag_bloque_evento">' + full[3] + '</p>\n' +
                        '            <div class="clear"></div>\n' +
                        '            <span class="fecha_evento_agenda" itemprop="startDate"><i class="fa fa-calendar-o"></i> <b>Fecha:</b> ' + full[2] + '</span>\n' +
                        '            <span class="hora_evento_agenda"><i class="fa fa-clock-o"></i> <b>Hora de inicio:</b> ' + full[6] + '</span>\n' +
                        '            <span class="profe_evento_agenda" itemprop="performer"><i class="fa fa-user"></i> <b>Profesor:</b> ' + full[7] + '</span>\n' +
                        '            <div class="clear"></div>\n' +
                        '            <h5 itemprop="name" class="titulo_evento_agenda">' + full[0] + '</h5>\n' +
                        ' <div itemprop="location" itemscope itemtype="http://schema.org/Place" style="display:none"><span itemprop="name">Online</span><span itemprop="address">España</span></div>\n' +
                        ' <div itemscope itemtype="http://schema.org/EducationalOrganization" style="display:none"><span itemprop="name">IEBS Business School</span></div>\n' +
                        ' <div style="display:none" itemprop="startDate">' + full[5] + '</div>\n' +
                        '        </div>\n' +
                        '\n' +
                        '        <div class="col-md-3">\n' +
                        '            <a class="btn btn-naranja" href="' + full[1] + '" class="bloque_evento_general bloque_evento_webinar" itemprop="url">Apúntate</a>\n' +
                        '        </div>\n' +
                        '\n' +
                        '    </div>';
                }
            }],
            "sDom": '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>'
        });
    }
}

function SortByTipo(object, proximos){
    var container = {};
    var webinar = [];
    var curso = [];
    var seminario = [];
    var mooc = [];
    $.each(object, function( key, item ) {
        $.each(item, function( k, attribute ) {
            switch(attribute[3]) {
                case 'CURSO':
                    if (curso.length >= 5 && typeof proximos !== 'undefined')
                    {
                        break;
                    }
                    curso.push(attribute);
                    break;
                case 'SEMINARIO':
                    if(seminario.length>=5 && typeof proximos !== 'undefined')
                    {
                        break;
                    }
                    seminario.push(attribute);
                    break;
                case 'MOOC':
                    if(mooc.length>=5 && typeof proximos !== 'undefined')
                    {
                        break;
                    }
                    mooc.push(attribute);
                    break;
                case 'WEBINAR':
                    if(webinar.length>=5 && typeof proximos !== 'undefined')
                    {
                        break;
                    }
                    webinar.push(attribute);
                    break;
            }
        });
    });
    container.curso = curso;
    container.seminario = seminario;
    container.mooc = mooc;
    container.webinar = webinar;
    return container;
}

function recalAjax(){
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        //url: "/ajax-eventos/?subtipo=" + subtipo + "&fecha_inicio=" + fecha_inicio + "&fecha_fin=" + fecha_fin,
        url: "/ajax-eventos/?proximos=5",
        data: query_programas,
        success: function (data) {
            sorted_by_tipo = SortByTipo(data, true);
            this.template = _.template($('#list_cursos_template').html());
            $('#list_cursos').html(this.template(sorted_by_tipo));
        }
    });
}



function filterBySubtipo(selectedElement) {
    //var subtipo = $('#filtro_subtipo :checked').val();
    var arr_subtipo = [];
    //Deschequeo todos en caso qu haya filtrado por un subtipo
    if($('#filtro_subtipo :checked').length > 1 && selectedElement.val() !== 'all')
    {
        $('#all_subtipos').attr('checked', false);
    }
    //Deschequeo los subtipos seleccionados en caso qu haya filtrado por todos
    if(selectedElement.val() === 'all'){
        $('#filtro_subtipo :checked').each(function() {
            if($(this).attr('id') !== 'all_subtipos')
                $(this).attr('checked', false);
        });
    }
    $('#filtro_subtipo :checked').each(function() {
        var aux_subtipo = "";
        switch ($(this).val()) {
            case "curso":
                aux_subtipo = "itinerario";
                break;
            case "webinar":
                aux_subtipo = "webinar";
                break;
            case "sesion":
                aux_subtipo = "sesion";
                break;
            case "seminario":
                aux_subtipo = "seminario";
                break;
            case "mooc":
                aux_subtipo = "mooc";
                break;
            default:
                aux_subtipo = "all";
        }
        arr_subtipo.push(aux_subtipo);
    });
    tipo = arr_subtipo.join('&tipo[]=');
    console.log(tipo);
}

function filterByDate(start_date, end_date) {
    var filtro = $('#filtro_fecha :checked').val();

    if(filtro != 'range'){
        $("#range_calendar").hide();
    }

    switch(filtro) {

        //Filtros de fecha
        case "this_week":
            fecha_inicio = moment().format('YYYY-MM-DD');
            fecha_fin = moment().add(7, 'days').startOf('week').format('YYYY-MM-DD');
            break;
        case "next_week":
            fecha_inicio = moment().add(7, 'days').startOf('week').format('YYYY-MM-DD');
            fecha_fin = moment().add(7, 'days').endOf('week').format('YYYY-MM-DD');
            break;
        case "this_month":
            fecha_inicio = moment().format('YYYY-MM-DD');
            fecha_fin = moment().endOf('month').format('YYYY-MM-DD');
            break;
        case "range":
            fecha_inicio = start_date;
            fecha_fin = end_date;
            break;
        case "remove":
            fecha_inicio = moment().format('YYYY-MM-DD');
            fecha_fin = moment().add(1, 'y').format('YYYY-MM-DD');
            break;
        default:
            fecha_inicio = moment().format('YYYY-MM-DD');
            fecha_fin = moment().add(7, 'days').format('YYYY-MM-DD');
    }

}

function remove_filter_fecha(){
    $('#remove_filter_fecha').prop('checked', true);
    filterByDate();
    $('#tbl_lives').dataTable().fnDestroy();
    //Inicializo el data table
    initDataTable();

}

function cb(start, end) {
    $('#reportrange').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
}

$(document).ready(function() {

    initDataTable();
    var start = moment();
    var end = moment().add(7, 'days');
    $('#datetimepicker1').daterangepicker({
        "locale": {
            "format": "YYYY-MM-DD",
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "Desde",
            "toLabel": "Hasta",
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
        },
        startDate: start,
        endDate: end
    }, function(start, end, label) {
        filterByDate(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        $('#tbl_lives').dataTable().fnDestroy();
        //Inicializo el data table
        initDataTable();
        cb(start, end);
    });

    $("#range_calendar_toggle").on('click', function () {
        $("#range_calendar").show();
    });
    
    if($('#list_cursos_template').length)
    {
        recalAjax();
    }
    
});

$('#filtro_fecha input').on('change', function () {
    if($(this).val() != 'range') {
        filterByDate();
        $('#tbl_lives').dataTable().fnDestroy();
        //Inicializo el data table
        initDataTable();
    }
});

$('#filtro_subtipo input').on('change', function () {
    filterBySubtipo($(this));
    $('#tbl_lives').dataTable().fnDestroy();
    //Inicializo el data table
    initDataTable();
});