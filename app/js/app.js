var trckyrslfApp = angular.module('trckyrslfApp', [
  'ngRoute',
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
      when('/synopses', {
        templateUrl: 'partials/synopes-list.html',
        //controller: 'SynopsesController'
      }).
      otherwise({
        redirectTo: '/visits'
      });
  }
]);
