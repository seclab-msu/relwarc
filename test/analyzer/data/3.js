euroncapApp.controller("twitterController", function ($scope, $http, $timeout) {
    var handleSuccess = function (response) {
        $scope.tweets = response.data;
    };

    var handleError = function (response) {};

    // SETTING NEWSWIRE COLS HEIGHT
    function resizeNewsWire() {
        if ($(window).width() > 480) {
            var newsWireColsArray = [];
            $("#newswire .box").each(function () {
                newsWireColsArray.push($(this).height());
            });

            var highestNewsWireCol = Math.max.apply(null, newsWireColsArray);
            $("#newswire .box").each(function () {
                $(this).css("height", highestNewsWireCol);
            });
        }
    }

    $scope.fireEvent = function () {
        // This will only run after the ng-repeat has rendered its things to the DOM
        $timeout(function () {
            resizeNewsWire();
        }, 0);
    };

    $http
        .get("/Umbraco/EuroNCAP/Widgets/GetTweets/" + 17131)
        .then(handleSuccess, handleError);
});
