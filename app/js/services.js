var trckyrslfServices = angular.module('trckyrslfServices', ['ngResource']);

trckyrslfServices.factory('Visit', ['$resource',
  function($resource) {
//    return $resource('https://api.mostusedsites.guerilla-it.net/visits', {}, {
    return $resource('visits.json', {}, {
      query: {method:'GET', timeout: 120000}
    });
  }
]);
