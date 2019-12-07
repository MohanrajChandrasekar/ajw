import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportsService } from '../../../services/reports/reports.service';
import { DashboardDate } from '../../dashboard';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { ConsignmentTrackingService } from '../../../services/Transactions/consignmentTrackingService/consignment-tracking.service';
import { _ } from 'underscore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';

@Component({
  selector: 'app-coloader-report',
  templateUrl: './coloader-report.component.html',
  styleUrls: ['./coloader-report.component.scss']
})
export class ColoaderReportComponent implements OnInit {

  @ViewChild('tpl') tpl: TemplateRef<any>;
  @ContentChild('tpl') tpl1: TemplateRef<any>;

  Temp: any[];
  breakUp: any[];
  coloaderReport: FormGroup;

  dashboardDate: DashboardDate = new DashboardDate();
  bsConfig: Partial<BsDatepickerConfig>;
  data: DashboardDate = new DashboardDate();
  colorTheme = 'theme-blue';

  constructor(private reportService: ReportsService,
              private fb: FormBuilder,
              private dtpFormatService: DtpBindFormatService,
              private trackService: ConsignmentTrackingService,
              private xlsxService: XlsxService) {
                this.coloaderReport = this.fb.group({
                  range: null
                });
            }

  applyTheme(pop: any) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'YYYY-MM-DD' });
      setTimeout(() => {
      pop.show();
    });
  }

  ngOnInit() { }

  getData() {
    const obj = Object.assign({}, this.coloaderReport.value);
    obj.fromDate = this.dtpFormatService.convert(obj.range[0]);
    obj.toDate = this.dtpFormatService.convert(obj.range[1]);
    this.trackService.coloaderReports(obj).subscribe(res => {
      if (res.status == 200) {
        this.Temp = res.results;
        this.Temp.forEach((ele, i) => {
          ele.i = i + 1;
        });
        const temp = [... this.Temp];
        this.Temp =  _.filter(temp, function(ele) { return ele.Coloader != null; });
      }
      console.log(this.Temp);
    });
  }

  getBreakUp(id) {
    const obj = Object.assign({}, this.coloaderReport.value);
    obj.fromDate = this.dtpFormatService.convert(obj.range[0]);
    obj.toDate = this.dtpFormatService.convert(obj.range[1]);
    obj.refOutColoaderID = id;
    this.trackService.getColoaderBreakup(obj).subscribe( res => {
      if (res.status == 200) {
        this.breakUp = res.results;
        const data: any[] = [];
        this.breakUp.forEach((element, i) => {
          const val = {
            'S.No': i + 1,
            'CNNO': element.cnNO,
            'No.Of.Pcs': element.noOfPcs,
            'Weight (Kg)': element.pcsWtKgs,
            'Coloader': element.coloaderName,
            'Rate / KG': element.ratePerKG,
            'Number Of Pieces': element.noOfPcs,
            'Actual Rate': element.actualRate,
            'Destination': element.destination
          };
        data.push(val);
        });
      this.xlsxService.saveAsExcelFile(data, 'Coloader Breakup Report');
      }
    });
  }

  exportXlsx() {
      const data: any[] = [];
      this.Temp.forEach(element => {
        const val = {
          'S.No': element.i,
          'Coloader': element.Coloader,
          'Destination': element.destination,
          'Number Of Consignments': element.noOfCnno,
          'Number Of Pieces': element.noOfPcs,
          'Total Weight(Kg)': element.totWeight,
          'Rate / KG': element.ratePerKG,
          'Total Rate': element.totalRate
        };
      data.push(val);
      });
    this.xlsxService.saveAsExcelFile(data, 'Coloader Report');
  }

}
