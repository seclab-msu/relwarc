"use strict";

angularApp.directive('ngConfirmMessage', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function (e) {
                var message = attrs.ngConfirmMessage || "Está seguro?";
                if (!confirm(message)) {
                    e.stopImmediatePropagation();
                }
            });
        }
    };
}]);

angularApp.directive('tagManager', function() {
    return {
        restrict: 'E',
        scope: { tags: '=' },
        template:
        '<div class="tags">' +
        '<a ng-repeat="(idx, tag) in tags" class="tag btn btn-info" ng-click="remove(idx)">{{tag}} X</a>' +
        '</div>' +
        '<input id="add_tag" type="text" placeholder="Agregar un tag..." ng-model="new_value"></input> ' +
        '<a class="btn btn btn-naranja" ng-click="add()">Agregar</a>',
        link: function ( $scope, $element ) {
            // FIXME: this is lazy and error-prone
            var input = angular.element( $element.children()[1] );

            // This adds the new tag to the tags array
            $scope.add = function() {
                $scope.tags.push( $scope.new_value );
                $scope.new_value = "";
            };

            // This is the ng-click handler to remove an item
            $scope.remove = function ( idx ) {
                $scope.tags.splice( idx, 1 );
            };

            // Capture all keypresses
            input.bind( 'keypress', function ( event ) {
                // But we only care when Enter was pressed
                if ( event.keyCode == 13 ) {
                    // There's probably a better way to handle this...
                    $scope.$apply( $scope.add );
                }
            });
        }
    };
});

angularApp.directive('tinymce', function () {
    var uniqueId = 0;
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: true,
        template: '<textarea></textarea>',
        link: function (scope, element, attrs, ngModel) {
            var id = 'myEditor_' + uniqueId++;
            element.find('textarea').attr('id', id);
            tinymce.init({
                selector: '#' + id,
                height: 500,
                theme: 'modern',
                plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern',
                toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                image_advtab: true,
                language: 'es'
            });

            var editor = tinymce.get(id);
        }
    }
});