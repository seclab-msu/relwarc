"use strict";

angularApp.controller("learningController", ["$scope", "Nota", "Pregunta", "Respuesta", "notificationService", function ($scope, Nota, Pregunta, Respuesta, notificationService) {
    // variable global en la plantilla
    $scope.capitulo_id = capitulo_id;

    /******* NOTAS *******/

    $scope.nota_loading = false;

    Nota.query({capitulo_id: $scope.capitulo_id})
        .$promise.then(function (notas) {
        $scope.nota = notas[0];
    });

    $scope.updateNota = function (nota) {
        $scope.nota_loading = true;

        Nota.save(nota).$promise.then(function () {
            $scope.nota_loading = false;
            notificationService.info('Nota guardada');
        });
    };

    /******* Preguntas *******/

    $scope.pregunta_loading = false;

    Pregunta.query({capitulo_id: $scope.capitulo_id})
        .$promise.then(function (preguntas) {
        $scope.preguntas = preguntas;
    });

    /* Instancio una pregunta por defecto */
    $scope.pregunta = new Pregunta({capitulo_id: $scope.capitulo_id});

    $scope.addPregunta = function (pregunta) {
        Pregunta.save(pregunta).$promise.then(function (data) {
            notificationService.info('Pregunta guardada');
            $scope.preguntas.push(data);
        });
    };

    $scope.deletePregunta = function (pregunta) {
        Pregunta.delete({id: pregunta.id}).$promise.then(function () {
            var index = $scope.preguntas.indexOf(pregunta);
            $scope.preguntas.splice(index, 1);
        }).catch(function () {
            notificationService.error('No se puede borrar la pregunta');
        });
    };

    /******* Respuestas *******/

    $scope.respuesta = false;
    $scope.createRespuestaForm = function (pregunta) {
        $scope.respuesta = new Respuesta({pregunta_id: pregunta.id});
    };

    $scope.addRespuesta = function () {
        Respuesta.save($scope.respuesta).$promise.then(function (data) {
            notificationService.info('Respuesta guardada');
            $scope.respuesta = false; // para ocultar el formulario

            angular.forEach($scope.preguntas, function (res_pregunta) {
                if (res_pregunta.id === data.pregunta_id) {
                    res_pregunta.respuestas.push(data);
                }
            });
        });
    };

    $scope.deleteRespuesta = function (respuesta) {
        Respuesta.delete({id: respuesta.id}).$promise.then(function () {
            angular.forEach($scope.preguntas, function (res_pregunta) {
                if (res_pregunta.id === respuesta.pregunta_id) {
                    var index = res_pregunta.respuestas.indexOf(respuesta);
                    res_pregunta.respuestas.splice(index, 1);
                }
            });
        }).catch(function () {
            notificationService.error('No se puede borrar la respuesta');
        });
    };

    /******* Votos *******/

    $scope.updatePreguntaVoto = function (pregunta) {
        pregunta.mi_voto = !pregunta.mi_voto;
        Pregunta.save({
            capitulo_id: pregunta.capitulo_id,
            id: pregunta.id,
            mi_voto: pregunta.mi_voto
        }).$promise.then(function (data) {
            pregunta.voto_total = data.voto_total;
        });
    };

    $scope.updateRespuestaVoto = function (respuesta) {
        respuesta.mi_voto = !respuesta.mi_voto;
        Respuesta.save({
            pregunta_id: respuesta.pregunta_id,
            id: respuesta.id,
            mi_voto: respuesta.mi_voto
        }).$promise.then(function (data) {
            respuesta.voto_total = data.voto_total;
        });
    };

    /******* Me Gusta *******/
    $scope.updatePreguntaMeGusta = function (pregunta) {
        pregunta.me_gusta = !pregunta.me_gusta;
        Pregunta.save({
            capitulo_id: pregunta.capitulo_id,
            id: pregunta.id,
            me_gusta: pregunta.me_gusta
        }).$promise.then(function (data) {
            pregunta.me_gusta_total = data.me_gusta_total;
        });
    };

    $scope.updateRespuestaMeGusta = function (respuesta) {
        respuesta.me_gusta = !respuesta.me_gusta;
        Respuesta.save({
            pregunta_id: respuesta.pregunta_id,
            id: respuesta.id,
            me_gusta: respuesta.me_gusta
        }).$promise.then(function (data) {
            respuesta.me_gusta_total = data.me_gusta_total;
        });
    };
}]);
