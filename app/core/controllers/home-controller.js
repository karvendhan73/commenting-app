'use strict';
(function() {

var homeController = function ($scope, $rootScope, homeService, $timeout) {
    
    $scope.initialize_ResetValues = function () {
        $scope.comments = {};
        $scope.loader = '';
        $rootScope.globalObj = {
            searchText: '',
            globalCounter: 0,
            isPageLoaded: false,
            caseSensitive: false,
            setMaxCounter: 0
        };
    };

    $scope.loadComments = function() {
        $scope.initialize_ResetValues();
        $scope.loader = true;
        homeService.getComments().then(function(response) {
            if (response.data) {
                $scope.comments = angular.fromJson(response.data);
                $scope.loader = false;
            };
        }, function(error) {});
    };

    $scope.replaceWord = function () {
        var text = $rootScope.globalObj.searchText;
        $timeout(function() {
            if (text == $rootScope.globalObj.searchText) {
                $rootScope.$broadcast('search', null);
            };
        }, 500);
    };

    $scope.$watch('globalObj.caseSensitive', function() {
        $rootScope.$broadcast('search', null);
    });

    $scope.init = function () {
        $scope.initialize_ResetValues();
    };

    $scope.init();

};

homeController.$inject = ["$scope", "$rootScope", "homeService", "$timeout"];

angular.module("myApp").controller("homeController", homeController);

}());