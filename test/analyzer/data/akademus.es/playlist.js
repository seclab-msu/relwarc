"use strict";

/******* CONTROLADOR DE PLAYLIST *******/
angularApp.controller("playlistController", ["$scope", "$http", "Playlist", "CursosCategoria", "notificationService", "Categoria", "Upload", "$timeout", function ($scope, $http, Playlist, CursosCategoria, notificationService, Categoria, Upload, $timeout) {

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
    
    Categoria.query().$promise.then(function (categorias) {
        $scope.categorias = categorias;
    });

    /* TRAIGO CURSOS DISPONIBLES ORDENADOS POR CATEGORIA*/
    CursosCategoria.query().$promise.then(function (cursos_categoria) {
        $scope.cursos_categoria = cursos_categoria;

        // variable global en la plantilla
        $scope.playlist_id = playlist_id;
        
        /*  TRAIGO DATOS SI TENGO EL ID */
        if ($scope.playlist_id !== null) {
            Playlist.get({id: $scope.playlist_id})
                .$promise.then(function (playlist) {
                $scope.playlist = playlist;

                angular.forEach($scope.playlist.cursos, function (curso_play, key) {
                    angular.forEach($scope.cursos_categoria, function (categorias, key) {
                        angular.forEach(categorias, function (categoria, key) {
                            angular.forEach(categoria.cursos, function (curso, key) {
                                if((curso.id === curso_play.id)){
                                    curso.checked = true;
                                }
                            });
                        });
                    });
                });

            });
        };
    });

    $scope.$watch('selectCurso', function(selected) {
        if(selected) {
            console.log(selected);
            var curso = selected.originalObject;
            var found = $scope.playlist.cursos.some(function (el) {
                return el.id === curso.id;
            });
            if (!found) {
                console.log('CURSO');
                console.log(curso);
                $scope.playlist.cursos.push(curso);
                // $scope.playlist.cursos[index].checked = true;
            }

            angular.forEach($scope.cursos_categoria, function (categorias, key) {
                angular.forEach(categorias, function (categoria, key) {
                    angular.forEach(categoria.cursos, function (my_curso, key) {
                        if((my_curso.id === curso.id)){
                            my_curso.checked = true;
                        }
                    });
                });
            });

            $scope.$broadcast('angucomplete:clearInput');
            // $scope.searchStr = null;
        }
    });

    $scope.moveCurso = function (curso, direction) {
        var index = $scope.playlist.cursos.indexOf(curso);
        if (index >= 0) {
            if(direction === 'up'){
                //Si intento subir la primer subseccion no hago nada
                if(index === 0){
                    return false;
                }
                $scope.playlist.cursos.move(index, (index - 1));
            } else {
                //Si intento bajar la ultima subseccion no hago nada
                if(index >= ($scope.playlist.cursos.length - 1)){
                    return false;
                }
                $scope.playlist.cursos.move(index, (index + 1));
            }
        }
    };

    /* JUNTO LOS CURSOS QUE VOY CHECKEANDO */
    $scope.selectedCurso = function (curso) {
        var found = $scope.playlist.cursos.some(function (el) {
            return el.id === curso.id;
        });
        if(!found){
            $scope.playlist.cursos.push({'id': curso.id, 'nombre': curso.nombre});
        }else {
            $scope.playlist.cursos.some(function (el, index) {
                if (el.id === curso.id) {
                    $scope.playlist.cursos.splice(index, 1);
                }
            });
        }
    };
    /* CLICK GUARDAR */
    $scope.editPlaylist = function (playlist, action) {
        switch(action){
            case 'borrador':
                playlist.activo = 0;
                break;
            case 'publicar':
                playlist.activo = 1;
                break;
        }
        Playlist.save(playlist).$promise.then(function (data) {
            notificationService.info('Playlist guardada');
        });
    };

    $scope.deletePlaylist = function (playlist) {
        Playlist.delete({id: playlist.id}).$promise.then(function (data) {
            window.location.href = '/admin/playlists/';
        });
    };

    $scope.uploadFiles = function (file, errFiles) {
        console.log("selected file");
        $scope.my_file = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/playlist/' + $scope.playlist_id + '/upload',
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
