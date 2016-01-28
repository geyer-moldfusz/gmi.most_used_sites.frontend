'use strict';


var trckyrslfControllers = angular.module('trckyrslfControllers', []);

trckyrslfControllers.controller('VisitsController', ['$scope', 'VisitSource', function($scope, source) {
  source.query(function(visits) {
    $scope.visits = visits['visits'];
  });
}]);


trckyrslfControllers.controller('SynopsesController', ['$scope', 'Synopses', 'Selection', 'Timings', function($scope, synopses, selection, timings) {
  $scope.synopses = synopses;
  $scope.selection = selection;
  $scope.timings = timings;

  $scope.select = function(host) {
    selection.setHost(host);
    selection.update(synopses);
    $scope.$apply();
  };

  $scope.$watch(function() {
    return selection.getMapping();
  }, function(mapping) {
    timings.sort(mapping);
  });

}]);


trckyrslfControllers.controller('SelectionController', ['$scope', 'Selection', function($scope, selection) {
  $scope.mapping = selection.getMapping();
  $scope.zoom = selection.getZoom();

  $scope.$watch(function() {
    return selection.getData().time;
  }, function(newVal, oldVal) {
    $scope.selection = selection.getData();
  });

  $scope.map = function(timing) {
    selection.setMapping(timing) ;
  };

  $scope.zoomOut = function() {
    if ($scope.zoom > 0) $scope.zoom--;
    selection.setZoom($scope.zoom);
  };

  $scope.zoomIn = function() {
    if ($scope.zoom < 100) $scope.zoom++;
    selection.setZoom($scope.zoom);
  };
}]);
