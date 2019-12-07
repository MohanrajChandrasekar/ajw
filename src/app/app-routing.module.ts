import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AjwCityListComponent } from './masters/ajw_city/ajw-city-list/ajw-city-list.component';
import { AjwCityFormComponent } from './masters/ajw_city/ajw-city-form/ajw-city-form.component';
import { ZoneListComponent } from './masters/zone/zone-list/zone-list.component';
import { ZoneFormComponent } from './masters/zone/zone-form/zone-form.component';
import { CustomerListComponent } from './masters/customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './masters/customer/customer-form/customer-form.component';
import { BookIssueFormComponent } from './masters/book-issue/book-issue-form/book-issue-form.component';
import { BookIssueListComponent } from './masters/book-issue/book-issue-list/book-issue-list.component';
import { PincodeListComponent } from './masters/pincode/pincode-list/pincode-list.component';
import { PincodeFormComponent } from './masters/pincode/pincode-form/pincode-form.component';
import { OfficeListComponent } from './masters/office/office-list/office-list.component';
import { OfficeFormComponent } from './masters/office/office-form/office-form.component';
import { ModeFormComponent } from './masters/mode/mode-form/mode-form.component';
import { ModeListComponent } from './masters/mode/mode-list/mode-list.component';
import { PinCodeServiceFormComponent } from './masters/pincodeService/pin-code-service-form/pin-code-service-form.component';
import { PinCodeServiceListComponent } from './masters/pincodeService/pin-code-service-list/pin-code-service-list.component';
import { PincodeRateMasterListComponent } from './masters/pincodeRateMaster/pincode-rate-master-list/pincode-rate-master-list.component';
import { PincodeRateMasterFormComponent } from './masters/pincodeRateMaster/pincode-rate-master-form/pincode-rate-master-form.component';
import { CodeGenFormComponent } from './masters/code_gen/code-gen-form/code-gen-form.component';
import { CodeGenListComponent } from './masters/code_gen/code-gen-list/code-gen-list.component';
import { CurrencyListComponent } from './masters/currency/currency-list/currency-list.component';
import { CurrencyFormComponent } from './masters/currency/currency-form/currency-form.component';
import { StateFormComponent } from './masters/state/state-form/state-form.component';
import { StateListComponent } from './masters/state/state-list/state-list.component';
import { ShipperFormComponent } from './masters/shipper/shipper-form/shipper-form.component';
import { ShipperListComponent } from './masters/shipper/shipper-list/shipper-list.component';
import { EmailFormComponent } from './masters/email/email-form/email-form.component';
import { EmailListComponent } from './masters/email/email-list/email-list.component';
import { ColoaderListComponent } from './masters/coloader/coloader-list/coloader-list.component';
import { ColoaderFormComponent } from './masters/coloader/coloader-form/coloader-form.component';
import { EmployeeListComponent } from './masters/employee/employee-list/employee-list.component';
import { EmployeeFormComponent } from './masters/employee/employee-form/employee-form.component';
import { ColoaderRateFormComponent } from './masters/coloaderRate/coloader-rate-form/coloader-rate-form.component';
import { ColoaderRateListComponent } from './masters/coloaderRate/coloader-rate-list/coloader-rate-list.component';
import { LoginComponent } from './login/login.component';
import { CompanyFormComponent } from './masters/company/company-form/company-form.component';
import { CompanyListComponent } from './masters/company/company-list/company-list.component';
import { AppNavComponent } from './app-nav/app-nav.component';
import { IncomingLoadComponent } from './transaction/secondClass/incoming-load/incoming-load.component';
import { IncomingViewComponent } from './transaction/secondClass/incoming-view/incoming-view.component';
import { AuthGuard } from './login/auth-guard.service';
import { AppDashboardComponent } from './app-dashboard/app-dashboard.component';
import { UserFormComponent } from './admin/user/user-form/user-form.component';
import { UserListComponent } from './admin/user/user-list/user-list.component';
import { IncomingNewComponent } from './transaction/secondClass/incoming-new/incoming-new.component';
import { DeliveryCategoryFormComponent } from './masters/deliveryCategory/delivery-category-form/delivery-category-form.component';
import { DeliveryCategoryListComponent } from './masters/deliveryCategory/delivery-category-list/delivery-category-list.component';
import { RoleFormComponent } from './admin/role/role-form/role-form.component';
import { RoleListComponent } from './admin/role/role-list/role-list.component';
import { IncomingBoxComponent } from './transaction/secondClass/incoming-box/incoming-box.component';
import { AppComponent } from './app.component';
import { IncomingJobPlannerComponent } from './transaction/secondClass/incoming-job-planner/incoming-job-planner.component';
import { DocumentFormComponent } from './masters/document/document-form/document-form.component';
import { DocumentListComponent } from './masters/document/document-list/document-list.component';
import { MagazineFormComponent } from './masters/magazine/magazine-form/magazine-form.component';
import { MagazineListComponent } from './masters/magazine/magazine-list/magazine-list.component';
import { DetailedBookingComponent } from './transaction/booking/detailed-booking/detailed-booking.component';
import { BookingInfoComponent } from './transaction/booking/bookingInfo/booking-info.component';
import { BookingListComponent } from './transaction/booking/bookingList/booking-list.component';
import { OutgoingPacketManifestFormComponent } from './transaction/outgoing-manifest/outgoing-packet-manifest-form/outgoing-packet-manifest-form.component';
import { AgentDeliveryComponent } from './transaction/agent-delivery/agent-delivery-form/agent-delivery.component';
import { AgentDelvListComponent } from './transaction/agent-delivery/agent-delv-list/agent-delv-list.component';
import { OutgoingPacketManifestListComponent } from './transaction/outgoing-manifest/outgoing-packet-manifest-list/outgoing-packet-manifest-list.component';
import { ConsignmentTrackingComponent } from './transaction/tracking/consignment-tracking/consignment-tracking.component';
import { PodListComponent } from './transaction/pod/pod-list/pod-list.component';
import { PodFormComponent } from './transaction/pod/pod-form/pod-form.component';
import { AgentMasterFormComponent } from './masters/agent/agent-master-form/agent-master-form.component';
import { ExpensesFormComponent } from './masters/expenses/expenses-form/expenses-form.component';
import { ExpenseComponent } from './transaction/expense/expense.component';
import { SplCustFormComponent } from './transaction/specialCustomers/spl-cust-form/spl-cust-form.component';
import { SplCustListComponent } from './transaction/specialCustomers/spl-cust-list/spl-cust-list.component';
import { SplCustDetailBookingComponent } from './transaction/specialCustomers/spl-cust-detail-booking/spl-cust-detail-booking.component';
import { AgentMasterListComponent } from './masters/agent/agent-master-list/agent-master-list.component';
import { FailedConsignmentHandlingComponent } from './transaction/failed-consignment-handling/failed-consignment-handling.component';
import { ReBookingConsignmentsComponent } from './transaction/reBookingConsignments/re-booking-consignments/re-booking-consignments.component';
import { MisRoutedComponent } from './transaction/mis-routed/mis-routed.component';
import { AllReportsComponent } from './reports/all-reports/all-reports.component';
import { TrackingBulkComponent } from './transaction/tracking/tracking-bulk/tracking-bulk.component';
import { ScanningManifestsComponent } from './transaction/secondClass/scanning-manifests/scanning-manifests.component';
import { InscanFormComponent } from './transaction/secondClass/inscan-form/inscan-form.component';
import { ChangeVendorsComponent } from './transaction/agent-delivery/change-vendors/change-vendors.component';
import { SpecialConsigneeComponent } from './masters/specialConsignee/special-consignee/special-consignee.component';
import { PodDetailsViewComponent } from './transaction/pod/pod-details-view/pod-details-view.component';

const routes: Routes = [
  { path: 'customer_list', component: CustomerListComponent, canActivate: [AuthGuard] },
  { path: 'customer_form', component: CustomerFormComponent, canActivate: [AuthGuard] },
  { path: 'ModeForm', component: ModeFormComponent, canActivate: [AuthGuard] },
  { path: 'ModeList', component: ModeListComponent, canActivate: [AuthGuard] },
  { path: 'OfficeList', component: OfficeListComponent, canActivate: [AuthGuard] },
  { path: 'OfficeForm', component: OfficeFormComponent, canActivate: [AuthGuard] },
  { path: 'AjwCityList', component: AjwCityListComponent, canActivate: [AuthGuard] },
  { path: 'AjwCityForm', component: AjwCityFormComponent, canActivate: [AuthGuard] },
  { path: 'ZoneList', component: ZoneListComponent, canActivate: [AuthGuard] },
  { path: 'ZoneForm', component: ZoneFormComponent, canActivate: [AuthGuard] },
  { path: 'bookIssueForm', component: BookIssueFormComponent, canActivate: [AuthGuard] },
  { path: 'bookIssueList', component: BookIssueListComponent, canActivate: [AuthGuard] },
  { path: 'pincodeList', component: PincodeListComponent, canActivate: [AuthGuard] },
  { path: 'pincodeForm', component: PincodeFormComponent, canActivate: [AuthGuard] },
  { path: 'pincodeServiceForm', component: PinCodeServiceFormComponent, canActivate: [AuthGuard] },
  { path: 'pincodeServiceList', component: PinCodeServiceListComponent, canActivate: [AuthGuard] },
  { path: 'pincodeRateMasterList', component: PincodeRateMasterListComponent, canActivate: [AuthGuard] },
  { path: 'pincodeRateMasterForm', component: PincodeRateMasterFormComponent, canActivate: [AuthGuard] },
  { path: 'CodeGenForm', component: CodeGenFormComponent, canActivate: [AuthGuard] },
  { path: 'currencyList', component: CurrencyListComponent, canActivate: [AuthGuard] },
  { path: 'currencyForm', component: CurrencyFormComponent, canActivate: [AuthGuard] },
  { path: 'CodeGenList', component: CodeGenListComponent, canActivate: [AuthGuard] },
  { path: 'stateForm', component: StateFormComponent, canActivate: [AuthGuard] },
  { path: 'stateList', component: StateListComponent, canActivate: [AuthGuard] },
  { path: 'CodeGenList', component: CodeGenListComponent, canActivate: [AuthGuard] },
  { path: 'ShipperForm', component: ShipperFormComponent, canActivate: [AuthGuard] },
  { path: 'ShipperList', component: ShipperListComponent, canActivate: [AuthGuard] },
  { path: 'EmailForm', component: EmailFormComponent, canActivate: [AuthGuard] },
  { path: 'EmailList', component: EmailListComponent, canActivate: [AuthGuard] },
  { path: 'ColoaderForm', component: ColoaderFormComponent, canActivate: [AuthGuard] },
  { path: 'ColoaderList', component: ColoaderListComponent, canActivate: [AuthGuard] },
  { path: 'employeeList', component: EmployeeListComponent, canActivate: [AuthGuard] },
  { path: 'employeeForm', component: EmployeeFormComponent, canActivate: [AuthGuard] },
  { path: 'coloaderRateForm', component: ColoaderRateFormComponent, canActivate: [AuthGuard] },
  { path: 'coloaderRateList', component: ColoaderRateListComponent, canActivate: [AuthGuard] },
  { path: 'Login', component: LoginComponent },
  { path: '', component: LoginComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'companyForm', component: CompanyFormComponent, canActivate: [AuthGuard] },
  { path: 'companyList', component: CompanyListComponent, canActivate: [AuthGuard] },
  { path: 'AppNav', component: AppNavComponent, canActivate: [AuthGuard] },
  { path: 'AppDashboard', component: AppDashboardComponent, canActivate: [AuthGuard] },
  { path: 'userForm', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'userList', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'RoleForm', component: RoleFormComponent, canActivate: [AuthGuard] },
  { path: 'RoleList', component: RoleListComponent, canActivate: [AuthGuard] },
  { path: 'deliveryCategoryForm', component: DeliveryCategoryFormComponent, canActivate: [AuthGuard] },
  { path: 'deliveryCategoryList', component: DeliveryCategoryListComponent, canActivate: [AuthGuard] },
  { path: 'incomeLoad', component: IncomingLoadComponent, canActivate: [AuthGuard] },
  { path: 'incomeView', component: IncomingViewComponent, canActivate: [AuthGuard] },
  { path: 'newIncomeLoad', component: IncomingNewComponent, canActivate: [AuthGuard] },
  { path: 'boxDetails', component: IncomingBoxComponent, canActivate: [AuthGuard] },
  { path: 'jobPlanner', component: IncomingJobPlannerComponent, canActivate: [AuthGuard] },
  { path: 'App', component: AppComponent },
  { path: 'DocumentForm', component: DocumentFormComponent, canActivate: [AuthGuard] },
  { path: 'DocumentList', component: DocumentListComponent, canActivate: [AuthGuard] }, 
  { path: 'MagazineForm', component: MagazineFormComponent, canActivate: [AuthGuard] },
  { path: 'MagazineList', component: MagazineListComponent, canActivate: [AuthGuard] },
  { path: 'detailedBooking', component: DetailedBookingComponent, canActivate: [AuthGuard] },
  { path: 'booking', component: BookingInfoComponent, canActivate: [AuthGuard] },
  { path: 'bookedDetails', component: BookingListComponent, canActivate: [AuthGuard] },
  { path: 'outgoingPacketManifestForm', component: OutgoingPacketManifestFormComponent, canActivate: [AuthGuard] },
  { path: 'agentDeliveryForm', component: AgentDeliveryComponent, canActivate: [AuthGuard] },
  { path: 'agentDelivery', component: AgentDelvListComponent, canActivate: [AuthGuard] },
  { path: 'outgoingPacketManifestList', component: OutgoingPacketManifestListComponent, canActivate: [AuthGuard] },
  { path: 'consignmentTracking', component: ConsignmentTrackingComponent, canActivate: [AuthGuard] },
  { path: 'singlePOD', component: PodListComponent, canActivate: [AuthGuard] },
  { path: 'podManifest', component: PodFormComponent, canActivate: [AuthGuard] },
  { path: 'agentMasterForm', component: AgentMasterFormComponent, canActivate: [AuthGuard] },
  { path: 'agentMasterList', component: AgentMasterListComponent, canActivate: [AuthGuard] },
  { path: 'expenseForm', component: ExpensesFormComponent, canActivate: [AuthGuard] },
  { path: 'expenseDetails', component: ExpenseComponent, canActivate: [AuthGuard] },
  { path: 'specialCustomerList', component: SplCustListComponent, canActivate: [AuthGuard] },
  { path: 'specialCustomerForm', component: SplCustFormComponent, canActivate: [AuthGuard] },
  { path: 'specialCustomerBooking', component: SplCustDetailBookingComponent, canActivate: [AuthGuard] },
  { path: 'failedCnnoHandling', component: FailedConsignmentHandlingComponent, canActivate: [AuthGuard] },
  { path: 'reBookingConsignments', component: ReBookingConsignmentsComponent, canActivate: [AuthGuard] },
  { path: 'misRouted', component: MisRoutedComponent, canActivate: [AuthGuard] },
  { path: 'allReports', component: AllReportsComponent, canActivate: [AuthGuard] },
  { path: 'trackBulk', component: TrackingBulkComponent, canActivate: [AuthGuard] },
  { path: 'inscanManifests', component: ScanningManifestsComponent, canActivate: [AuthGuard] },
  { path: 'inscanForm', component: InscanFormComponent, canActivate: [AuthGuard] },
  { path: 'changeVendor', component: ChangeVendorsComponent, canActivate: [AuthGuard] },
  { path: 'specialConsignee', component: SpecialConsigneeComponent , canActivate: [AuthGuard] },
  { path: 'podListViews', component: PodDetailsViewComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true }), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
