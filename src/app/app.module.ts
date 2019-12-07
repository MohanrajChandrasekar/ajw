import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppRoutingModule } from './app-routing.module';
import { NgxBarcodeModule } from 'ngx-barcode';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfficeService } from './services/Master/officeService/office.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppComponent } from './app.component';
import { BookIssueFormComponent } from './masters/book-issue/book-issue-form/book-issue-form.component';
import { BookIssueListComponent } from './masters/book-issue/book-issue-list/book-issue-list.component';
import { MaterialModule } from './shared/material.module';
import { AjwCityListComponent } from './masters/ajw_city/ajw-city-list/ajw-city-list.component';
import { AjwCityFormComponent } from './masters/ajw_city/ajw-city-form/ajw-city-form.component';
import { CodeGenListComponent } from './masters/code_gen/code-gen-list/code-gen-list.component';
import { CodeGenFormComponent } from './masters/code_gen/code-gen-form/code-gen-form.component';
import { ZoneListComponent } from './masters/zone/zone-list/zone-list.component';
import { ZoneFormComponent } from './masters/zone/zone-form/zone-form.component';
import { CustomerListComponent } from './masters/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './masters/customer/customer-form/customer-form.component';
import { CustomerDetailcardComponent } from './masters/customer/customer-detailcard/customer-detailcard.component';
import { OfficeCardDetailsComponent } from './masters/office/office-card-details/office-card-details.component';
import { OfficeFormComponent } from './masters/office/office-form/office-form.component';
import { OfficeListComponent } from './masters/office/office-list/office-list.component';
import { ModeListComponent } from './masters/mode/mode-list/mode-list.component';
import { ModeFormComponent } from './masters/mode/mode-form/mode-form.component';
import { PincodeListComponent } from './masters/pincode/pincode-list/pincode-list.component';
import { PincodeFormComponent } from './masters/pincode/pincode-form/pincode-form.component';
import { PinCodeServiceFormComponent } from './masters/pincodeService/pin-code-service-form/pin-code-service-form.component';
import { PinCodeServiceListComponent } from './masters/pincodeService/pin-code-service-list/pin-code-service-list.component';
import { PincodeRateMasterFormComponent } from './masters/pincodeRateMaster/pincode-rate-master-form/pincode-rate-master-form.component';
import { PincodeRateMasterListComponent } from './masters/pincodeRateMaster/pincode-rate-master-list/pincode-rate-master-list.component';
import { CurrencyFormComponent } from './masters/currency/currency-form/currency-form.component';
import { CurrencyListComponent } from './masters/currency/currency-list/currency-list.component';
import { StateFormComponent } from './masters/state/state-form/state-form.component';
import { ShipperListComponent } from './masters/shipper/shipper-list/shipper-list.component';
import { StateListComponent } from './masters/state/state-list/state-list.component';
import { ShipperFormComponent } from './masters/shipper/shipper-form/shipper-form.component';
import { EmailListComponent } from './masters/email/email-list/email-list.component';
import { EmailFormComponent } from './masters/email/email-form/email-form.component';
import { ColoaderFormComponent } from './masters/coloader/coloader-form/coloader-form.component';
import { ColoaderListComponent } from './masters/coloader/coloader-list/coloader-list.component';
import { LoginComponent } from './login/login.component';
import { EmployeeFormComponent } from './masters/employee/employee-form/employee-form.component';
import { EmployeeListComponent } from './masters/employee/employee-list/employee-list.component';
import { EmployeeDetailCardComponent } from './masters/employee/employee-detail-card/employee-detail-card.component';
import { ColoaderRateFormComponent } from './masters/coloaderRate/coloader-rate-form/coloader-rate-form.component';
import { ColoaderRateListComponent } from './masters/coloaderRate/coloader-rate-list/coloader-rate-list.component';
import { Globals } from './global';
import { CompanyFormComponent } from './masters/company/company-form/company-form.component';
import { CompanyListComponent } from './masters/company/company-list/company-list.component';
import { AppNavComponent } from './app-nav/app-nav.component';
import { NavService } from './services/navListService/nav.service';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { IncomingLoadComponent } from './transaction/secondClass/incoming-load/incoming-load.component';
import { AuthService } from './login/auth.service';
import { LoginModule } from './login/login.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { IncomingViewComponent } from './transaction/secondClass/incoming-view/incoming-view.component';
import { AppDashboardComponent } from './app-dashboard/app-dashboard.component';
import { UserListComponent } from './admin/user/user-list/user-list.component';
import { UserFormComponent } from './admin/user/user-form/user-form.component';
import { IncomingNewComponent } from './transaction/secondClass/incoming-new/incoming-new.component';
import { DeliveryCategoryFormComponent } from './masters/deliveryCategory/delivery-category-form/delivery-category-form.component';
import { DeliveryCategoryListComponent } from './masters/deliveryCategory/delivery-category-list/delivery-category-list.component';
import { RoleFormComponent } from './admin/role/role-form/role-form.component';
import { RoleListComponent } from './admin/role/role-list/role-list.component';
import { TokenInterceptor } from './login/tokeninterceptor';
import { PasswordComponent } from './admin/password/password.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { BoxDetailDialogComponent } from './shared/box-detail-dialog/box-detail-dialog.component';
import { IncomingBoxComponent } from './transaction/secondClass/incoming-box/incoming-box.component';
import { IncomingJobPlannerComponent } from './transaction/secondClass/incoming-job-planner/incoming-job-planner.component';

import { OnlyNumDirective } from './shared/directives/only-num.directive';
import { NumNotDotDirective } from './shared/directives/num-not-dot.directive';
// import { NumberOnlyDirective } from './shared/directives/number-only.directive';
// import { DeleteConfirmationDialogBoxComponent } from './shared/delete-confirmation-dialog-box/delete-confirmation-dialog-box.component';
import { NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "./shared/ngbDateFormat";
import { GlobalErrorHandlerServiceService } from './services/sharedServices/globalErrorHandlerService/global-error-handler-service.service';
import { DocumentFormComponent } from './masters/document/document-form/document-form.component';
import { DocumentListComponent } from './masters/document/document-list/document-list.component';
import { MagazineFormComponent } from './masters/magazine/magazine-form/magazine-form.component';
import { MagazineListComponent } from './masters/magazine/magazine-list/magazine-list.component';
import { DetailedBookingComponent } from './transaction/booking/detailed-booking/detailed-booking.component';
import { DialogOverviewExampleDialog, IssueDialogComponent } from './transaction/booking/bookingInfo/booking-info.component';
import { DialogOverviewExample } from './transaction/failed-consignment-handling/failed-consignment-handling.component';
import { BookingInfoComponent } from './transaction/booking/bookingInfo/booking-info.component';
import { DisableControlDirective } from './shared/directives/disable-control.directive';
import { BookingListComponent } from './transaction/booking/bookingList/booking-list.component';
import { DatewiseComponent } from './app-dashboard/appDashboardComponent/datewise/datewise.component';
import { BranchwiseComponent } from './app-dashboard/appDashboardComponent/branchwise/branchwise.component';
import { Chart3Component } from './app-dashboard/appDashboardComponent/chart3/chart3.component';
import { OutgoingPacketManifestFormComponent } from './transaction/outgoing-manifest/outgoing-packet-manifest-form/outgoing-packet-manifest-form.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AgentDeliveryComponent } from './transaction/agent-delivery/agent-delivery-form/agent-delivery.component';
import { AgentDelvListComponent } from './transaction/agent-delivery/agent-delv-list/agent-delv-list.component';
import { OutgoingPacketManifestListComponent } from './transaction/outgoing-manifest/outgoing-packet-manifest-list/outgoing-packet-manifest-list.component';
import { BookingDetailsComponent } from './app-dashboard/appDashboardComponent/booking-details/booking-details.component';
import { ConsignmentTrackingComponent } from './transaction/tracking/consignment-tracking/consignment-tracking.component';
import { PodListComponent } from './transaction/pod/pod-list/pod-list.component';
import { PodFormComponent } from './transaction/pod/pod-form/pod-form.component';
import { AgentMasterFormComponent } from './masters/agent/agent-master-form/agent-master-form.component';
import { AgentMasterListComponent } from './masters/agent/agent-master-list/agent-master-list.component';
import { ExpensesFormComponent } from './masters/expenses/expenses-form/expenses-form.component';
import { ExpenseComponent } from './transaction/expense/expense.component';
import { SplCustListComponent } from './transaction/specialCustomers/spl-cust-list/spl-cust-list.component';
import { SplCustFormComponent } from './transaction/specialCustomers/spl-cust-form/spl-cust-form.component';
import { SplCustDetailBookingComponent } from './transaction/specialCustomers/spl-cust-detail-booking/spl-cust-detail-booking.component';
import { FailedConsignmentHandlingComponent } from './transaction/failed-consignment-handling/failed-consignment-handling.component';
import { ReBookingConsignmentsComponent } from './transaction/reBookingConsignments/re-booking-consignments/re-booking-consignments.component';
import { DialogOverviewChangeVendor } from './transaction/reBookingConsignments/re-booking-consignments/re-booking-consignments.component';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { MisRoutedComponent } from './transaction/mis-routed/mis-routed.component';
import { VendorWiseComponent } from './app-dashboard/appDashboardComponent/vendor-wise/vendor-wise.component';
import { OpeningClosingReportComponent } from './app-dashboard/appDashboardComponent/opening-closing-report/opening-closing-report.component';
import { DeliveryBreakupComponent } from './app-dashboard/appDashboardComponent/delivery-breakup/delivery-breakup.component';
import { AllReportsComponent } from './reports/all-reports/all-reports.component';
import { MisroutedReportComponent } from './app-dashboard/appDashboardComponent/misrouted-report/misrouted-report.component';
import { CookieService } from 'ngx-cookie-service';
import { StationReportComponent } from './app-dashboard/appDashboardComponent/station-report/station-report.component';
import { TrackingBulkComponent } from './transaction/tracking/tracking-bulk/tracking-bulk.component';
import { ProductionReportComponent } from './app-dashboard/appDashboardComponent/production-report/production-report.component';
import { ColoaderReportComponent } from './app-dashboard/appDashboardComponent/coloader-report/coloader-report.component';
import { TariffReportComponent } from './app-dashboard/appDashboardComponent/tariff-report/tariff-report.component';
import { ScanningManifestsComponent } from './transaction/secondClass/scanning-manifests/scanning-manifests.component';
import { InscanFormComponent } from './transaction/secondClass/inscan-form/inscan-form.component';
import { ChangeVendorsComponent } from './transaction/agent-delivery/change-vendors/change-vendors.component';
import { OutPackedManifestReportComponent } from './app-dashboard/appDashboardComponent/out-packed-manifest-report/out-packed-manifest-report.component';
import { DeliveryVendorReportComponent } from './app-dashboard/appDashboardComponent/delivery-vendor-report/delivery-vendor-report.component';
import { SpecialConsigneeComponent } from './masters/specialConsignee/special-consignee/special-consignee.component';
import { PodDetailsViewComponent } from './transaction/pod/pod-details-view/pod-details-view.component';
import { PodDetailDialogComponent } from './transaction/pod/pod-form/pod-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerDetailcardComponent,
    AjwCityListComponent,
    AjwCityFormComponent,
    CodeGenListComponent,
    CodeGenFormComponent,
    ZoneListComponent,
    ZoneFormComponent,
    CustomerListComponent,
    CustomerFormComponent,
    ModeListComponent,
    ModeFormComponent,
    OfficeCardDetailsComponent,
    OfficeFormComponent,
    OfficeListComponent,
    BookIssueFormComponent,
    BookIssueListComponent,
    PincodeListComponent,
    PincodeFormComponent,
    PinCodeServiceFormComponent,
    PinCodeServiceListComponent,
    PincodeRateMasterFormComponent,
    PincodeRateMasterListComponent,
    CurrencyFormComponent,
    CurrencyListComponent,
    StateFormComponent,
    StateListComponent,
    ShipperListComponent,
    ShipperFormComponent,
    EmailListComponent,
    EmailFormComponent,
    ColoaderFormComponent,
    ColoaderListComponent,
    LoginComponent,
    EmployeeFormComponent,
    EmployeeListComponent,
    EmployeeDetailCardComponent,
    ColoaderRateFormComponent,
    ColoaderRateListComponent,
    CompanyFormComponent,
    CompanyListComponent,
    AppNavComponent,
    MenuListItemComponent,
    IncomingLoadComponent,
    UserFormComponent,
    UserListComponent,
    IncomingViewComponent,
    AppDashboardComponent,
    UserFormComponent,
    UserListComponent,
    IncomingNewComponent,
    RoleListComponent,
    RoleFormComponent,
    PasswordComponent,
    DeliveryCategoryFormComponent,
    DeliveryCategoryListComponent,
    IncomingBoxComponent,
    IncomingJobPlannerComponent,
    OnlyNumDirective,
    NumNotDotDirective,
    DocumentFormComponent,
    DocumentListComponent,
    MagazineFormComponent,
    MagazineListComponent,
    DetailedBookingComponent,
    DialogOverviewExampleDialog,
    BookingInfoComponent,
    DisableControlDirective,
    BookingListComponent,
    DatewiseComponent,
    BranchwiseComponent,
    OutgoingPacketManifestFormComponent,
    Chart3Component,
    AgentDeliveryComponent,
    AgentDelvListComponent,
    OutgoingPacketManifestListComponent,
    BookingDetailsComponent,
    ConsignmentTrackingComponent,
    PodListComponent,
    PodFormComponent,
    IssueDialogComponent,
    AgentMasterFormComponent,
    AgentMasterListComponent,
    ExpensesFormComponent,
    ExpenseComponent,
    SplCustListComponent,
    SplCustFormComponent,
    SplCustDetailBookingComponent,
    FailedConsignmentHandlingComponent,
    DialogOverviewExample,
    ReBookingConsignmentsComponent,
    DialogOverviewChangeVendor,
    MisRoutedComponent,
    VendorWiseComponent,
    OpeningClosingReportComponent,
    DeliveryBreakupComponent,
    AllReportsComponent,
    MisroutedReportComponent,
    StationReportComponent,
    TrackingBulkComponent,
    ProductionReportComponent,
    ColoaderReportComponent,
    TariffReportComponent,
    ScanningManifestsComponent,
    InscanFormComponent,
    ChangeVendorsComponent,
    DeliveryVendorReportComponent,
    OutPackedManifestReportComponent,
    SpecialConsigneeComponent,
    PodDetailsViewComponent,
    PodDetailDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MomentModule,
    NgxDatatableModule,
    MaterialModule,
    NgbModule.forRoot(),
    MatDialogModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    NgxBarcodeModule,
    ShowHidePasswordModule
  ],

  providers: [
        Globals, NavService, AuthService, GlobalErrorHandlerServiceService, CookieService,
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter},
        {provide: ErrorHandler, useClass: GlobalErrorHandlerServiceService}],
  bootstrap: [AppComponent],
  entryComponents: [OfficeCardDetailsComponent,
                    PasswordComponent,
                    CustomerDetailcardComponent,
                    EmployeeDetailCardComponent,
                    ConfirmationDialogComponent,
                    BoxDetailDialogComponent,
                    DialogOverviewExampleDialog,
                    DialogOverviewExample,
                    DialogOverviewChangeVendor,
                    IssueDialogComponent,
                    PodDetailDialogComponent]
})

export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => {
  console.log(err);
});