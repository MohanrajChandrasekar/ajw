import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportsService } from '../../../services/reports/reports.service';
import { DashboardDate } from '../../dashboard';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { ConsignmentTrackingService } from '../../../services/Transactions/consignmentTrackingService/consignment-tracking.service';
import { _ } from 'underscore';

@Component({
  selector: 'app-tariff-report',
  templateUrl: './tariff-report.component.html',
  styleUrls: ['./tariff-report.component.scss']
})
export class TariffReportComponent implements OnInit {

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
    this.trackService.postalTariff(dashboardDate).subscribe(res => {
      if(res.status == 200){
        this.Temp = res.results;
        this.Temp.forEach((ele, i) => {
          ele.i = i + 1;
        });
        this.Temp = [... this.Temp];
        // this.Temp =  _.filter(temp, function(ele) {return ele.Coloader != null;});
      }
      console.log(this.Temp);
    });
  }

  exportXlsx() {
      const data: any[] = [];
      this.Temp.forEach(element => {
        const val = {
          'S.No': element.i,
          'Tariff': element.tariff,
          'Postage': element.postage,
          'Number Of Pieces': element.nos,
          'Value': element.value,
          'Service Charges': element.sc
        };
      data.push(val);
      });
    this.xlsxService.saveAsExcelFile(data, 'Postal Tariff Report');
  }

}
