var trckyrslfFilters = angular.module('trckyrslfFilters', []);

trckyrslfFilters.filter('host', function() {
  return function(input) {
    if (input) {
      return input;
    } else {
      return "Nothing selected";
    }
  };
});

trckyrslfFilters.filter('perc', function() {
  return function(input) {
    return input + "%";
  };
});

trckyrslfFilters.filter('hrs', function() {
  return function(input) {
    return (input / 3600);
  };
});

trckyrslfFilters.filter('min', function() {
  return function(input) {
    return ((input % 3600) / 60);
  };
});

trckyrslfFilters.filter('sec', function() {
  return function(input) {
    return (input % 60);
  };
});
