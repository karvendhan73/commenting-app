'use strict';
(function() {
    var myApp = angular.module('myApp', ['ngRoute', 'ngSanitize']);

    myApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/core/html/home-template.html',
                controller: 'homeController'
            })
        	.otherwise({
			redirectTo: '/'
            });
    });

    myApp.run(function($rootScope, $location, $timeout) {
        $location.path('/');
    });

}());