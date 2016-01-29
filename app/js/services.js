var trckyrslfServices = angular.module('trckyrslfServices', ['ngResource']);

trckyrslfServices.factory('VisitSource', ['$resource', function($resource) {
    return $resource('https://api.mostusedsites.guerilla-it.net/visits', {}, {
//    return $resource('visits.json', {}, {
      query: {method:'GET', timeout: 120000}
    });
  }
]);


trckyrslfServices.factory('Synopses', ['VisitSource', function(source) {
  var synmap = new Map();
  var touched = new Date();

  source.query(function(visits) {

    // merge visit into existing cache data
    var merge = function(visit, synopsis) {
      var Synopsis = function(host) {
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
        var synopsis = new Synopsis(visit.host);
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
      if (!visit.host) continue;
      synmap.set(visit.host, merge(visit, synmap.get(visit.host)));
    }

    // mark changed
    touched = Date.now();
  });

  return {
    data: synmap,
    updated: function() {
      return touched;
    }
  };
}]);

trckyrslfServices.factory('Selection', [function() {
  var synopses = new Array();
  var touched = new Date();

  var share = 100;
  var total = 0;
  var active = 0;
  var inactive = 0;
  var global_total = 0;
  var global_active = 0;
  var global_inactive = 0;

  var host = null;
  var mapping = "total";
  var zoom = 100;
  var search = "";

  var quantity = 25;

  var sort = function(m) {
    synopses.sort(function(a, b) {
      return b[m] - a [m];
    });
  };

  var filter = function(s) {
    if (s.search(search) == -1) return true;
    return false;
  }

  var getSynopses = function() {
    sort(mapping);
    var start = Math.floor(
      (quantity - synopses.length) * zoom / 100 + synopses.length - quantity);

    synopses.map(function(synopsis, i) {
      if (filter(synopsis.host)) {
        synopsis.value = 0;
        if (start + quantity < synopses.length) start++;
      } else {
        synopsis.value = synopsis[mapping];
        if (i < start) synopsis.value = 0;
        if (i > start + quantity) synopsis.value = 0;
      }
      return synopsis;
    });

    return synopses;
  };

  // XXX split into init and setHost
  var update = function(s) {
    synopses = s;

    global_total = 0;
    global_active = 0;
    global_inactive = 0;

    for (var synopsis of synopses) {
      global_total += synopsis.total;
      global_active += synopsis.active;
      global_inactive += synopsis.inactive;

      if (synopsis.host == host) {
        total = synopsis.total;
        active = synopsis.active;
        inactive = synopsis.inactive;
      }
    }
    if (!host) {
      total = global_total;
      active = global_active;
      inactive = global_inactive;
    }

    share = 100 * total / global_total;
  };

  var getHost = function() {
    return host;
  };

  var setHost = function(h) {
    host = h;
    update(synopses);
  };

  var getMapping = function() {
    return mapping;
  };

  var setMapping = function(m) {
    mapping = m;
    touched = Date.now();
  };

  var getSearch = function() {
    return search;
  };

  var setSearch = function(s) {
    search = s;
    touched = Date.now();
  };

  var getZoom = function() {
    return zoom;
  };

  var setZoom = function(z) {
    zoom = z;
    touched = Date.now();
  };

  var getTimings = function() {
    return {
      share: share,
      total: Math.floor(total / 10),
      active: Math.floor(active / 10),
      inactive: Math.floor(inactive / 10)
    };
  };

  return {
    getTimings: getTimings,
    getHost: getHost,
    getMapping: getMapping,
    getSearch: getSearch,
    getSynopses: getSynopses,
    getZoom: getZoom,
    setHost: setHost,
    setMapping: setMapping,
    setSearch: setSearch,
    setZoom: setZoom,
    update: update,
    updated: function() {
      return touched;
    }
  };
}]);
