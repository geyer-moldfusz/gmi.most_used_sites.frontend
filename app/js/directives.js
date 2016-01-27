'use strict';

var trckyrslfDirectives =  angular.module('trckyrslfDirectives', []);

trckyrslfDirectives.directive('d3Treemap', function($window) {
  return {
    restrict: 'EA',
    controller: 'SynopsesController',
    scope: {},
    link: function(scope, element, attrs) {
      angular.element($window).bind('resize', function() {
        scope.$apply();
      });

      var quantity = 25;
      var start = 0;

      var border = 10;
      var w = 0;
      var h = 0;

      var timings = [];

      /*
      function Synopses(data) {
        var size = data.length;
        var start = function() {
          return (quantity - size) * scope.selection.getZoom() / 100 + size - quantity;
        }();

        this.name = 'Synopses';
        this.children = data
          .sort(function(a, b) {
            return b.total - a.total;
          })
          .slice(start, start+quantity);
      }
      */

      var dimension = function() {
        var boundRect = element[0].getBoundingClientRect();
        return {
          "w": boundRect.width,
          "h": $window.innerHeight - boundRect.top
        };
      };

      var value = function(d) {
        var v = d[scope.selection.getMapping()];
        var max = timings[start][scope.selection.getMapping()];
        var min = timings[start+quantity][scope.selection.getMapping()];
        if (v < min) return 0;
        if (v > max) return 0;
        return v;
      };

      var treemap = d3.layout.treemap()
        .children(function(n) {
          if (n.parent) return null;
          return Array.from(n.values());
        })
        .value(value)
        .round(false)
        .sticky(true)
        .sort(function(a, b) { return a.host - b.host; });

      scope.$watch(function() {
        return scope.synopses.updated();
      }, function(newVal, oldVal) {
        timings = [...scope.synopses.data.values()];
        timings.sort(function(a, b) { return b[scope.selection.getMapping()] - a[scope.selection.getMapping()]; });
        render(scope.synopses.data);
      });

      scope.$watch(function() {
        return dimension();
      }, function(newVal, oldVal) {
        w = newVal.w;
        h = newVal.h;
        transform(scope.synopses.data);
      }, true);


      scope.$watch(function() {
        return scope.selection.getMapping();
      }, function(newVal, oldVal) {
        timings.sort(function(a, b) { return b[newVal] - a[newVal]; });
        transform(scope.synopses.data);
      });

      scope.$watch(function() {
        return scope.selection.getZoom();
      }, function(newVal, oldVal) {
        start = Math.floor((quantity - scope.synopses.data.size) * newVal / 100 + scope.synopses.data.size - quantity);
        transform(scope.synopses.data);
      });

      var render = function(data) {
        if (!data.size) return;

        treemap.size([w, h]);

        var nodes = treemap.nodes(data)
          .filter(function(d) { return !d.children; });

        var svg = d3.select(element[0])
          .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
          .append("svg:g")
              .attr("transform", "translate(.5,.5)");

        var cell = svg.selectAll("g")
            .data(nodes)
          .enter().append("svg:g")
              .attr("class", "cell")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
              .on("click", function(d) { scope.select(d.host); })

        cell.append("svg:rect")
            .attr("width", function(d) { return d.dx - border; })
            .attr("height", function(d) { return d.dy - border; });

        cell.append("svg:text")
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", "0.5")
            .text(function(d) { return d.host; })
            .style("font-size", function(d) { return (d.dx / d.host.length) + "px"; })
            .style("display", function(d) {
              d.w = this.getComputedTextLength();
              return d.dx > d.w ? "block" : "none";
            });
      };

      var transform = function(data) {
        if (!data.size) return;

        treemap.size([w, h]).nodes(data);

        var svg = d3.select(element[0]).select("svg")
          .attr("width", w)
          .attr("height", h);

        var t = svg.selectAll("g.cell").transition()
          .duration(750)
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        t.select("rect")
          .attr("width", function(d) { return d.dx - border; })
          .attr("height", function(d) { return d.dy - border; });

        t.select("text")
          .attr("x", function(d) { return d.dx / 2; })
          .attr("y", function(d) { return d.dy / 2; })
          .text(function(d) { return d.host; })
          .style("font-size", function(d) { return (d.dx / d.host.length) + "px"; })
          .style("display", function(d) {
            console.log(d);
            return d.value > 10 ? "block" : "none";
          });
      };
    }
  }
});
