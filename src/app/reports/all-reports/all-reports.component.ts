import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BookingDetailsComponent } from '../../app-dashboard/appDashboardComponent/booking-details/booking-details.component';
import { DtpBindFormatService } from '../../shared/dtp-bind-format.service';
import { AuthService } from '../../login/auth.service';
import { VendorWiseComponent } from '../../app-dashboard/appDashboardComponent/vendor-wise/vendor-wise.component';
import { ReportsService } from '../../services/reports/reports.service';
import { OpeningClosingReportComponent } from '../../app-dashboard/appDashboardComponent/opening-closing-report/opening-closing-report.component';
import { DeliveryBreakupComponent } from '../../app-dashboard/appDashboardComponent/delivery-breakup/delivery-breakup.component';
import { DashboardDate } from '../../app-dashboard/dashboard';
import { ProductionReportComponent } from '../../app-dashboard/appDashboardComponent/production-report/production-report.component';
import { ColoaderReportComponent } from '../../app-dashboard/appDashboardComponent/coloader-report/coloader-report.component';
import { TariffReportComponent } from '../../app-dashboard/appDashboardComponent/tariff-report/tariff-report.component';

@Component({
  selector: 'app-all-reports',
  templateUrl: './all-reports.component.html',
  styleUrls: ['./all-reports.component.scss']
})
export class AllReportsComponent implements OnInit {

  @ViewChild(BookingDetailsComponent)
  private bookingDetailsComponent: BookingDetailsComponent
  @ViewChild(VendorWiseComponent)
  private vendorwiseComponent: VendorWiseComponent
  @ViewChild(OpeningClosingReportComponent)
  private openingClosingReportComponent:OpeningClosingReportComponent
  @ViewChild(DeliveryBreakupComponent)
  private deliveryBreackupComponent: DeliveryBreakupComponent
  @ViewChild(ProductionReportComponent)
  private productionReportComponent: ProductionReportComponent
  @ViewChild(ColoaderReportComponent)
  private coloaderReportComponent: ColoaderReportComponent
  @ViewChild(TariffReportComponent)
  private tariffReportComponent: TariffReportComponent

  reportForm: FormGroup;
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  dashboardDate: DashboardDate = new DashboardDate();
  data: DashboardDate = new DashboardDate();

  constructor(private dtpBindFormatService: DtpBindFormatService,
    private authService: AuthService,
    private fb: FormBuilder,
    private reportService: ReportsService) { 
      this.reportForm = this.fb.group({
        range: null
      });
  }

  ngOnInit() {
  }

  applyTheme(pop: any) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'YYYY-MM-DD' });
    setTimeout(() => {
      pop.show();
    });
  }

  getDate() {
    this.dashboardDate.fromDate = this.dtpBindFormatService.convert(this.reportForm.value.range[0].toISOString().slice(0, 10));
    this.dashboardDate.toDate = this.dtpBindFormatService.convert(this.reportForm.value.range[1].toISOString().slice(0, 10));

    this.reportService.setBehaviorView({fromDate: this.dashboardDate.fromDate, toDate: this.dashboardDate.toDate});
    this.vendorwiseComponent.refreshData(this.dashboardDate);
    this.openingClosingReportComponent.refreshData(this.dashboardDate);
    this.deliveryBreackupComponent.refreshData();
    this.productionReportComponent.refreshData();
    this.tariffReportComponent.refreshData();
  }

}
