"use strict";
(function(){
  angular.module("myApp").factory('homeService',['$http', '$q', function($http, $q) {
    var serviceApi = {};
    serviceApi.getComments = function() {
      return $http.get('sample.json');
    };
    return serviceApi;
  }]);
}());