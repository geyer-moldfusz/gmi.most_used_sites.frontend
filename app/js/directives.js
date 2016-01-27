'use strict';

var trckyrslfDirectives =  angular.module('trckyrslfDirectives', []);

trckyrslfDirectives.directive('d3Treemap', function() {
  return {
    restrict: 'EA',
    scope: {
      data: '=',
      onSelect: '&'
    },
    link: function(scope, element, attrs) {

      function Synopses(data) {
        this.name = 'Synopses';
        this.children = data
          .sort(function(a, b) {
            return b.total - a.total;
          })
          .slice(0, 20);
      }

      scope.$watch('data', function(newVal) {
        if (!newVal) return;
        if (!newVal.length) return;

        scope.render(new Synopses(newVal));
      });

      scope.select = function(host) {
        scope.onSelect({host: host});
      };

      scope.render = function(data) {
        if (!data) return;

        var w = window.innerWidth;
        var h = window.innerHeight;
        var border = 10;

        var treemap = d3.layout.treemap()
          .round(false)
          .size([w, h])
          .sticky(true)
          .sort(function(a, b) { return a.host - b.host; })
          .value(function(d) { return d.total; });

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
            .style("font-size", function(d) {
              return (d.dx / (d.host.length * 15)) + "em";
            })
            .style("display", function(d) {
              d.w = this.getComputedTextLength();
              return d.dx > d.w ? "block" : "none";
            });

        d3.select("select").on("change", function() {
          treemap.value(this.value == "size" ? size : count).nodes(data);
          zoom(node);
        });
      };
    }
  }
});
