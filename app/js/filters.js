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
    if (input < 1) {
      input *= 100;
      if (input < 1) return "<1‰";
      return Math.round(input) + "‰";
    }
    return Math.round(input) + "%";
  };
});

trckyrslfFilters.filter('hrs', function() {
  return function(input) {
    return Math.floor(input / 3600);
  };
});

trckyrslfFilters.filter('min', function() {
  return function(input) {
    return Math.floor((input % 3600) / 60);
  };
});

trckyrslfFilters.filter('sec', function() {
  return function(input) {
    return (input % 60);
  };
});
