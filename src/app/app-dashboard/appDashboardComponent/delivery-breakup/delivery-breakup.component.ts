import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportsService } from '../../../services/reports/reports.service';
import { DashboardDate } from '../../dashboard';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';

@Component({
  selector: 'app-delivery-breakup',
  templateUrl: './delivery-breakup.component.html',
  styleUrls: ['./delivery-breakup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryBreakupComponent implements OnInit {

  @ViewChild('tpl') tpl: TemplateRef<any>;
  @ContentChild('tpl') tpl1: TemplateRef<any>;

  Temp: any[];
  form1: FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;
  dashboardDate: DashboardDate = new DashboardDate();
  data: DashboardDate = new DashboardDate();
  colorTheme = 'theme-blue';

  constructor(private reportService: ReportsService,
              private fb: FormBuilder,
              private dtpFormatService: DtpBindFormatService,
              private xlsxService: XlsxService) {
                this.form1 = this.fb.group({
                  range: null
                });
              }

  ngOnInit() { }

  applyTheme(pop: any) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'YYYY-MM-DD' });
    setTimeout(() => {
      pop.show();
    });
  }

  refreshData() {
    var dashboardDate;
    this.reportService.getBehaviorView().subscribe(res => {
      dashboardDate = res;
    });
  }

  getData() {
    const obj = Object.assign({}, this.form1.value);
    obj.fromDate = this.dtpFormatService.convert(obj.range[0]);
    obj.toDate = this.dtpFormatService.convert(obj.range[1]);
    this.reportService.getDeliveryBreakup(obj).subscribe(res => {
      if (res.statusBool == 1) {
        this.Temp = res.data;
        this.Temp.forEach((element, i) => { element.i = i + 1; });
        this.Temp = [... this.Temp];
      }
    });

  }

  exportXlsx() {
    const data: any[] = [];
    this.Temp.forEach(element => {
      const val = {
        'S.No': element.i,
        'City Name': element.cityName,
        'Total CNNO': element.totCNNO,
        'Total Delivered': element.totDeld,
        'Total Delivered %': element.deldPrcnt,
        'Day1' : element.Day1,
        'Day2' : element.Day2,
        'Day3' : element.Day3,
        'Day4' : element.Day4,
        'Delivered in TAT' : element.fourDaysInTAT,
        'Day->5' : element.afterfrDys,
        'Delivered in TAT %' : element.frDysPrcntInTAT,
        'Total Non-Delivered' : element.totNDeld,
        'Total Non-Delivered %': element.NdeldPrcnt
      };
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'Delivered TAT report');
  }

}
