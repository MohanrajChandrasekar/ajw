import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportsService } from '../../../services/reports/reports.service';
import { DashboardDate } from '../../dashboard';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { ConsignmentTrackingService } from '../../../services/Transactions/consignmentTrackingService/consignment-tracking.service';

@Component({
  selector: 'app-production-report',
  templateUrl: './production-report.component.html',
  styleUrls: ['./production-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductionReportComponent implements OnInit {

  @ViewChild('tpl') tpl: TemplateRef<any>;
  @ContentChild('tpl') tpl1: TemplateRef<any>;

  Temp: any[];

  dashboardDate: DashboardDate = new DashboardDate();
  constructor(private reportService: ReportsService,
              private trackService: ConsignmentTrackingService,
              private xlsxService: XlsxService) { }

  ngOnInit() { }

  refreshData() {
    var dashboardDate;
    this.reportService.getBehaviorView().subscribe(res => {
      dashboardDate = res;
    });
    this.trackService.trackProductionByUsers(dashboardDate).subscribe(res => {
      if (res.status == 200) {
        this.Temp = res.results;
        this.Temp.forEach((ele, i) => {
          ele.i = i + 1;
          ele.tot = parseInt(ele.Booking == null ? 0 : ele.Booking, 10) + parseInt(ele.DRS == null ? 0 : ele.DRS, 10) +
                    parseInt(ele.FDM == null ? 0 : ele.FDM, 10) + parseInt(ele.RTO == null ? 0 : ele.RTO, 10);
          if (ele.totalHours.length === 12) {
            ele.totalHours = ele.totalHours.toString().slice(0, 8);
          } else {
            ele.totalHours = ele.totalHours.toString().slice(0, 7);
          }
        });
        this.Temp = [... this.Temp];
      }
    });
  }
            
  exportXlsx() {
      const data: any[] = [];
      this.Temp.forEach(element => {
        const val = {
          'S.No': element.i,
          'User Name': element.userID,
          'Booking': element.Booking,
          'FC': element.FC,
          'FDM': element.FDM,
          'DRS': element.DRS,
          'RTO' : element.RTO,
          'ART PRCS' : element.Booking,
          'TOTAL' : element.tot
        };
      data.push(val);
      });
    this.xlsxService.saveAsExcelFile(data, 'User Production Report');
  }

}
