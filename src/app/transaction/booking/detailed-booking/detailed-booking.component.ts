import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { CustomerService } from '../../../services/Master/customerService/customer.service';
import { CityService } from '../../../services/Master/cityService/city.service';
import { DocumentMagazineService } from '../../../services/Master/documentMagazineService/document-magazine.service';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobPlannerService } from '../../../services/Transactions/jobPlannerService/job-planner.service';
import { PincodeRateMasterService } from '../../../services/Master/pincodeRateMasterService/pincode-rate-master.service';
import { ModeService } from '../../../services/Master/modeService/mode.service';
import { ConsignServiceService } from '../../../services/Master/consignService/consign-service.service';
import { BookingDetailsService } from '../../../services/Transactions/bookingDetailsService/booking-details.service';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { MatDialog } from '@angular/material';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { DeliveryCategoryService } from '../../../services/Master/deliveryCategoryService/delivery-category.service';
import { Details } from './details';

@Component({
  selector: 'app-detailed-booking',
  templateUrl: './detailed-booking.component.html',
  styleUrls: ['./detailed-booking.component.scss']
})
export class DetailedBookingComponent implements OnInit {

  officeBranchList: any[];
  customerList: any[];
  customerType: any[];
  isSave: boolean = true;
  formData: any[];
  runNoList: any[];
  bookingForm: FormGroup;
  hawnNoList: any[];
  deliveryCatList: any[];
  postalList: any[];
  details: Details = new Details();
  dispSec: boolean = false;
  bookID: any;
  secondaryFlag: Boolean = true;
  userInfo: any;

  constructor(private globals: Globals, 
    private officeService: OfficeService, 
    public dialog: MatDialog,
    private customerService: CustomerService, 
    private snackBar: MatSnackBar,
    private bookingService: BookingDetailsService,
    private route: Router,
    private incomeService: IncomeLoadService, 
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private jobPlnrService: JobPlannerService,
    private pincodeRate: PincodeRateMasterService, 
    private delCatService: DeliveryCategoryService) {

    this.bookingForm = this.fb.group({
      'id': '',
      'custType': [null, Validators.compose([Validators.required])],
      'customerId': [null, Validators.compose([Validators.required])],
      'consigneeCode': [null],
      'bookingMF': [null],
      'refMF': [null],
      'mfDate1': [null],
      'mfTime1': [null],
      'mfDate': [null],
      'mfTime': [null],
      'bookingType': [null, Validators.compose([Validators.required])],
      'cartonWT': [null],
      'secRunno': [null],
      'secMawbno': [null],
      'secHAWB': [null],
      'secDeliveryCat': [null],
      'secLandedWtKGs': [null],
      'domesticRef': [null]
    });
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    const currentUser = this.userInfo;
    const roles = currentUser.roleId.find(element => {
      if (element == '9') { return element; } // HO RoleId is '9'..
    });
    currentUser.isHO = roles == '9' ? true : false;
    this.globals.role = 'Booking';
    if (this._route.snapshot.queryParams.Id) {
      const id = this._route.snapshot.queryParams.Id;
      this.isSave = false;
      this.bookingService.getBookingInfoByID(id).then(res => {
        this.bookingForm.patchValue({
          id: id,
          custType: res[0].custType,
          consigneeCode: res[0].consigneeCode,
          customerId: res[0].customerId,
          bookingMF: res[0].bookingMF,
          refMF: res[0].refMF,
          bookingType: res[0].bookingType,
          cartonWT: res[0].cartonWT,
          secDeliveryCat: res[0].secDeliveryCat,
          secHAWB: res[0].secHAWB,
          secLandedWtKGs: res[0].secLandedWtKGs,
          secMawbno: res[0].secMawbno,
          secRunno: res[0].secRunno,
          postalCode: res[0].postalCode,
          mfDate: res[0].mfDate,
          mfTime: res[0].mfTime,
          domesticRef: res[0].domesticRef
        });
        this.bookingTypeChange();
        if (res[0].secRunno) {
          this.jobPlnrService.getNotUsedRunList(res[0].secRunno).then(res => {
            this.hawnNoList = res;
          }, err => { throw err; });
        }
      }, err => { throw err; });
    }

    this.pincodeRate.getRateMasterCode().then(res => {
      this.postalList = res;
    }, err => { throw err; });

    this.delCatService.getDeliveryCategoryDetails().then(res => {
      this.deliveryCatList = res;
    }, err => { throw err; });

    this.officeService.getOfficeDetails().then(res => {
      this.officeBranchList = res;
    }, err => { throw err; });

    this.incomeService.getIncomingBranchWise(currentUser).subscribe((res) => {
      this.runNoList = res;
    }, err => { throw err; });

    this.customerService.getCustomerTypes().subscribe(res => {
      this.customerType = res;
    }, err => { throw err; });

    this.customerService.getCustomerDetails().then(res => {
      this.customerList = res;
    }, err => { throw err; });

    // set Current Date & Time
    const d = new Date();
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    const yyyy = d.getFullYear();
    const HH = d.getHours();
    const MM = d.getMinutes();
    const SS = d.getSeconds();
    const date = dd + '/' + mm + '/' + yyyy;
    const time = HH + ':' + MM + ':' + SS;
    this.bookingForm.patchValue({
      mfDate1: date,
      mfTime1: time
    });
  }

  get f() {
    return this.bookingForm.controls;
  }

  customSearchBranch(term: string, item: any) { // Branch Custom Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  runNOSearchBranch(term: string, item: any) { // Branch Custom Search
    term = term.toLocaleLowerCase();
    return item.secRunno.toLocaleLowerCase().indexOf(term) > -1 || item.secMawbno.toLocaleLowerCase().indexOf(term) > -1;
  }

  hawnNoSearch(term: string, item: any) {  // HAWN No Search
    term = term.toLocaleLowerCase();
    return item.secHAWB.toLocaleLowerCase().indexOf(term) > -1 || item.secLandedWtKGs.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchDelCateg(term: string, item: any) { // Category Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  CustomSearchCustomer(term: string, item: any) { // Cutomer Custom Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  CustomerTypeSearch(term: string, item: any) { // Customer Search
    term = term.toLocaleLowerCase();
    return item.type.toLocaleLowerCase().indexOf(term) > -1;
  }

  save() { // Save Form
    const obj = Object.assign({}, this.details, this.bookingForm.value);
    obj.createdBranchId = this.userInfo.branchId;
    obj.createdBy = this.userInfo.userName;
    obj.updatedBy = this.userInfo.userName;
    if (obj.bookingType == 'Domestic') {
      obj.refMF = obj.domesticRef;
    }
    if (this.isSave) {
      this.bookingService.addBookingDetails(obj).subscribe(res => { // Save func()
        if (res.id) {
          this.route.navigate(['/booking'], { queryParams: { Id: res.id } });
        }
      }, err => { throw err; });
    } else {
      this.bookingService.updateBooking(obj).subscribe(res => {  // update func()
        this.openSnackBar('Updated Successfully!', 'Success');
        this.route.navigateByUrl('/bookedDetails');
      }, err => { throw err; });
    }
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "Success") {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }

  getRunNo() { // selected runNo
    let val = this.bookingForm.value.secRunno;
    // this.bookingForm.get('secMawbno').reset();
    this.bookingForm.get('secHAWB').reset();
    this.bookingForm.get('secDeliveryCat').reset();
    this.bookingForm.get('secLandedWtKGs').reset();
    var filteredObj = this.runNoList.find(function (item) {
      if (item.secRunno === val) { return item; }
    });
    if(val){
      this.jobPlnrService.getNotUsedRunList(val).then( res => {
        this.hawnNoList = res;
      }, err => { throw err; });
    }
    this.bookingForm.patchValue({
      secMawbno: filteredObj.secMawbno,
      secDeliveryCat: filteredObj.secDeliveryCat
    });
    this.statusValid();
    this.getCategoryByRun();
  }

  getHawnNo() { // Selected HAWN No
    const val = this.bookingForm.value.secHAWB;
    const filteredObj = this.hawnNoList.find(function (item) {
      if (item.secHAWB === val) { return item; }
    });
    this.bookingForm.patchValue({ secLandedWtKGs: filteredObj.secLandedWtKGs, secDeliveryCat: filteredObj.secDeliveryCat });
    this.statusValid();
  }

  back(id) { // Cancel Action
    if (this.bookingForm.dirty) {
      const dialogRef = this.openDialog('You may lost the data?');
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.route.navigateByUrl('/bookedDetails');
        }
      }, err => { throw err; });
    } else {
      this.route.navigateByUrl('/bookedDetails');
    }
  }

  openDialog(title: string) { // Delete Confirmation
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: title };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  bookingTypeChange() {  // Radio Change
    const obj = Object.assign({}, this.details, this.bookingForm.value);
    const type = obj.bookingType;
    if (type == 'Secondary') {
      this.dispSec = true;
    } else {
      this.dispSec = false;
    }
    this.statusValid();
  }

  getCustomersByType() { // Customers details by type
    this.bookingForm.get('customerId').reset();
    const type = this.bookingForm.value.custType;
    if (type) {
      this.customerService.getCustomerDetailsByType(type).then(res => {
        this.customerList = res;
      }, err => { throw err; });
    }
  }

  statusValid() { // If Secondary Booking - Feilds Validations 
    const obj = Object.assign({}, this.details, this.bookingForm.value);
    const type = obj.bookingType;
    if (type == 'Secondary') {
      if (obj.secRunno == null || obj.secMawbno == null || obj.secHAWB == null ||
        obj.secDeliveryCat == null || obj.secLandedWtKGs == null || obj.secRunno == ''
        || obj.secMawbno == '' || obj.secHAWB == '' || obj.secDeliveryCat == '') {
        this.secondaryFlag = true;
      } else {
        this.secondaryFlag = false;
      }
    } else {
      // if (obj.domesticRef == null || obj.domesticRef == '') {
        this.secondaryFlag = false;
      // } else {
      //   this.secondaryFlag = false;
      // }
    }
    console.log(this.bookingForm.status);
  }

  getCategoryByRun() {
    let runNo = this.bookingForm.value.secRunno;
    this.incomeService.getDeliveryCategoryByRunNo(runNo).subscribe(res => {
      if(res.statusBool == 200){
        console.log(res.data);
        this.deliveryCatList = res.data;
      }
    });
  }

}




