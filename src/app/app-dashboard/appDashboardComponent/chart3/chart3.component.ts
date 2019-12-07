import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm, FormGroupDirective } from "@angular/forms";
import * as d3 from 'd3';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Chart3, DashboardDate } from '../../dashboard';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';

@Component({
  selector: 'app-chart3',
  templateUrl: './chart3.component.html',
  styleUrls: ['./chart3.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class Chart3Component implements OnInit {
  //Query Selector
  @ViewChild("tpl") tpl: TemplateRef<any>;
  @ContentChild("tpl") tpl1: TemplateRef<any>;


  dashboardForm: FormGroup;
  chart3: Chart3 = new Chart3();
  temp: any[];
  dashboardDate: DashboardDate = new DashboardDate();

  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private dtpBinder: DtpBindFormatService,
    private xlsxService: XlsxService
  ) { }

  ngOnInit() { }

  exportXlsx() {
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Name": element.name,
        "Count": element.count
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'Delivery Distribution');
  }
  
  refreshData(dashboardDate) {

    d3.select("#svgCourse").select("g").remove();

    var svg = d3.select("#svgCourse"),
      margin = { top: 20, right: 20, bottom: 100, left: 40 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,

      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set x scale
    var x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

    // set y scale
    var y = d3.scaleLinear()
      .rangeRound([height, 0]);

    // set the colors
    var z = d3.scaleOrdinal()
      .range(["#BB8FCE"]);


    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("left", "0px")
      .style("top", "0px");;

    this.dashboardService.getBranchwise(dashboardDate).subscribe(data => {
      this.temp = data;
      //this.dialogRef.close();
      var keys = ['count']//data.columns.slice(1);
      data.forEach(element => {
        element.total = element.count;
      });
      data.sort(function (a, b) { return b.total - a.total; });
      x.domain(data.map(function (d) { return d.name; }));
      y.domain([0, d3.max(data, function (d) { return d.total; })]).nice();
      z.domain(keys);

      g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
        .attr("fill", function (d) { return z(d.key); })
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.name); })
        .attr("y", function (d) { return y(d[1]); })
        .attr("height", function (d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
        .on("mouseover", function (d) {
          var txt = '<br/>Total : ' + d.data.total;
          div.transition()
            .duration(200)
            .style("opacity", 1);
          div.html(txt)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });

      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("class", "d3LabelText")
        .attr("y", 0)
        .attr("x", -20)
        .attr("dy", ".35em")
        .attr("transform", "rotate(270)")
        .style("text-anchor", "end");

      g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y)
          .ticks(5))
        // .call(d3.axisLeft(y) .tickValues(d3.range(y.domain()[0], y.domain()[1] + 1, 1))
        // .tickFormat(function(d) {
        //   return ~~d;
        // }))
        .selectAll("text")
        .attr("class", "d3LabelText")
        .attr("x", -10)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("text-anchor", "end");

      // var legend = g.append("g")
      //   .attr("font-family", "Times New Roman")
      //   .attr("font-size", 10)
      //   .attr("text-anchor", "end")
      //   .selectAll("g")
      //   .data(keys.slice().reverse())
      //   .enter().append("g")
      //   .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      // legend.append("rect")
      //   .attr("x", width )
      //   .attr("width", 15)
      //   .attr("height", 15)
      //   .attr("fill", z);

      // legend.append("text")
      //   .attr("class", "d3LabelText")
      //   .attr("x", width-2)
      //   .attr("y", 9.5)
      //   .attr("dy", "0.32em")
      //   .text(function (d) {
      //     if (d == 'count') { return 'Distribution'; }
      //   });
    },
      err => {
        throw err;
      });
  }

}

