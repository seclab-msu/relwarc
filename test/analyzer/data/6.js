//$Id$

var benchmarkServices = angular.module("benchmarkServices", [
    "benchmarkControllers",
]); //No I18N

benchmarkServices.factory("benchmarkService", function ($http) {
    //No I18N

    var result = {};

    result.getData = function (vertical, date) {
        var url_value =
            "https://www.site24x7.com/benchmarks/app?vertical=" +
            vertical +
            "&daySeparator=" +
            date; //No I18N
        return $http({
            method: "GET", //No I18N
            url: url_value,
        });
    };

    return result;
});
