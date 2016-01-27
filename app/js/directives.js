'use strict';

var trckyrslfDirectives =  angular.module('trckyrslfDirectives', []);

trckyrslfDirectives.directive('d3Treemap', function() {
  return {
    restrict: 'EA',
    controller: 'SynopsesController',
    scope: {},
    link: function(scope, element, attrs) {

      function Synopses(data) {
        this.name = 'Synopses';
        this.children = data
          .sort(function(a, b) {
            return b.total - a.total;
          })
          .slice(0, 20);
      }

      var w = window.innerWidth;
      var h = window.innerHeight;
      var border = 10;

      var treemap = d3.layout.treemap()
        .round(false)
        .size([w, h])
        .sticky(true)
        .sort(function(a, b) { return a.host - b.host; });

      scope.$watch(function() {
        return scope.synopses.updated();
      }, function(newVal, oldVal) {
        render(new Synopses(Array.from(scope.synopses.data.values())));
      });

      scope.$watch(function() {
        return scope.selection.getMapping();
      }, function(newVal, oldVal) {
        transform(new Synopses(Array.from(scope.synopses.data.values())));
      });

      var render = function(data) {
        if (!data.children.length) return;

        treemap.value(function(d) { return d[scope.selection.getMapping()]; });

        var nodes = treemap.nodes(data)
          .filter(function(d) { return !d.children; });

        var svg = d3.select(element[0])
            .style("width", "100%")
            .style("height", "100%")
          .append("svg:svg")
            .attr("width", "100%")
            .attr("height", "100%")
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
        if (!data.children.length) return;

        treemap
          .value(function(d) { return d[scope.selection.getMapping()]; })
          .nodes(data)
          .filter(function(d) { return !d.children; });

        var svg = d3.select(element[0]);
        var t = svg.selectAll("g.cell").transition()
          .duration(750)
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        t.select("rect")
          .attr("width", function(d) { return d.dx - border; })
          .attr("height", function(d) { return d.dy - border; });

        t.select("text")
          .attr("x", function(d) { return d.dx / 2; })
          .attr("y", function(d) { return d.dy / 2; })
          .style("font-size", function(d) { return (d.dx / d.host.length) + "px"; });
      };
    }
  }
});
