"use strict";

/******* CONTROLADOR DE Biblioteca *******/
angularApp.controller("cuponController", ["$scope", "$http", "Cupon", "notificationService", "$timeout",  function ($scope, $http, Cupon,  notificationService,  $timeout) {
    
    $scope.cupon_id = cupon_id;

    Cupon.get({id: $scope.cupon_id}).$promise.then(function (cupon) {
        console.log(cupon);
        $scope.cupon = cupon;
    });

    /* CLICK GUARDAR */
    $scope.editCupon = function (cupon) {
        Cupon.save(cupon).$promise.then(function (data) {
            notificationService.info('Cupon guardado');
        });
    };

    $scope.deleteCupon = function (cupon) {
        Cupon.delete({id: cupon.id}).$promise.then(function () {
            notificationService.info('Borrado');
            window.location.href = '/admin/cupon/';
        }).catch(function () {
            notificationService.error('No se puede borrar el cupón.');
        });
    };


}]);
