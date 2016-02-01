'use strict';


var trckyrslfControllers = angular.module('trckyrslfControllers', []);

trckyrslfControllers.controller('VisitsController', ['$scope', 'VisitSource', function($scope, source) {
  source.query(function(visits) {
    $scope.visits = visits['visits'];
  });
}]);


trckyrslfControllers.controller(
  'SynopsesController', [
    '$scope', 'Synopses', 'Selection', function($scope, synopses, selection) {

  $scope.synopses = synopses;
  $scope.selection = selection;

  $scope.$watch(function() {
    return synopses.updated();
  }, function() {
    selection.update(Array.from(synopses.data.values()));
  });

  $scope.select = function(host) {
    selection.setHost(host);
    $scope.$apply();
  };
}]);


trckyrslfControllers.controller('SelectionController', ['$scope', 'Selection', function($scope, selection) {
  $scope.menu = true;
  $scope.filter = true;
  $scope.mapping = selection.getMapping();
  $scope.term = selection.getSearch();
  $scope.zoom = {
    value: selection.getZoom(),
    options: {
      id: 'zoom',
      onChange: function(id, zoom) { selection.setZoom(zoom); },
      hideLimitLabels: true,
      floor: 0,
      ceil: 100
    }
  };
  $scope.sliderTimeRange = {
    options: {
      id: 'timerange',
      onChange: function(sliderId, min, max) {
        selection.setTimeRange(min, max);
      },
      floor: 0,
      ceil: 24,
      step: 1
    },
    minValue: 0,
    maxValue: 24
  };

  $scope.$watch(function() {
    return selection.getTimings();
  }, function(timings) {
    $scope.timings = timings;
  }, true);

  $scope.$watch(function() {
    return selection.getHost();
  }, function(host) {
    $scope.host = host;
  }, true);

  $scope.map = function(mapping) {
    selection.setMapping(mapping) ;
  };

  $scope.search = function(term) {
    selection.setSearch(term);
  };
}]);
