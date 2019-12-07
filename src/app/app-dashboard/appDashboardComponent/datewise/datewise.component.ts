import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { DashboardDate } from '../../dashboard';
import { ReportsService } from '../../../services/reports/reports.service';

@Component({
  selector: 'app-datewise',
  templateUrl: './datewise.component.html',
  styleUrls: ['./datewise.component.scss'],
  // inputs: ['fromDate','toDate'],
  encapsulation: ViewEncapsulation.None

})
export class DatewiseComponent implements OnInit {
  //Query Selector
  @ViewChild("tpl") tpl: TemplateRef<any>;
  @ContentChild("tpl") tpl1: TemplateRef<any>;


  temp = [];
  dashboardDate: DashboardDate = new DashboardDate();
  constructor(private dashboardService: DashboardService,
              private xlsxService: XlsxService,
              private reportService: ReportsService) {

  }

  ngOnInit() {
  }

  exportXlsx() {
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Entry Date": element.entryDate,
        "First Class": element.FirstClass,
        "Second Class": element.SecondClass,
        "Third Class": element.ThirdClass,
        "Door To Door": element.DoorToDoor,
        "Express": element.Express
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'Datewise Distribution');
  }


  refreshData(dashboardDate) {
    this.dashboardService.getDateWise(dashboardDate).subscribe(data => {
      var trendsText = { 'FirstClass': 'First Class', 'SecondClass': 'Second Class', 'ThirdClass': 'Third Class', 'DoorToDoor': 'Door To Door', 'Express': 'Express' };
      this.temp = data;

      // d3.selectAll("*").remove();
      // set the dimensions and margins of the graph

      var margin = { top: 20, right: 80, bottom: 30, left: 50 },
        svg = d3.select('svg'),
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom;


      var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      // set the ranges
      var x = d3.scaleBand().rangeRound([0, width]).padding(1),
        y = d3.scaleLinear().rangeRound([height, 0]),
        z = d3.scaleOrdinal()
          .range(["#E74C3C", "#73C6B6", "#3498DB", "#F4D03F", "#85929E"]);



      // define the line
      var line = d3.line()
        .x(function (d) { return x(d.entryDate); })
        .y(function (d) { return y(d.total); });

      // scale the range of the data
      z.domain(d3.keys(data[0]).filter(function (key) {
        return key !== "entryDate";
      }));
      var trends = z.domain().map(function (name) {

        return {
          name: name,
          values: data.map(function (d) {
            return {
              entryDate: d.entryDate,
              total: +d[name]
            };
          })
        };
      });

      x.domain(data.map(function (d) { return d.entryDate; }));
      y.domain([0, d3.max(trends, function (c) {
        return d3.max(c.values, function (v) {
          return v.total;
        });
      })]);

      // Draw the legend
      var legend = g.selectAll('g')
        .data(trends)
        .enter()
        .append('g')
        .attr('class', 'legend');

      legend.append('rect')
        .attr('x', width - 20)
        .attr('y', function (d, i) { return height / 2 - (i + 1) * 20; })
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d) { return z(d.name); });

      legend.append('text')
        .attr('x', width - 8)
        .attr('y', function (d, i) { return height / 2 - (i + 1) * 20 + 10; })
        .text(function (d) { return trendsText[d.name]; });



      // Draw the line
      var trend = g.selectAll(".trend")
        .data(trends)
        .enter()
        .append("g")
        .attr("class", "trend");

      trend.append("path")
        .attr("class", "line")
        .attr("d", function (d) { return line(d.values); })
        .style("stroke", function (d) { return z(d.name); });

      // Draw the empty value for every point
      var points = g.selectAll('.points')
        .data(trends)
        .enter()
        .append('g')
        .attr('class', 'points')
        .append('text');

      // Draw the circle
      trend
        .style("fill", "#FFF")
        .style("stroke", function (d) { return z(d.name); })
        .selectAll("circle.line")
        .data(function (d) { return d.values })
        .enter()
        .append("circle")
        .attr("r", 2)
        .style("stroke-width", 2)
        .attr("cx", function (d) { return x(d.entryDate); })
        .attr("cy", function (d) { return y(d.total); });
      // trend
      //   .selectAll("circle.text")
      //   .data(function(d){ return d.values })
      //   .enter()
      //   .append('text')
      //   .attr('x', function(d) { return x(d.timescale) + 15; })
      //   .attr('y', function(d) { return y(d.total); })
      //   .text(function(d) { return d.total; });

      // Draw the axis
      g.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x));

      g.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(y)
        .ticks(5))
        // .call(d3.axisLeft(y)
        //   .tickValues(d3.range(y.domain()[0], y.domain()[1] + 1, 1))
        //   .tickFormat(function (d) {
        //     return ~~d;
        //   }));

      var focus = g.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

      focus.append('line')
        .attr('class', 'x-hover-line hover-line')
        .attr('y1', 0)
        .attr('y2', height);

      svg.append('rect')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove);

      var entryDates = data.map(function (name) { return x(name.entryDate); });

      function mouseover() {
        focus.style("display", null);
        d3.selectAll('.points text').style("display", null);
      }
      function mouseout() {
        focus.style("display", "none");
        d3.selectAll('.points text').style("display", "none");
      }
      function mousemove() {
        var i = d3.bisect(entryDates, d3.mouse(this)[0], 1);
        var di = data[i - 1];
        focus.attr("transform", "translate(" + x(di.entryDate) + ",0)");
        d3.selectAll('.points text')
          .attr('x', function (d) { return x(di.entryDate) + 15; })
          .attr('y', function (d) { return y(d.values[i - 1].total); })
          .text(function (d) { return d.values[i - 1].total; })
          .style('fill', function (d) { return z(d.name); });
      }
    },
    err => {
      throw err;
    })
  }

}

