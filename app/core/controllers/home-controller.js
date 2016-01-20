'use strict';
(function() {

var homeController = function ($scope, $rootScope, homeService, $timeout) {
    $scope.comments = {};
    $scope.loader = '';
    $rootScope.searchText = '';
    $rootScope.globalCounter = 0;
    $rootScope.isPageLoaded = false;
    $rootScope.caseSensitive = false;
    $rootScope.setMaxCounter = 0;

    $scope.loadComments = function() {
        $scope.loader = true;
        $scope.comments = {};
        $rootScope.searchText = '';
        $rootScope.caseSensitive = false;

        homeService.getComments().then(function(response) {
            if (response.data) {
                $scope.comments = angular.fromJson(response.data);
                $scope.loader = false;
            };
        }, function(error) {});

        $scope.replaceWord = function () {
            var text = $rootScope.searchText;
            $timeout(function() {
                if (text == $rootScope.searchText) {
                    $rootScope.$broadcast('search', null);
                };
            }, 500);
        };

        $scope.$watch('caseSensitive', function() {
            $rootScope.$broadcast('search', null);
        });
    };
};

homeController.$inject = ["$scope", "$rootScope", "homeService", "$timeout"];

angular.module("myApp").controller("homeController", homeController);

}());