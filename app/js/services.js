var trckyrslfServices = angular.module('trckyrslfServices', ['ngResource']);

trckyrslfServices.factory('Cache', ['$cacheFactory', function($cacheFactory) {
  return $cacheFactory('synopses-cache');
}]);


trckyrslfServices.factory('VisitSource', ['$resource', function($resource) {
    return $resource('https://api.mostusedsites.guerilla-it.net/visits', {}, {
//    return $resource('visits.json', {}, {
      query: {method:'GET', timeout: 120000}
    });
  }
]);


trckyrslfServices.factory('Synopses', ['VisitSource', 'Selection', function(source, selection) {
  var synopses = new Map();
  var touched = new Date();

  source.query(function(visits) {

    // merge visit into existing cache data
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

    // add visits to cache
    for (var visit of visits['visits']) {
      if (synopses.has(visit.host)) {
        synopses.set(visit.host, merge(visit, synopses.get(visit.host)));
      } else {
        synopses.set(visit.host, merge(visit));
      }
    }

    // mark changed
    selection.update({data: synopses});
    touched = Date.now();
  });

  return {
    data: synopses,
    updated: function() {
      return touched;
    }
  };
}]);



trckyrslfServices.factory('Selection', [function() {
  var host = null;
  var share = 100;
  var total = 0;
  var global = 0;

  var update = function(synopses) {
    global = 0;
    for (var synopsis of synopses.data.values()) {
      global += synopsis.total;
    }
    if (host) {
      total = synopses.data.get(host).total;
    } else {
      total = global;
    }
    share = 100 * total / global;
  };

  return {
    getData: function() {
      return {
        host: host,
        share: share,
        time: total
      };
    },
    update: function(synopses) {
        update(synopses);
    },
    setHost: function(new_host) {
      host = new_host;
    }
  };
}]);
