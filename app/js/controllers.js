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
  $scope.menu = true;
  $scope.mapping = selection.getMapping();
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

  $scope.$watch(function() {
    return selection.getData().time;
  }, function(newVal, oldVal) {
    $scope.selection = selection.getData();
  });

  $scope.map = function(mapping) {
    selection.setMapping(mapping) ;
  };

  $scope.showMenu = function() {
    $scope.menu = true;
  }
}]);
