import { Component, ViewChild, AfterContentInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardDate } from './dashboard';
import { BranchwiseComponent } from './appDashboardComponent/branchwise/branchwise.component';
import { Chart3Component } from './appDashboardComponent/chart3/chart3.component';
import { DatewiseComponent } from './appDashboardComponent/datewise/datewise.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BookingDetailsComponent } from './appDashboardComponent/booking-details/booking-details.component';
import { DtpBindFormatService } from '../shared/dtp-bind-format.service';
import { AuthService } from '../login/auth.service';
import { VendorWiseComponent } from './appDashboardComponent/vendor-wise/vendor-wise.component';
import { ReportsService } from '../services/reports/reports.service';
import { OpeningClosingReportComponent } from './appDashboardComponent/opening-closing-report/opening-closing-report.component';
import { DeliveryBreakupComponent } from './appDashboardComponent/delivery-breakup/delivery-breakup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styles: ['./app-dashboard.component.scss']
})

export class AppDashboardComponent implements AfterContentInit {

  @ViewChild(BranchwiseComponent)
  private branchWiseComponent: BranchwiseComponent;
  @ViewChild(Chart3Component)
  private chart3Component: Chart3Component;
  @ViewChild(DatewiseComponent)
  private datewiseComponent: DatewiseComponent;
  @ViewChild(BookingDetailsComponent)
  private bookingDetailsComponent: BookingDetailsComponent
  @ViewChild(VendorWiseComponent)
  private vendorwiseComponent: VendorWiseComponent
  @ViewChild(OpeningClosingReportComponent)
  private openingClosingReportComponent:OpeningClosingReportComponent
  @ViewChild(DeliveryBreakupComponent)
  private deliveryBreackupComponent: DeliveryBreakupComponent

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 2, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 2 },
          { title: 'Card 4', cols: 1, rows: 1 },
          { title: 'Card 5', cols: 2, rows: 1 },
          { title: 'Card 6', cols: 2, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 },
        { title: 'Card 5', cols: 2, rows: 1 },
        { title: 'Card 6', cols: 2, rows: 1 }

      ];
    })
  );

  dashboardForm: FormGroup;
  dashboardDate: DashboardDate = new DashboardDate();
  data: DashboardDate = new DashboardDate();
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    private dtpBindFormatService: DtpBindFormatService,
    private authService: AuthService,
    private reportService: ReportsService) {
    this.dashboardForm = this.fb.group({
      range: null
    });
  }

  ngOnInIt() {
  }

  ngAfterContentInit(): void {
    var curr = new Date;
    this.dashboardDate.fromDate = this.dtpBindFormatService.convert((new Date(curr.getTime() - (6 * 24 * 60 * 60 * 1000))));
    this.dashboardDate.toDate = this.dtpBindFormatService.convert(new Date());
    
    this.reportService.setBehaviorView({fromDate: this.dashboardDate.fromDate, toDate: this.dashboardDate.toDate});
    
    this.dashboardDate.branchId = this.authService.branchId;
    this.dashboardDate.roleId = this.authService.roleId;

    this.datewiseComponent.refreshData(this.dashboardDate);
    this.branchWiseComponent.refreshData(this.dashboardDate);
    this.chart3Component.refreshData(this.dashboardDate);
    this.bookingDetailsComponent.refreshData(this.dashboardDate);
    this.vendorwiseComponent.refreshData(this.dashboardDate);
    this.openingClosingReportComponent.refreshData(this.dashboardDate);

    this.dashboardForm.patchValue({
        range : [this.dashboardDate.fromDate, this.dashboardDate.toDate]
     });
  }

  getDate() {
    
    this.dashboardDate.fromDate = this.dashboardForm.value.range[0].toISOString().slice(0, 10);
    this.dashboardDate.toDate = this.dashboardForm.value.range[1].toISOString().slice(0, 10);

    this.reportService.setBehaviorView({fromDate: this.dashboardDate.fromDate, toDate: this.dashboardDate.toDate});

    this.branchWiseComponent.refreshData(this.dashboardDate);
    this.chart3Component.refreshData(this.dashboardDate);
    this.datewiseComponent.refreshData(this.dashboardDate);
    this.bookingDetailsComponent.refreshData(this.dashboardDate);
    this.vendorwiseComponent.refreshData(this.dashboardDate);
    this.openingClosingReportComponent.refreshData(this.dashboardDate);
    this.deliveryBreackupComponent.refreshData();

  }

  applyTheme(pop: any) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'YYYY-MM-DD' });
    setTimeout(() => {
      pop.show();
    });
  }

}