'use strict';


var trckyrslfControllers = angular.module('trckyrslfControllers', []);

trckyrslfControllers.controller('VisitsController', ['$scope', 'VisitSource', function($scope, source) {
  source.query(function(visits) {
    $scope.visits = visits['visits'];
  });
}]);


trckyrslfControllers.controller('SynopsesController', ['$scope', 'Synopses', 'Selection', function($scope, synopses, selection) {
  $scope.$watch(function() {
    return synopses.updated();
  }, function(newVal, oldVal) {
    $scope.synopses = Array.from(synopses.data.values());
  });

  $scope.select = function(host) {
    selection.setHost(host);
    selection.update(synopses);
    $scope.$apply();
  };
}]);


trckyrslfControllers.controller('SelectionController', ['$scope', 'Selection', function($scope, selection) {
  $scope.$watch(function() {
    return selection.getData().time;
  }, function(newVal, oldVal) {
    $scope.selection = selection.getData();
  });
}]);
