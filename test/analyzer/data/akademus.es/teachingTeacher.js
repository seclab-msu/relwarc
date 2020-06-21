"use strict";

/******* CONTROLADOR DE EDICIÓN DE CURSO *******/
angularApp.controller("teachingTeacherController", ["$scope", "$http", "Curso", "notificationService", function ($scope, $http, Curso, notificationService) {

    $scope.profesor = {};

    $scope.curso_id = curso_id;

    Curso.get({id: $scope.curso_id}).$promise.then(function (curso) {
        $scope.curso = curso;
        $scope.profesor.originalObject = {
            first_name: $scope.curso.first_name,
            last_name: $scope.curso.last_name,
            info_bio: $scope.curso.profesor_bio,
            profesor_id: $scope.curso.profesor_id,
            web: $scope.curso.profesor_blog,
            linkedin: $scope.curso.profesor_linkedin,
            facebook: $scope.curso.profesor_facebook,
            twitter: $scope.curso.profesor_twitter
        };
    });

    $scope.editCurso = function (curso) {
        curso.profesor.email_address = $scope.profesor.originalObject.email_address;
        curso.profesor.first_name = $scope.profesor.originalObject.first_name;
        curso.profesor.last_name = $scope.profesor.originalObject.last_name;
        Curso.save(curso).$promise.then(function () {
            notificationService.info('Curso actualizado');
        });
    };


}]);
