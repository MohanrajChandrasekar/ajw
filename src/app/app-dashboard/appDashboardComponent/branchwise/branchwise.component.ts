import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Branchwise, DashboardDate } from '../../dashboard';
import { MatDialog, MatDialogRef } from '@angular/material';
import { window } from 'rxjs/operators';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { d } from '@angular/core/src/render3';

@Component({
  selector: 'app-branchwise',
  templateUrl: './branchwise.component.html',
  styleUrls: ['./branchwise.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class BranchwiseComponent implements OnInit {
  //Query Selector
  @ViewChild("tpl") tpl: TemplateRef<any>;
  @ContentChild("tpl") tpl1: TemplateRef<any>;

  temp: any[];


  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog,
    private xlsxService: XlsxService) { }


  ngOnInit() {


  }

  exportXlsx() {
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Name": element.name,
        "Count": element.count
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'Branchwise Distribution');
  }

  refreshData(dashboardDate) {


    this.dashboardService.getChart3(dashboardDate).subscribe(data => {
      this.temp = data;
      // Define size & radius of donut pie chart
      var width = 450,
        height = 250,
        radius = Math.min(width, height) / 2;

      // Define arc colours
      var colour = d3.scaleOrdinal()
        .range(["#E74C3C", "#73C6B6", "#3498DB", "#F4D03F", "#85929E"]);

      // Define arc ranges
      var arcText = d3.scaleOrdinal(d3.schemeCategory10);

      // Determine size of arcs
      var arc = d3.arc()
        .innerRadius(radius - 60)
        .outerRadius(radius - 5);

      // Create the donut pie chart layout
      var pie = d3.pie()
        .value(function (d) { return d["count"]; })
        .sort(null);

      d3.select("#donut-chart").select("g").remove();

      // Append SVG attributes and append g to the SVG
      var svg = d3.select("#donut-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

      // Define inner circle
      svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 100)
        .attr("fill", "#fff");

      // Calculate SVG paths and fill in the colours
      var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")

      // Make each arc clickable 

      // Append the path to each g
      g.append("path")
        .attr("d", arc)
        .attr("fill", function (d, i) {
          return colour(i);
        });

      // Append text labels to each arc
      g.append("text")
        .attr("transform", function (d) {
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("fill", "#fff")
        .text(function (d, i) { return data[i].name + ":" + data[i].count; })

      g.selectAll(".arc text").call(wrap, arcText.range([0, width]));

      // Append text to the inner circle
      svg.append("text")
        .attr("dy", "-0.5em")
        .style("text-anchor", "middle")
        .attr("class", "inner-circle")
        .attr("fill", "#36454f")

      svg.append("text")
        .attr("dy", "1.0em")
        .style("text-anchor", "middle")
        .attr("class", "inner-circle")
        .attr("fill", "#36454f")
        
      var legendG = svg.selectAll("#donut-chart") // note appending it to mySvg and not svg to make positioning easier
        .data(pie(data))
        .enter().append("g")
        .attr("transform", function (d, i) {
          return "translate(" + (width + 10) + "," + (i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
        })
        .attr("class", "legend");

      legendG.append("rect") // make a matching color rect
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function (d, i) {
          return colour(i);
        });

      legendG.append("text") // add the text
        .text(function (d) {
          return data.count + "  " + data.name;
        })
        .style("font-size", 12)
        .attr("y", 10)
        .attr("x", 11);

      // Wrap function to handle labels with longer text
      function wrap(text, width) {
        text.each(function () {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          console.log("tspan: " + tspan);
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > 90) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }
    },
      err => {
        throw err;
      })

  }
}