"use strict";

// FILTRO USADO PARA MOSTRA EL WISTIA EMBED EN LA PLANTILLA
angularApp.filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    };
}]);

angularApp.filter('getClassLiked', function() {
    return function (input) {
        // conditional you want to apply
        if (input === true) {
            return 'liked';
        }
        return '';
    };
});

angularApp.filter('getClassChecked', function() {
    return function (input) {
        // conditional you want to apply
        if (input === true) {
            return 'checked';
        }
        return '';
    };
});

angularApp.filter('replaceSpace', function() {
    return function (input) {
        if(typeof input !== undefined) {
            return input.split(' ').join('').replace('&', '');
        }
        return input;
    };
});
