import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Globals } from '../../../global';
import { SpecialCustomers } from '../specialCustomers';
import { JobPlannerService } from '../../../services/Transactions/jobPlannerService/job-planner.service';
import { PincodeRateMasterService } from '../../../services/Master/pincodeRateMasterService/pincode-rate-master.service';
import { BookingDetailsService } from '../../../services/Transactions/bookingDetailsService/booking-details.service';
import { DeliveryCategoryService } from '../../../services/Master/deliveryCategoryService/delivery-category.service';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { CustomerService } from '../../../services/Master/customerService/customer.service';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { MatSnackBar } from '@angular/material';
import { SpecialBookingsService } from '../../../services/Transactions/specialCustomers/special-bookings.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { Details } from '../../booking/detailed-booking/details';

@Component({
  selector: 'app-spl-cust-form',
  templateUrl: './spl-cust-form.component.html',
  styleUrls: ['./spl-cust-form.component.scss']
})
export class SplCustFormComponent implements OnInit {

  @ViewChild("cnNO") nameField1: ElementRef;

  specialCustForm: FormGroup;
  dispSec: boolean = false;
  isSave: boolean = true;
  customers: SpecialCustomers = new SpecialCustomers();
  postalList: any[];
  deliveryCatList: any[];
  officeBranchList: any[];
  customerList: any[];
  runNoList: any[];
  customerType: any[];
  hawnNoList: any[];
  bookingDetails: any[];
  editable: Boolean = false;
  userInfo: any;
  secondaryFlag: Boolean = true;
  details: Details = new Details();

  constructor(private fb: FormBuilder, private globals: Globals,
    private pincodeRate: PincodeRateMasterService,
    private delCatService: DeliveryCategoryService,
    private officeService: OfficeService,
    private customerService: CustomerService,
    private jobPlnrService: JobPlannerService,
    private bookingService: BookingDetailsService,
    private _route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private route: Router,
    private incomeService: IncomeLoadService,
    private router: Router,
    private openDialogBoxService: OpenDialogBoxService,
    private specialBookService: SpecialBookingsService) {

    this.specialCustForm = this.fb.group({
      'id': '',
      'branchId': [null],
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
      'domesticRef': [null],
      'specialBookingMF': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.globals.role = 'Special Customers Booking';
    this.bookingDetails = [{}];
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    let currentUser = this.userInfo;
    let roles = currentUser.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    currentUser.isHO = roles == '9' ? true : false;
    if (this._route.snapshot.queryParams.Id) {
      let id = this._route.snapshot.queryParams.Id;
      this.isSave = false;
      this.editable = true;
      this.specialBookService.getSpecialBookingInfo(id).then(res => {
        let data = res['data'][0];
        this.specialCustForm.patchValue({
          id: id,
          branchId: data.branchId,
          custType: data.custType,
          consigneeCode: data.consigneeCode,
          customerId: data.customerId,
          bookingMF: data.bookingMF,
          refMF: data.refMF,
          bookingType: data.bookingType,
          cartonWT: data.cartonWT,
          secDeliveryCat: data.secDeliveryCat,
          secHAWB: data.secHAWB,
          secLandedWtKGs: data.secLandedWtKGs,
          secMawbno: data.secMawbno,
          secRunno: data.secRunno,
          postalCode: data.postalCode,
          mfDate: data.mfDate,
          mfTime: data.mfTime,
          domesticRef: data.domesticRef,
          cnNO: data.cnNO,
          specialBookingMF: data.specialBookingMF
        });
        this.bookingTypeChange();
        if (data.secRunno) {
          this.jobPlnrService.getIncomeDetailsByRunNo(data.secRunno)
            .then(res => {
              this.hawnNoList = res;
            }, err => { throw err; });
        }
      }, err => { throw err; });
    }

    this.pincodeRate.getRateMasterCode().then(res => {
      this.postalList = res;
    }, err => { throw err });

    this.delCatService.getDeliveryCategoryDetails().then(res => {
      this.deliveryCatList = res;
    }, err => { throw err });

    this.officeService.getOfficeDetails().then(res => {
      this.officeBranchList = res;
    }, err => { throw err; });

    this.customerService.getCustomerDetails().then(res => {
      this.customerList = res;
    }, err => { throw err; });

    this.incomeService.getIncomingBranchWise(currentUser).subscribe((res) => {
      this.runNoList = res;
    }, err => { throw err; });

    this.customerService.getCustomerTypes().subscribe(res => {
      this.customerType = res;
    }, err => { throw err; });

    let d = new Date();// set Current Date & Time
    let mm = d.getMonth() + 1;
    let dd = d.getDate();
    let yyyy = d.getFullYear();
    let HH = d.getHours();
    let MM = d.getMinutes();
    let SS = d.getSeconds();
    let date = dd + '/' + mm + '/' + yyyy;
    let time = HH + ':' + MM + ':' + SS;
    this.specialCustForm.patchValue({
      mfDate1: date,
      mfTime1: time
    });

  }

  get f() { //Get form controls
    return this.specialCustForm.controls;
  }

  bookingTypeChange() {   //Radio Change
    let obj = Object.assign({}, this.customers, this.specialCustForm.value);
    if (obj.bookingType == "Secondary") {
      this.dispSec = true;
    } else {
      this.dispSec = false;
    }
    this.statusValid();
  }

  customSearchBranch(term: string, item: any) { // Branch Custom Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  runNOSearchBranch(term: string, item: any) { // Branch Custom Search
    term = term.toLocaleLowerCase();
    return item.secRunno.toLocaleLowerCase().indexOf(term) > -1 || item.secMawbno.toLocaleLowerCase().indexOf(term) > -1;
  }

  hawnNoSearch(term: string, item: any) { // HAWN No Search
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

  getRunNo() { // selected runNo
    let val = this.specialCustForm.value.secRunno;
    this.specialCustForm.value.secMawbno = "";
    var filteredObj = this.runNoList.find(function (item) {
      if (item.secRunno === val) { return item; }
    });

    this.jobPlnrService.getNotUsedRunList(val).then(res => {
      this.hawnNoList = res;
    }, err => { throw err; });

    this.specialCustForm.patchValue({
      secMawbno: filteredObj.secMawbno,
      secDeliveryCat: filteredObj.secDeliveryCat
    });
    this.statusValid();
  }

  getHawnNo() { // Selected HAWN No
    let val = this.specialCustForm.value.secHAWB;
    let filteredObj = this.hawnNoList.find(function (item) {
      if (item.secHAWB === val) { return item; }
    });
    this.specialCustForm.patchValue({ secLandedWtKGs: filteredObj.secLandedWtKGs });
    this.statusValid();
  }

  save() {
    let obj = Object.assign({}, this.customers, this.specialCustForm.value);
    obj.createdBranchId = this.userInfo.branchId;
    if(obj.bookingType == 'Domestic'){
      obj.refMF = obj.domesticRef;
    }
    if (this.isSave) {
      this.specialBookService.addSpecialBookings(obj).subscribe(res => {
        if (res.status == 200) {
          this.openSnackBar("Saved Successfully!", "Success");
          this.route.navigate(['/specialCustomerBooking'], { queryParams: { Id: res.data[0][""] } });
        }
      }, err => { throw err; });
    } else {
      this.bookingService.updateBooking(obj).subscribe(res => {  // update func()
        this.openSnackBar("Updated Successfully!", "Success");
        this.route.navigateByUrl('/specialCustomerList');
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

  cnnoExists: Boolean;
  isCNNO() { // Is CNNO or Check duplicate..
    let cnNO = this.specialCustForm.value.specialBookingMF;
    if (cnNO.length > 3) {
      this.checkCNNO();
      this.bookingService.isCnNO(cnNO).then(res => {
        let flag = res[0][""];
        if (flag == '0') {
          this.cnnoExists = false;
        } else {
          this.cnnoExists = true;
        }
      }, err => { throw err; });
    }
  }

  checkCNNOList: any[];
  cnnoFlag = true;
  checkCNNO() {
    let Info = [];
    Info[0] = { cnNo: this.specialCustForm.value.specialBookingMF };
    // this.bookingService.checkCNNO(Info[0]).subscribe(res => {
    this.specialBookService.isSpecialookingMF_bookedCNNO(Info[0]).subscribe(res => {
      this.checkCNNOList = res;
      if (this.checkCNNOList.length <= 0) {
        this.cnnoFlag = true;
      } else {
        this.cnnoFlag = false;
      }
    }, err => { throw err; })
  }

  getCustomersByType() { //Customers details by type
    this.specialCustForm.get('customerId').reset();
    let type = this.specialCustForm.value.custType;
    this.customerService.getCustomerDetailsByType(type).then(res => {
      this.customerList = res;
    }, err => { throw err; });
  }

  back() {
    if (this.specialCustForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/specialCustomerList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/specialCustomerList');
    }
  }

  statusValid() { //If Secondary Booking - Feilds Validations 
    let obj = Object.assign({}, this.specialCustForm.value);
    let type = obj.bookingType; 
    console.log(this.specialCustForm.status);
    console.log(this.specialCustForm.value);
    if (type == "Secondary") {
      if(obj.secRunno == null || obj.secMawbno == null || obj.secHAWB == null || obj.secDeliveryCat == null || obj.secLandedWtKGs == null || obj.secRunno == "" || obj.secMawbno == "" || obj.secHAWB == "" || obj.secDeliveryCat == "") {
        this.secondaryFlag = true;
      }else{
        this.secondaryFlag = false;
      }
    }else{
      if(obj.domesticRef == null || obj.domesticRef == ''){
        this.secondaryFlag = true;    
      }else{
        this.secondaryFlag = false;
      }
    }
  }

}
