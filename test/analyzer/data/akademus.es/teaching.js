"use strict";

// Taken from Reid's answer at http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
(function() {
  if(!Array.prototype.move) {
    Array.prototype.move = function (old_index, new_index) {
        while (old_index < 0) {
            old_index += this.length;
        }
        while (new_index < 0) {
            new_index += this.length;
        }
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this; // for testing purposes
    };
  }
})(this);


/******* CONTROLADOR DE NOTAS Y PREGUNTAS Y RESPUESTAS EN CAPITULOS *******/
/*********** MANEJA LA PARTE DE CONTENIDO DEL CURSO (Modulos, Capitulos, Recursos) ************/
angularApp.controller("teachingController", ["$scope", "$http", "Curso", "Modulo", "Capitulo", "Recurso", "notificationService", function ($scope, $http, Curso, Modulo, Capitulo, Recurso, notificationService) {
    // variable global en la plantilla
    $scope.curso_id = curso_id;
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

    $scope.changeElementText = function(item) {
       if (angular.element(item).hasClass('collapsed')) {
        angular.element(item)[0].innerHTML = '<i class="fa fa-bars"></i> Ocultar subsecciones';
       } else {
         angular.element(item)[0].innerHTML = '<i class="fa fa-bars"></i> Mostrar subsecciones';
       }
     };


    Modulo.query({curso_id: $scope.curso_id})
        .$promise.then(function (modulos) {
        $scope.modulos = modulos;
    });

    $scope.createModuloForm = function () {
        $scope.modulo = new Modulo({curso_id: $scope.curso_id});
    };

    $scope.closeModulo = function () {
        $scope.modulo = false;
    };

    $scope.addModulo = function () {
        $scope.createModuloError = false;
        $scope.errorMessage = "";
        if ($scope.modulo.nombre === "" || $scope.modulo.nombre === undefined) {
            $scope.errorMessage = $scope.errorMessage + "campo nombre obligatorio" + '<br/>';
        }
        if ($scope.errorMessage !== "") {
            return void($scope.createModuloError = true);
        } else {
            $scope.loading = true;
            Modulo.save($scope.modulo).$promise.then(function (modulo) {
                $scope.modulos.push(modulo);
                //para que el formulario no quede refenciado al último agregado y quede en blanco
                $scope.modulo = false;
                notificationService.info('Modulo agregado');
            });
        }
    };

    $scope.editModulo = function (modulo) {
        Modulo.save({id: modulo.id, curso_id: modulo.curso_id, nombre: modulo.nombre, descripcion: modulo.descripcion}).$promise.then(function () {
            modulo.edit = false;
            notificationService.info('Modulo actualizado');
        });
    };

    $scope.deleteModulo = function (modulo) {
        Modulo.delete({id: modulo.id, curso_id: modulo.curso_id}).$promise.then(function () {
            var index = $scope.modulos.indexOf(modulo);
            $scope.modulos.splice(index, 1);
        }).catch(function () {
            notificationService.error('No se puede borrar el módulo');
        });
    };

    $scope.createCapituloForm = function (modulo) {
        $scope.capitulo = new Capitulo({curso_id: $scope.curso_id, modulo_id: modulo.id});
    };

    $scope.createCapituloTextoForm = function (capitulo) {
        capitulo.editTexto = true;
    };

    $scope.closeCapitulo = function () {
        $scope.capitulo = false;
    };

    $scope.addCapitulo = function (capitulo, modulo) {
        $scope.createCapituloError = false;
        $scope.errorMessage = "";
        if (capitulo.nombre === "" || capitulo.nombre === undefined) {
            $scope.errorMessage = $scope.errorMessage + "campo nombre obligatorio" + '<br/>';
        }
        if ($scope.errorMessage !== "") {
            return void($scope.createCapituloError = true);
        } else {
            $scope.loading = true;

            Capitulo.save(capitulo).$promise.then(function (capitulo) {
                angular.forEach($scope.modulos, function (res_modulo) {
                    if (res_modulo.id === modulo.id) {
                        res_modulo.capitulos.push(capitulo);
                    }
                });
                //para que el formulario no quede refenciado al último agregado y quede en blanco
                $scope.capitulo = false;
                notificationService.info('Capitulo agregado');
            });
        }
    };

    $scope.editCapitulo = function (capitulo) {
        Capitulo.save(capitulo).$promise.then(function () {
            notificationService.info('Capitulo guardado');
        });
    };

    $scope.deleteCapitulo = function (capitulo, modulo) {
        Capitulo.delete({modulo_id: modulo.id, curso_id: modulo.curso_id, id: capitulo.id}).$promise.then(function () {
            angular.forEach($scope.modulos, function (res_modulo) {
                if (res_modulo.id === modulo.id) {
                    var index = res_modulo.capitulos.indexOf(capitulo);
                    res_modulo.capitulos.splice(index, 1);
                    notificationService.info('Capitulo eliminado');
                }
            });
        }).catch(function () {
            notificationService.error('No se puede borrar el capítulo');
        });
    };

    $scope.moveUpCapitulo = function (capitulo, modulo, direction) {
        angular.forEach($scope.modulos, function (res_modulo) {
            if (res_modulo.id === modulo.id) {
                var index = res_modulo.capitulos.indexOf(capitulo);
                
                if (index >= 0) {
                    
                    if(direction == 'up'){
                        //Si intento subir la primer subseccion no hago nada
                        if(index == 0){
                            return false;
                        }
                        res_modulo.capitulos.move(index, (index-1));
                    } else {
                        //Si intento bajar la ultima subseccion no hago nada
                        if(index >= res_modulo.capitulos.length - 1){
                            return false;
                        }
                        res_modulo.capitulos.move(index, (index+1));
                    }

                    Modulo.save({id: modulo.id, curso_id: modulo.curso_id, capitulos: res_modulo.capitulos}).$promise.then(function () {
                        modulo.edit = false;
                    });

                    notificationService.info('Capitulo movido');
                }
            }
        });
    };

    $scope.moveUpModulo = function (modulo, direction) {
        var index = $scope.modulos.indexOf(modulo);

        if (index >= 0) {

            if(direction == 'up'){
                //Si intento subir la primer subseccion no hago nada
                if(index == 0){
                    return false;
                }
                $scope.modulos.move(index, (index-1));
            } else {
                //Si intento bajar la ultima subseccion no hago nada
                if(index >= $scope.modulos.length - 1){
                    return false;
                }
                $scope.modulos.move(index, (index+1));
            }

            Curso.save({id: $scope.curso_id, modulos: $scope.modulos}).$promise.then(function () {
                modulo.edit = false;
            });

            notificationService.info('Sección movida');
        }
    };

    $scope.miBiblioteca = function (capitulo, filtro) {
        $scope.modal_capitulo = capitulo;
        $scope.filtro = filtro;
        Recurso.query({curso_id: $scope.curso_id, filterBy: filtro})
            .$promise.then(function (recursos) {
            $scope.recursos = recursos;
        });
    };

    $scope.selectedRecurso = function (recurso, modal_capitulo, filtro) {
        if (filtro === 'video') {
            modal_capitulo.recurso_video_id = recurso.id;
            modal_capitulo.recurso_video = recurso;
            if(recurso.wistia_embed=='' && !recurso.vimeo_ready){
                $('#contenedor_video_cap_' + modal_capitulo.id).html('<img src="/frontend/assets/img/procesando_video.jpg"/>');
            }else{
                if(recurso.vimeo_ready){
                    console.log(recurso.vimeo_link.split(/[\/ ]+/).pop());
                    var vimeo_iframe  = '<iframe src="https://player.vimeo.com/video/'+recurso.vimeo_link.split(/[\/ ]+/).pop()+'" width="400" height="250" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                    $('#contenedor_video_cap_' + modal_capitulo.id).html(vimeo_iframe)
                }else{
                    $('#contenedor_video_cap_' + modal_capitulo.id).html(recurso.wistia_embed);
                }
            }
        } else {
            modal_capitulo.recursos.push(recurso);
        }
        $('.bs-example-modal-lg').modal('hide');
    };

    $scope.vimeoEmbed = function (recurso) {
        if(recurso !== 'undefined' && recurso != null){
            if(recurso.vimeo_ready){
                return '<iframe src="https://player.vimeo.com/video/'+recurso.vimeo_link.split(/[\/ ]+/).pop()+'" width="400" height="250" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
            }
        }
        return '';
    };

    $scope.filterByModalFiltro = function (recurso) {
        return (recurso.filtro === $scope.filtro);
    };

    $scope.capituloSave = function (recurso, modal_capitulo, filtro) {
        if (filtro === 'video') {
            modal_capitulo.recurso_video = recurso;
        } else {
            modal_capitulo.recursos.push(recurso);
        }
    };

    $scope.deleteRecursoCapitulo = function (modulo, capitulo, recurso) {
        var index = capitulo.recursos.indexOf(recurso);
        capitulo.recursos.splice(index, 1);
        Capitulo.save(capitulo).$promise.then(function () {
            notificationService.info('Recurso quitado del capitulo');
        });
    };

    $scope.deleteVideoCapitulo = function (capitulo) {
        capitulo.recurso_video = "";
        capitulo.recurso_video_id = "";
        Capitulo.save(capitulo).$promise.then(function () {
            notificationService.info('Video quitado del capitulo');
        });
    };

    $scope.deleteRecurso = function (recurso) {
        Recurso.delete({id: recurso.id, curso_id: $scope.curso_id}).$promise.then(function () {
            Recurso.query({curso_id: $scope.curso_id, filterBy: $scope.filtro})
                .$promise.then(function (recursos) {
                $scope.recursos = recursos;
            });
        }).catch(function () {
            notificationService.error('No se puede borrar el recurso porque está asociado a uno o más capítulos');
        });
    };

    //Cambia de Modo Lectura a modo Edición
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
}]);
