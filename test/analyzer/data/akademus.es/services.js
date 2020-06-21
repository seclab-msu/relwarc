"use strict";

var angularServices = angular.module('angularServices', ["ngResource"])
    .config(function ($httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        //$httpProvider.defaults.headers.get['custom-uuid'] = custom_uuid;
    });

angularServices.factory('CursosCategoria', ['$resource', function ($resource) {
    return $resource('/api/cursos_categoria');
}]);
angularServices.factory('Playlist', ['$resource', function ($resource) {
    return $resource('/api/playlist/:id', {
        id: '@id'
    });
}]);
angularServices.factory('Biblioteca', ['$resource', function ($resource) {
    return $resource('/api/biblioteca/:id', {
        id: '@id'
    });
}]);

angularServices.factory('Cupon', ['$resource', function ($resource) {
    return $resource('/api/cupon/:id', {
        id: '@id'
    });
}]);

angularServices.factory('Curso', ['$resource', function ($resource) {
    return $resource('/api/curso/:id', {
        id: '@id'
    });
}]);

angularServices.factory('Modulo', ['$resource', function ($resource) {
    return $resource('/api/curso/:curso_id/modulo/:id', {
        curso_id: '@curso_id',
        id: '@id'
    });
}]);

angularServices.factory('Capitulo', ['$resource', function ($resource) {
    return $resource('/api/curso/:curso_id/modulo/:modulo_id/capitulo/:id', {
        curso_id: '@curso_id',
        modulo_id: '@modulo_id',
        id: '@id'
    });
}]);

angularServices.factory('Recurso', ['$resource', function ($resource) {
    return $resource('/api/curso/:curso_id/recurso/:id', {
        curso_id: '@curso_id',
        id: '@id'
    });
}]);

angularServices.factory('Nota', ['$resource', function ($resource) {
    return $resource('/api/capitulo/:capitulo_id/nota/:id', {
        capitulo_id: '@capitulo_id',
        id: '@id'
    });
}]);

angularServices.factory('Pregunta', ['$resource', function ($resource) {
    return $resource('/api/capitulo/:capitulo_id/pregunta/:id', {
        capitulo_id: '@capitulo_id',
        id: '@id'
    });
}]);

angularServices.factory('Respuesta', ['$resource', function ($resource) {
    return $resource('/api/pregunta/:pregunta_id/respuesta/:id', {
        pregunta_id: '@pregunta_id',
        id: '@id'
    });
}]);

angularServices.factory('Respuesta', ['$resource', function ($resource) {
    return $resource('/api/pregunta/:pregunta_id/respuesta/:id', {
        pregunta_id: '@pregunta_id',
        id: '@id'
    });
}]);

angularServices.factory('Subcategoria', ['$resource', function ($resource) {
    return $resource('/api/subcategoria/:id', {
        id: '@id'
    });
}]);

angularServices.factory('Categoria', ['$resource', function ($resource) {
    return $resource('/api/categoria/:id', {
        id: '@id'
    });
}]);

angularServices.factory('Nivel', ['$resource', function ($resource) {
    return $resource('/api/nivel/:id', {
        id: '@id'
    });
}]);

angularServices.factory('Formato', ['$resource', function ($resource) {
    return $resource('/api/formato/:id', {
        id: '@id'
    });
}]);
