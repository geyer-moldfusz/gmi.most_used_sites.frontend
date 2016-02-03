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

      var border = 7;
      var w = 0;
      var h = 0;

      var dimension = function() {
        var boundRect = element[0].getBoundingClientRect();
        return {
          "w": boundRect.width,
          "h": $window.innerHeight - boundRect.top - 3
        };
      };

      var fontSize = function(d) {
        var fontX = function(d) {
          return (d.dx - border) / (d.host.length * 1.2);
        }
        var fontY = function(d) {
          return d.dy / 2 - border;
        }
        var size = Math.min(fontX(d), fontY(d));

        if (size < 4) return "font-none";
        if (size < 8) return "font-xs";
        if (size < 12) return "font-s";
        if (size < 16) return "font-m";
        if (size < 20) return "font-l";
        return "font-xl";
      };

      var selected = function(d) {
          return (d.host == scope.selection.getHost());
      };

      var treemap = d3.layout.treemap()
        .children(function(n) {
          if (n.parent) return null;
          return n.data;
        })
        .round(false)
        .sticky(false)
        .sort(function(a, b) { return a.host - b.host; });

      // XXX find better trigger
      scope.$watch(function() {
        return scope.synopses.updated();
      }, function() {
        if (treemap.size()[0] == 1) {
          console.log('render');
          render(scope.selection.getSynopses());
        } else {
          console.log('transform');
          transform(scope.selection.getSynopses());
        }
      });

      scope.$watch(function() {
        return dimension();
      }, function(newVal, oldVal) {
        w = newVal.w;
        h = newVal.h;
        transform(scope.selection.getSynopses());
      }, true);

      scope.$watch(function() {
        return scope.selection.updated();
      }, function() {
        transform(scope.selection.getSynopses());
      });

      var render = function(data) {
        if (!data.length) return;

        treemap.size([w, h]);

        d3.select(element[0]).selectAll("svg").remove();

        var nodes = treemap.nodes({data: data})
          .filter(function(d) { return (d.depth == 1); });

        var svg = d3.select(element[0]).append("svg:svg")
            .attr("width", w)
            .attr("height", h)
          .append("svg:g")
              .attr("class", "container")
              .attr("transform", "translate(.5,.5)");

        var cell = svg.selectAll("g.container").data(nodes)
          .enter().append("svg:g")
              .attr("class", "cell")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
              .on("click", function(d) { select(d.host); });

        cell.append("svg:rect")
            .attr("width", function(d) { return d.dx - border; })
            .attr("height", function(d) { return d.dy - border; });

        cell.append("svg:text")
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", "0.5")
            .attr("class", fontSize)
            .text(function(d) { return d.host.replace(new RegExp(/^www\./), ""); });
      };

      var select = function(host) {
        scope.select(host);

        d3.select(element[0]).selectAll("g.cell").select("rect")
          .attr("class", function(d) {
            return selected(d) ? "selected" : "de-selected";
          });
      }

      var transform = function(data) {
        if (!data.length) return;

        var nodes = treemap.size([w, h]).nodes({data: data})
          .filter(function(d) { return (d.depth == 1); });

        var svg = d3.select(element[0]).select("svg")
          .attr("width", w)
          .attr("height", h);

        var cell = d3.select(element[0]).selectAll("g.container").selectAll("g.cell")
          .data(data, function(d) { if(d) return d.host; })
          .enter()
          .append("svg:g")
              .attr("class", "cell")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
              .on("click", function(d) { select(d.host); })

        cell.append("svg:rect")
            .attr("width", function(d) { return d.dx - border; })
            .attr("height", function(d) { return d.dy - border; })

        cell.append("svg:text")
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", "0.5")
            .attr("class", fontSize)
            .text(function(d) { return d.host.replace(new RegExp(/^www\./), ""); });

        var t = svg.selectAll("g.cell")
          .on("click", function(d) {
            if (selected(d)) {
              select(null);
            } else {
              select(d.host);
            }
          });

        t.transition()
          .duration(750)
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        t.select("rect")
          .attr("width", function(d) { return d.dx - border; })
          .attr("height", function(d) { return d.dy - border; });

        t.select("text")
          .attr("x", function(d) { return d.dx / 2; })
          .attr("y", function(d) { return d.dy / 2; })
          .attr("class", fontSize);
      };
    }
  }
});
