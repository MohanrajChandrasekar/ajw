import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportsService } from '../../../services/reports/reports.service';
import { DashboardDate } from '../../dashboard';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-opening-closing-report',
  templateUrl: './opening-closing-report.component.html',
  styleUrls: ['./opening-closing-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OpeningClosingReportComponent implements OnInit {

  //Query Selector
  @ViewChild("tpl") tpl: TemplateRef<any>;
  @ContentChild("tpl") tpl1: TemplateRef<any>;

  Temp: any[];

  dashboardDate: DashboardDate = new DashboardDate();
  constructor(private dashboardService: DashboardService,
              private xlsxService: XlsxService,
              private reportService: ReportsService) { }

  ngOnInit() { }

  refreshData(dashboardDate) {
    this.dashboardService.getOpeningClosingReport(dashboardDate).subscribe(res => {
      this.Temp = res;
      this.Temp.forEach((element, i) => { element.i = i + 1 ; });
      this.Temp = [... this.Temp];
    });
  }

  exportXlsx() {
    const data: any[] = [];
    this.Temp.forEach(element => {
      const val = {
        'S.No': element.i,
        'Run Number': element.runNumber,
        'Master Airway Bill Number': element.MawbNO,
        'HAWB Number': element.HawbNo,
        'Landed Weight': element.landedWeight,
        'Booked pieces': element.noOfPieces,
        'Booked Weight(Kgs)': element.bookedWeight,
        'Closed Pieces': element.outgoingPieces,
        'Closed Weight(Kgs)': element.outgoingWeight,
        'Remaining pieces to close': element.remainingPieces,
        'Remaning weight to close': element.remainingWeight,
        'Total Boxes': element.totalBoxes,
        'Opened Boxes': element.openedBoxes,
        'Closed Boxes': element.closedBoxes
      };
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'Opening Closing Report');
  }

  boxReport(row) {
    console.log(row);
    this.reportService.getBoxReportByHAWB(row).subscribe( res => {
      if (res.status == 200) {
        const data1: any[] = [];
        const temp = res.queryResults;
        temp.forEach((element, i) => { element.i = i + 1 ; });
        temp.forEach(element => {
          const val = {
            'S.No': element.i,
            'Box Weight Kgs': element.pcsWtKgs,
            'Box Weight Lbs': element.pcsWtLBs,
            'Booked Weight kgs': element.bookedWtKgs
          };
          data1.push(val);
        });
        this.xlsxService.saveAsExcelFile(data1, 'Box Detailed Report');
      }
    });
  }

}

