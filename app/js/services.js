var trckyrslfServices = angular.module('trckyrslfServices', ['ngResource']);

trckyrslfServices.factory('VisitSource', ['$resource', function($resource) {
//    return $resource('https://api.mostusedsites.guerilla-it.net/visits', {}, {
    return $resource('visits.json', {}, {
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


trckyrslfServices.factory('Timings', [function() {
  var quantity = 25;
  var timings = [];

  var mapping;
  var start;
  var _zoom;

  var sort = function(m) {
    mapping = m;
    timings.sort(function(a, b) {
      return b[mapping] - a [mapping];
    });
  };

  var setTimings = function(data, m) {
    timings = data;
    sort(m);
  };

  var getRange = function(zoom) {
    if (zoom != _zoom) {
        start = Math.floor((quantity - timings.length) * zoom / 100 + timings.length - quantity);
        _zoom = zoom;
    }

    return {
      "max": timings[start][mapping],
      "min": timings[start+quantity][mapping]
    };
  };

  return {
    sort: sort,
    set: setTimings,
    getRange: getRange
  };
}]);


trckyrslfServices.factory('Selection', ['Timings', function(timings) {
  var host = null;
  var share = 100;
  var total = 0;
  var global = 0;

  var mapping = 'total';
  var zoom = 100;

  // XXX split into init and setHost
  var update = function(synopses) {
    timings.set([...synopses.data.values()], mapping);

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

  var setHost = function(new_host) {
    host = new_host;
  };

  var setMapping = function(m) {
    mapping = m;
    timings.sort(mapping);
  };

  var getMapping = function() {
    return mapping;
  };

  var getZoom = function() {
    return zoom;
  };

  var setZoom = function(z) {
    zoom = z;
  };

  var getData = function() {
    return {
      host: host,
      share: share,
      time: Math.floor(total / 10)
    };
  };

  return {
    update: update,
    getData: getData,
    getMapping: getMapping,
    getZoom: getZoom,
    setHost: setHost,
    setMapping: setMapping,
    setZoom: setZoom
  };
}]);
