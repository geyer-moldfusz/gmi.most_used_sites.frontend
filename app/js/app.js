var trckyrslfApp = angular.module('trckyrslfApp', [
  'ngRoute',
  'rzModule',
  'trckyrslfFilters',
  'trckyrslfServices',
  'trckyrslfControllers',
  'trckyrslfDirectives'
]);

trckyrslfApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/visits', {
        templateUrl: 'partials/visits-list.html',
        controller: 'VisitsController'
      }).
      when('/cmpr', {
        templateUrl: 'partials/synopes-list.html',
        controller: 'NoUUIDController'
      }).
      otherwise({
        templateUrl: 'partials/synopes-list.html',
        controller: 'UUIDController'
      });
  }
]);

window.addEventListener('message', function(event) {
  while (!angular.element($("#content")).scope()) {}
  angular.element($("#content")).scope().uuid(event.data);
});
