"use strict";

/******* CONTROLADOR DE Biblioteca *******/
angularApp.controller("bibliotecaController", ["$scope", "$http", "Biblioteca", "Subcategoria", "Formato",  "notificationService", "Upload", "$timeout",  function ($scope, $http, Biblioteca, Subcategoria, Formato, notificationService, Upload, $timeout) {
    
    $scope.biblioteca_id = biblioteca_id;
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
    
    Subcategoria.query().$promise.then(function (subcategorias) {
        $scope.subcategorias = subcategorias;
    });

    Formato.query().$promise.then(function (formatos) {
        $scope.formatos = formatos;
    });

    Biblioteca.get({id: $scope.biblioteca_id}).$promise.then(function (biblioteca) {
        console.log(biblioteca)
        $scope.biblioteca = biblioteca;
    });
    
    /* CLICK GUARDAR */
    $scope.editBiblioteca = function (biblioteca) {
        Biblioteca.save(biblioteca).$promise.then(function (data) {
            notificationService.info('Biblioteca guardada');
        });
    };

    $scope.deleteBiblioteca = function (biblioteca) {
        Biblioteca.delete({id: biblioteca.id}).$promise.then(function () {
            notificationService.info('Borrado');
            window.location.href = '/admin/biblioteca/';
        }).catch(function () {
            notificationService.error('No se puede borrar la biblioteca.');
        });
    };

    $scope.uploadFiles = function (file, errFiles) {
        console.log("selected file");
        $scope.my_file = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/biblioteca/' + $scope.biblioteca_id + '/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    notificationService.info('Archivo guardado');
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };

    $scope.uploadFilesImg = function (fileImg, errFilesImg) {
        console.log("selected fileImg");
        $scope.my_file_img = fileImg;
        $scope.errFileImg = errFilesImg && errFilesImg[0];
        if (fileImg) {
            fileImg.upload = Upload.upload({
                url: '/api/biblioteca/' + $scope.biblioteca_id + '/uploadImg',
                data: {file: fileImg}
            });

            fileImg.upload.then(function (response) {
                $timeout(function () {
                    notificationService.info('Imagen guardada');
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                fileImg.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };

}]);
