"use strict";

/******* CONTROLADOR DE EDICIÓN DE CURSO *******/
angularApp.controller("teachingSettingsController", ["$scope", "$http", "Curso", "Subcategoria", "Nivel", "Recurso", "notificationService", "Upload", "$timeout", function ($scope, $http, Curso, Subcategoria, Nivel, Recurso, notificationService, Upload, $timeout) {

    $scope.curso_id = curso_id;
    $scope.filtro = 'video';
    $scope.tag = undefined;

    $scope.addTag = function() {
        console.log('Add');
        console.log($scope.tag);
        $scope.curso.tags.push( { name:  $scope.tag.originalObject.name } );
        console.log($scope.curso.tags);
    };

    $scope.removeTag = function ( idx ) {
        console.log('remove tag');
        $scope.curso.tags.splice( idx, 1 );
        console.log($scope.curso.tags);
    };

    $scope.tinymceOptions = {
        menubar: 'edit insert',
        plugins: 'link image media code lists paste',
        toolbar: 'undo redo | styleselect bold italic strikethrough | alignleft aligncenter alignright | code | numlist bullist outdent indent | link image | removeformat',
        insert_button_items: 'link',
        paste_text_sticky : true,
        convert_urls: false,
        style_formats: [
            {title: 'Titulo', inline: 'span', classes: 'titulo'},
            {title: 'Subtitulo', inline: 'span', classes: 'subtitulo'},
            {title: 'Parrafo', inline: 'span', classes: 'parrafo' }
        ]
    };

    $scope.filterByModalFiltro = function (recurso) {
        return (recurso.filtro === $scope.filtro);
    };

    Subcategoria.query().$promise.then(function (subcategorias) {
        $scope.subcategorias = subcategorias;
    });

    Nivel.query().$promise.then(function (niveles) {
        $scope.niveles = niveles;
    });

    Curso.get({id: $scope.curso_id}).$promise.then(function (curso) {
        //console.log(curso);
        $scope.curso = curso;
    });

    $scope.editCurso = function (curso) {
        if (curso.fecha != undefined){
            if (curso.fecha.hour !== undefined) {
                //curso.fecha.hour(curso.fecha.hour() + 2);
                curso.fecha = curso.fecha.format('YYYY-MM-DD HH:mm:ss');
            }
        }
        Curso.save(curso).$promise.then(function () {
            notificationService.info('Curso actualizado');
        });
    };

    $scope.deleteCurso = function (curso) {
        Curso.delete({id: curso.id}).$promise.then(function () {
            notificationService.info('Borrado');
            window.location.href = '/teaching/mis-cursos/';
        }).catch(function () {
            notificationService.error('No se puede borrar el curso porque está asociado a una o más compras');
        });
    };

    $scope.miBiblioteca = function (filtro) {
        $scope.filtro = filtro;
        Recurso.query({curso_id: $scope.curso_id, filterBy: filtro})
            .$promise.then(function (recursos) {
            $scope.recursos = recursos;
        });
    };

    $scope.selectedRecurso = function (recurso, filtro) {
        if (filtro === 'video') {
            $scope.curso.recurso_video_id = recurso.id;
            console.log(recurso.vimeo_ready);
            if(recurso.wistia_embed=='' && !recurso.vimeo_ready){
                $('#contenedor_video_curso').html('<img src="/frontend/assets/img/procesando_video.jpg"/>');
            }else{

                if(recurso.vimeo_ready){
                    var vimeo_iframe  = '<iframe src="https://player.vimeo.com/video/'+recurso.vimeo_link.split(/[\/ ]+/).pop()+'" width="1166" height="450" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                    $('#contenedor_video_curso').html(vimeo_iframe)
                }else{
                    $('#contenedor_video_curso').html(recurso.wistia_embed);
                }
            }
        }
        $('.bs-example-modal-lg').modal('hide');
    };

    $scope.initFilestack = function () {
        filepicker.setKey("AGqfBPQsvSilFsxytYX1gz");
        filepicker.pickAndStore(
            {},
            {location: "S3"},
            function (Blob) {
                var recurso = new Recurso({
                    curso_id: $scope.curso_id,
                    filestack_url: Blob[0].url,
                    filestack_filename: Blob[0].filename,
                    filestack_mimetype: Blob[0].mimetype,
                    filestack_size: Blob[0].size,
                    recurso_estado_id: 2
                });

                Recurso.save(recurso).$promise.then(function () {
                    Recurso.query({curso_id: $scope.curso_id, filterBy: $scope.filtro})
                        .$promise.then(function (recursos) {
                        $scope.recursos = recursos;
                        notificationService.info('Recurso guardado');
                    });
                });
            }
        );
    };


    $scope.uploadFiles = function (file, errFiles) {
        $scope.my_file = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/curso/' + $scope.curso_id + '/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    notificationService.info('Imagen guardada');
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    };


}]);
