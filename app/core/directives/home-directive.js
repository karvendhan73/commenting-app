(function () {
  "use strict";
  angular.module("myApp").directive("homepageDir", [ function () {
      return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: "app/core/html/home-template.html"
      }
    }
  ])

  .directive('collection', function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            collection: '=',
            counter: '='
        },
        template: "<ul class='add-border'><span ng-if='collection.length' class='label-dec'>{{setLabel}}</span><member ng-repeat='member in collection' member='member' counter=counter></member></ul>",
        link: function (scope) {
          if (!scope.counter) {
              scope.setLabel = 'Parents';
          } else {
              scope.setLabel = 'Children - level ' + scope.counter;
          };
        }
    };
  })

  .directive('member', function ($compile, $rootScope, $filter, $timeout, $interval) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            member: '=',
            counter: '='
        },
        link: function (scope, element, attrs) {
            scope.deepCopy = angular.copy(scope.member.text);
            scope.isChildOpened = false;
            scope.isChildClosed = false;
            var commentedDate = $filter('date')(scope.member.date, 'M/d/yyyy/H/m/s').split('/');

            if (angular.isArray(scope.member.children)) {
                scope.leveln = false;
                scope.counter ++;
                element.append("<span class='userLabel'>Commented By: {{member.user.lastName}}, {{member.user.firstName}}</span><span>{{name}}...</span><li ng-click='leveln = !leveln' class='highlight' ng-class=\"{'hover': member.children.length}\" ng-bind-html='member.text'></li><collection collection='member.children' ng-show='leveln' counter=counter class='animate-show'></collection>"); 
                $compile(element.contents())(scope)
            };

            $interval(function() {
              scope.setCommentString();
             }, 60000);

            scope.$on('search', function(e, fromWatchFn) {

              if (scope.counter == 1 || $rootScope.globalObj.setMaxCounter == scope.counter || (fromWatchFn && scope.counter == $rootScope.globalObj.globalCounter - 1)) {
                $rootScope.globalObj.setMaxCounter = 0;
              };

              if (scope.isChildClosed && !$rootScope.globalObj.setMaxCounter) {
                $rootScope.globalObj.setMaxCounter = scope.counter;
              };

              if (fromWatchFn !== null && scope.counter == $rootScope.globalObj.globalCounter) {
                if (fromWatchFn) {
                  scope.isChildOpened = true;
                  scope.replaceText();
                } else {
                  scope.isChildOpened = false;
                };
              };

              if (fromWatchFn && scope.isChildOpened && (scope.counter > $rootScope.globalObj.globalCounter) && (!$rootScope.globalObj.setMaxCounter || scope.counter <= $rootScope.globalObj.setMaxCounter)) {
                scope.replaceText();
              };

              if (fromWatchFn == null && (scope.counter == 1 || scope.isChildOpened && (!$rootScope.globalObj.setMaxCounter || scope.counter <= $rootScope.globalObj.setMaxCounter))) {
                scope.replaceText();
              };
              
            });

            scope.$watch('leveln', function() {
              $rootScope.globalObj.globalCounter = scope.counter + 1;
              if (scope.leveln) {
                scope.isChildClosed = false;
                $rootScope.globalObj.isPageLoaded = true;
                $timeout(function() {
                  scope.$broadcast('search', true);
                }, 10);
              } else if ($rootScope.globalObj.isPageLoaded) {
                scope.isChildClosed = true;
                scope.$broadcast('search', false);
              };
            });

            scope.replaceText = function () {
              scope.member.text = scope.deepCopy;
              //console.log(scope.member.text);
              if ($rootScope.globalObj.searchText) {
                if ($rootScope.globalObj.caseSensitive) {
                  scope.match = new RegExp('(' + $rootScope.globalObj.searchText + ')', "g");
                } else {
                  scope.match = new RegExp('(' + $rootScope.globalObj.searchText + ')', "ig");
                };
                scope.member.text = scope.member.text.replace(scope.match, "<span class='highlight-text'>$1</span>");
              };
            };

            scope.setCommentString = function () {
              var month = Number(commentedDate[0]);
              var day = Number(commentedDate[1]);
              var year = Number(commentedDate[2]);
              var hour = Number(commentedDate[3]);
              var min = Number(commentedDate[4]);

              var currentTime = $filter('date')(new Date(), 'M/d/yyyy/H/m/s').split('/');
              var cmonth = Number(currentTime[0]);
              var cday = Number(currentTime[1]);
              var cyear = Number(currentTime[2]);
              var chour = Number(currentTime[3]);
              var cmin = Number(currentTime[4]);

                if (year < cyear) {
                  if (year == (cyear - 1)) {
                      scope.name = 'An year ago';                
                  } else {
                      scope.name = (cyear - year) + ' years ago';                
                  };
                } else if (month < cmonth) {
                  if (month == (cmonth - 1)) {
                      scope.name = 'A month ago';                
                  } else {
                      scope.name = (cmonth - month) + ' months ago';                
                  };
                } else if (day < cday) {
                  if (day == (cday - 1)) {
                      scope.name = 'A day ago';                
                  } else {
                      scope.name = (cday - day) + ' days ago';                
                  };
                } else if (hour < chour) {
                  if (hour == (chour - 1)) {
                      scope.name = 'An hour ago';                
                  } else {
                      scope.name = (chour - hour) + ' hours ago';                
                  };
                } else if (min < cmin) {
                  if (min == (cmin - 1)) {
                      scope.name = 'A minute ago';                
                  } else {
                      scope.name = (cmin - min) + ' minutes ago';                
                  };
                } else {
                  scope.name = 'A few seconds ago';
                }; 
                scope.$apply();
            };
            scope.setCommentString();
        }
    }
  });

}());