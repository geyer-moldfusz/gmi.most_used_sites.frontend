'use strict';


var trckyrslfControllers = angular.module('trckyrslfControllers', []);

trckyrslfControllers.controller('VisitsController', ['$scope', 'Visit', function($scope, Visit) {
  Visit.query(function(visits) {
    $scope.visits = visits['visits'];
  });
}]);


trckyrslfControllers.controller('SynopsesController', ['$scope', 'Visit', function($scope, Visit) {
  Visit.query(function(visits) {
    var merge = function(visit, synopsis) {
      function Synopsis(host) {
        this.host = host;
        this.active = 0;
        this.inactive = 0;
        Object.defineProperty(this, 'total', {
          get: function() {
            return this.active + this.inactive;
          }
        });
      }

      if (!synopsis) {
        synopsis = new Synopsis(visit.host);
      }
      if (visit.active) {
        synopsis.active += visit.duration;
      } else {
        synopsis.inactive += visit.duration;
      }
      return synopsis;
    }

    var synopses = new Map();
    for (var visit of visits['visits']) {
      if (synopses.has(visit.host)) {
        synopses.set(visit.host, merge(visit, synopses.get(visit.host)));
      } else {
        synopses.set(visit.host, merge(visit));
      }
    }
    $scope.synopses = Array.from(synopses.values());
  });

  $scope.menu = false;

  $scope.toggleMenu = function() {
    $scope.menu ? $scope.menu = false : $scope.menu = true;
  };

}]);
