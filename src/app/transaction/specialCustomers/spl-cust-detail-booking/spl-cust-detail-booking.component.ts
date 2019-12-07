import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../../global';
import { BookingDetailsService } from '../../../services/Transactions/bookingDetailsService/booking-details.service';
import { JobPlannerService } from '../../../services/Transactions/jobPlannerService/job-planner.service';
import { PincodeRateMasterService } from '../../../services/Master/pincodeRateMasterService/pincode-rate-master.service';
import { PincodeService } from '../../../services/Master/pincodeService/pincode.service';
import { ModeService } from '../../../services/Master/modeService/mode.service';
import { ConsignServiceService } from '../../../services/Master/consignService/consign-service.service';
import { DocumentMagazineService } from '../../../services/Master/documentMagazineService/document-magazine.service';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { pdfDocService } from '../../../services/Master/pdfDocService/pdfDoc.service';
import { BookIssueService } from '../../../services/Master/bookIssueService/book-issue.service';
import { UserService } from '../../../services/users/users.service';
import { AuthService } from '../../../login/auth.service';
import { BarcodeService } from '../../../services/sharedServices/barcodeService/barcode.service';
import { SpecialBooking } from './specialBooking';
import { ExpensesService } from '../../../services/Master/expensesService/expenses.service';
import { SpecialBookingsService } from '../../../services/Transactions/specialCustomers/special-bookings.service';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { DialogOverviewExampleDialog } from '../../booking/bookingInfo/booking-info.component';
import { IssueDialogComponent } from '../../booking/bookingInfo/booking-info.component';
import { ColoaderService } from '../../../services/Master/coloaderService/coloader.service';
import { PincodeServiceService } from '../../../services/Master/pincodeServiceService/pincode-service.service';
import { ShipperService } from '../../../services/Master/shipperService/shipper.service';
import { CityService } from '../../../services/Master/cityService/city.service';

export interface DialogData {
  type: string;
  magazineId: string;
  docType: string;
}

@Component({
  selector: 'app-spl-cust-detail-booking',
  templateUrl: './spl-cust-detail-booking.component.html',
  styleUrls: ['./spl-cust-detail-booking.component.scss']
})
export class SplCustDetailBookingComponent implements OnInit {

  @ViewChild("cnNO") nameField: ElementRef;

  specialBookings: SpecialBooking = new SpecialBooking();
  specialBookingForm: FormGroup;
  bookingInfo: any[];
  barcode: any[];
  cityList: any[];
  docsList: any[];
  checkCNNOList: any[];
  magazineList: any[];
  runNoList: any[];
  incomingJobList: any[];
  pinRateList: any[];
  modeList: any[];
  consigneeList: any[];
  consignorList: any[];
  bookedDetails: any[];
  bookedDetailsForReport: any[];
  docTypeList: any[];
  pcsList: any[];
  issueList: any[];
  podStatus: Boolean = false;
  vendorsList: any[];
  listOfExpenses: any[];
  postalList: any[];
  calcMethods: any[];
  secHawnNo: number;
  BDPostalRates: any[];
  postalType: boolean = false;
  amountAuto: boolean = true;
  landedWeight: any;
  bookedWeight: any;
  bookedTotAmount: any;
  isSave: Boolean = true;
  officeBranchList: any[];
  isDocument: boolean = false;
  isDomestic: Boolean;
  coloaders: any[];
  userInfo: any;
  canEditFailureBooking: Boolean;
  id: number;
  shipperList: any[];
  tempVendorList: any[];
  cityCodes: any[];

  constructor(private fb: FormBuilder,
    private globals: Globals,
    private _route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentMagazineService,
    private modeService: ModeService,
    public dialog: MatDialog,
    private incomeService: IncomeLoadService,
    private bookingService: BookingDetailsService,
    private userService: UserService,
    private consignService: ConsignServiceService,
    private authService: AuthService,
    private pdfService: pdfDocService,
    private bookIssueService: BookIssueService,
    private pincodeRate: PincodeRateMasterService,
    private pincodes: PincodeService,
    private barcodeService: BarcodeService,
    private expenseService: ExpensesService,
    private spclBookingService: SpecialBookingsService,
    private jobPlnrService: JobPlannerService,
    private snackBar: MatSnackBar,
    private officeService: OfficeService,
    private shipperService: ShipperService,
    private pincodeServiceable: PincodeServiceService,
    private cityService: CityService,
    private coloaderService: ColoaderService) {
    this.specialBookingForm = this.fb.group({
      'id': '',
      'cnNO': [null, Validators.compose([Validators.required])],
      'refNo': [null],
      'branchId': [null],
      'boxPcsId': [null],
      'pcsWt': [null],
      'pincodeId': [null, Validators.compose([Validators.required])],
      'modeId': [null],
      'modeName': [null],
      'docType': [null],
      'magazineId': [null],
      'invoiceNo': [null],
      'issueNo': [null],
      'consigneeID': [null, Validators.compose([Validators.required])],
      'consignorID': [null],
      'estimatedAmount': [null, Validators.compose([Validators.required])],
      'noOfPcs': [null, Validators.compose([Validators.required])],
      'pcsWtKgs': [null, Validators.compose([Validators.required])],
      'cityCode': [null, Validators.compose([Validators.required])],
      'toPay': [null],
      'postalCode': [null],
      'ifPostal': [null],
      'calcType': [null],
      'coloaderID': [null],
      'shipperID': [null],
      'shipperID1': [null],
    });
  }

  ngOnInit() {
    this.globals.role = 'Special Bookings';
    let cnNO: number;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userInfo = currentUser;
    let roles = currentUser.roleId.find(element => {
      if (element == '9') return element; //HO RoleId is '9'..
    });
    currentUser.isHO = roles == '9' ? true : false;
    if (this._route.snapshot.queryParams.Id) {
      let id = this._route.snapshot.queryParams.Id
      this.barcodeService.generateBarcode(id).subscribe(res => {
        this.barcode = res;
      })
      this.bookingService.getBookingInfoByID(id).then(res => {
        this.bookingInfo = res;
        console.log(this.bookingInfo);
        this.specialBookingForm.patchValue({
          shipperID: res[0]['secShipper'],
          shipperID1: res[0]['secShipper']
        });
        this.bookingInfo[0].bookingID = id;
        this.id = id;
        this.secHawnNo = res[0].secHAWB;
        if (this.secHawnNo) {
          this.jobPlnrService.getLandedWtByHAWN(this.secHawnNo).then(res => {
            this.landedWeight = res[0]['landedWeight'];
          }, err => { throw err; });
          this.bookingService.getPcsListByHawnNo(this.secHawnNo).then(res => {
            this.pcsList = res;
          }, err => { throw err; });
        }
        if (res[0]['bookingType'] == "Secondary") {
          this.isDomestic = false;
          this.getConsignDetails();
        } else {
          this.isDomestic = true;
          this.getConsignDetails();
        }
      }, err => { console.log(err); });

      this.bookingService.getBookingDetailsByID(id).then(res => {
        this.bookedDetails = res;
        let wt: number = 0;
        let totAmt: number = 0;
        this.bookedDetails.forEach(element => {
          wt = wt + element.pcsWtKgs;
          totAmt = totAmt + parseFloat(element.estimatedAmount);
        });
        this.bookedWeight = wt.toFixed(2);
        this.bookedTotAmount = totAmt.toFixed(2);
      }, err => { throw err; });

      this.specialBookingForm.patchValue({ bookingID: id });
      this.specialBookings.bookingID = id;
      this.bookingService.getBookingInfoByID(id).then(res => {
        this.bookingInfo = res;
        this.bookingInfo[0]['cnNO'] = cnNO;
        this.secHawnNo = res[0].secHAWB;
        this.landedWeight = res[0].secLandedWtKGs;
        this.fetchRecords();
      }, err => { throw err; });

      this.postalList = [{ 'id': '1', 'type': 'URP' }, { 'id': '2', 'type': 'BD' }];
      this.calcMethods = [{ 'id': '1', 'type': 'Manual' }, { 'id': '2', 'type': 'Auto' }];
    }

    this.documentService.getDocumentDetails().then(res => {
      this.docTypeList = res;
    }, err => { throw err; });

    // this.pincodes.getPinListDetails().subscribe(res => {
    //   if (res.status == 200) {
    //     this.cityList = res.data;
    //   }
    // }, err => { throw err; });

    this.cityService.getCityDetails().then(res => {
      this.cityCodes = res;
    })

    this.documentService.getDocumentDetails().then(res => {
      this.docsList = res;
    }, err => { throw err; });

    this.documentService.getMagazineDetails().then(res => {
      this.magazineList = res;
    }, err => { throw err; });

    this.pincodeRate.getPincodeRateMasterDetails().then(res => {
      this.pinRateList = res;
    }, err => { throw err; });

    this.modeService.getModeDetails().then(res => {
      this.modeList = res;
    }, err => { throw err; });

    this.bookIssueService.getBookIssueDetails().then(res => {
      this.issueList = res;
    }, err => { throw err; });

    this.pincodeRate.getRateMasterCode().then(res => {
      this.vendorsList = res;
    }, err => { throw err; });

    this.expenseService.getExpenseDetails().then(res => {
      this.listOfExpenses = res;
    }, err => { throw err; });

    this.officeService.getOfficeDetails().then(res => {
      this.officeBranchList = res;
    }, err => { throw err; });

    this.coloaderService.getColoaderDetails().then(res => {
      this.coloaders = res;
    }, err => { throw err; });

    this.shipperService.getShipperDetails().then(res => { // Shipper Selection Items
      this.shipperList = res;
    }, err => { throw err; });

  }

  fetchRecords() {
    this.bookingService.getBookingDetailsByID(this.bookingInfo[0].id).then(res => {
      this.bookedDetails = res;
      let wt: number = 0;
      let totAmt: number = 0;
      this.bookedDetails.forEach(element => {
        wt = wt + element.pcsWtKgs;
        totAmt = totAmt + parseFloat(element.estimatedAmount);
      });
      this.bookedWeight = wt.toFixed(2);
      this.bookedTotAmount = totAmt.toFixed(2);
    }, err => { throw err; });
    if (this.secHawnNo) {
      this.bookingService.getPcsListByHawnNo(this.secHawnNo).then(res => {
        this.pcsList = res;
      }, err => { throw err; });
    }
  }

  get f() {
    return this.specialBookingForm.controls;
  }

  coloaderSearch(term: string, item: any) {  // co-loader Search
    term = term.toLocaleLowerCase();
    return item.coloaderCode.toLocaleLowerCase().indexOf(term) > -1 || item.coloaderName.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchBranch(term: string, item: any) { // Branch Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  pincodeSearch(term: string, item: any) { // Pincode Search
    term = term.toLocaleLowerCase();
    return item.ajwPin.toLocaleLowerCase().indexOf(term) > -1 || item.ajwCity.toLocaleLowerCase().indexOf(term) > -1;
  }

  citySearch(term: string, item: any) { // ngSelect Search - runNo
    term = term.toLocaleLowerCase();
    return item.cityCode.toLocaleLowerCase().indexOf(term) > -1 || item.cityName.toLocaleLowerCase().indexOf(term) > -1;
  }

  boxSearch(term: string, item: any) { // Box Search
    term = term.toLocaleLowerCase();
    return item.boxName.toLocaleLowerCase().indexOf(term) > -1 || item.pcsWtKgs.toString().toLocaleLowerCase().indexOf(term) > -1;
  }

  documentTypeSearch(term: string, item: any) { // Document Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  magazineTypeSearch(term: string, item: any) { // Magazine Search
    term = term.toLocaleLowerCase();
    return item.magazineCode.toLocaleLowerCase().indexOf(term) > -1 || item.magazineName.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchRunNo(term: string, item: any) { // ngSelect Search - runNo
    term = term.toLocaleLowerCase();
    return item.secRunno.toLocaleLowerCase().indexOf(term) > -1 || item.secMawbno.toLocaleLowerCase().indexOf(term) > -1;
  }

  searchConsignee(term: string, item: any) { // Search Consignee
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().indexOf(term) > -1
      || item.contactNumber.toLocaleLowerCase().indexOf(term) > -1
      || item.city.toLocaleLowerCase().indexOf(term) > -1
      || item.address.toLocaleLowerCase().indexOf(term) > -1;
  }

  searchConsignor(term: string, item: any) { //search Consignor
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().indexOf(term) > -1
      || item.contactNumber.toLocaleLowerCase().indexOf(term) > -1
      || item.city.toLocaleLowerCase().indexOf(term) > -1
      || item.address.toLocaleLowerCase().indexOf(term) > -1;
  }

  issuSearch(term: string, item: any) { //Book Issue No Search,
    term = term.toLocaleLowerCase();
    return item.id.toLocaleLowerCase().indexOf(term) > -1 || item.issCode.toLocaleLowerCase().indexOf(term) > -1;
  }

  getConsignDetails() { // Get Consign Details By Magazine ID
    let MagazineId = this.specialBookingForm.value.magazineId;
    let consigneeID = this.specialBookingForm.value.consigneeID;
    let consignorID = this.specialBookingForm.value.consignorID;
    let DocId = this.specialBookingForm.value.docType;
    let issueNo = this.specialBookingForm.value.issueNo;
    let Info = [];
    Info[0] = { 'MagazineId': MagazineId, 'DocId': DocId };
    if (this.isDomestic) {
      this.getNullConsigneeList(consigneeID);
    } else {
      if (Info[0]['MagazineId'] == null && Info[0]['DocId'] == null) {
        this.getNullConsigneeList(consigneeID);
      } else {
        this.consignService.getConsigneeDetails(Info[0]).subscribe(res => {
          this.consigneeList = res;
          this.consigneeList = [...this.consigneeList];
          if (consigneeID) {
            this.specialBookingForm.patchValue({
              consigneeID: consigneeID
            });
          }
        }, err => { throw err; });
      }
    }

    this.consignService.getConsignorDetails().then(res => {
      this.consignorList = res;
      this.consignorList = [...this.consignorList];
      if (consignorID) {
        this.specialBookingForm.patchValue({
          consignorID: consignorID
        });
      }
    }, err => { throw err; });
  }

  getNullConsigneeList(consigneeID) {
    this.consignService.getConsigneeDetail().then(res => {
      this.consigneeList = res;
      this.consigneeList = [...this.consigneeList];
      if (consigneeID) {
        this.specialBookingForm.patchValue({
          consigneeID: consigneeID
        });
      }
    }, err => { throw err; });
  }

  calcWt() { // calc Amount based on postal type
    let wt = parseFloat(this.specialBookingForm.value.pcsWtKgs);
    let len = this.BDPostalRates.length;
    let tempLen = len;
    this.BDPostalRates.forEach(element => {
      if (wt >= element.wtFrom && wt <= element.wtTo) {
        let amount = element.rate * wt;
        this.specialBookingForm.patchValue({ estimatedAmount: amount.toFixed(2) });
        tempLen = tempLen - 1;
        return;
      }
    })
    if (wt > 0) {
      if (tempLen == len) {
        this.openSnackBar('Given wieght not allowed in the selected coloader', "");
      }
    } else {
      this.specialBookingForm.patchValue({ estimatedAmount: 0 });
    }
  }

  postalRateByPin() { //New func since 27/02/2019
    let obj = [];
    obj[0] = {
      'pincode': this.specialBookingForm.value.pincodeId
    }
    this.pincodeRate.getPostalVendorAndRate(obj[0]).subscribe(res => {
      if (res.status == 200) {
        let object = res.data;
        this.tempVendorList = object;
        console.log(this.tempVendorList);
        var vendorName = [...new Set(object.map(x => x.vendorName))];
        this.specialBookingForm.patchValue({
          postalCode: vendorName[0]
        });
        if (this.specialBookingForm.value.pcsWtKgs) {
          this.getRate();
        }
      }
    }, err => { throw err; });
  }

  getPincodeList() {
    let val = this.specialBookingForm.value.cityCode;
    this.pincodeServiceable.getPincodeServiceByCity(val).then(res => {
      this.specialBookingForm.get('pincodeId').reset();
      this.cityList = res;
    })
  }

  getRate() {
    var val = this.specialBookingForm.value.pcsWtKgs;
    for (const i of this.tempVendorList) {
      if (val >= i.wtFrom && val <= i.wtTo) {
        this.specialBookingForm.patchValue({ estimatedAmount: i.rate });
        return;
      } else if (val > 0.500 && i.vendorName == 'POSTAL') {
        let blnc = val - 0.500;
        let amnt = blnc * 16 + 19;
        this.specialBookingForm.patchValue({ estimatedAmount: amnt });
      } else {
        this.specialBookingForm.patchValue({ estimatedAmount: 0 });
      }
    }
  }

  autoCalcChanged() {
    let val = this.specialBookingForm.value.calcType;
    if (val == '1') {
      this.amountAuto = false;
    } else {
      this.amountAuto = true;
    }
  }

  save() { // Detailed Booking Save
    let obj = Object.assign({}, this.specialBookings, this.specialBookingForm.value);
    obj.cityId = this.specialBookingForm.value.cityCode;
    obj.createdBranchId = this.userInfo.branchId;
    if (this.isSave) {
      if (this.isDomestic == false) {
        if (this.bookedWeight >= this.landedWeight) {
          this.openSnackBar("No more boxes for booking.", "Error");
          return;
        }
      }
      this.bookingService.addConsignmentDetails(obj).subscribe(res => { //Insert func
        if (res.status == 200) {
          this.openSnackBar('Saved Successfully!', 'Success');
          this.specialBookingForm.reset();
          this.specialBookingForm.patchValue({
            bookingID: this.bookingInfo[0].id,
            shipperID: this.bookingInfo[0].secShipper,
            shipperID1: this.bookingInfo[0].secShipper
          });
          this.fetchRecords();
        }
      }, err => { throw err; });
    } else {
      this.bookingService.updateBookingDetails(obj).subscribe(res => { //Update func
        if (res.status == 200) {
          this.openSnackBar('Updated Successfully!', 'Success');
          this.specialBookingForm.reset();
          this.specialBookingForm.patchValue({
            bookingID: this.bookingInfo[0].id,
            shipperID: this.bookingInfo[0].secShipper,
            shipperID1: this.bookingInfo[0].secShipper
          });
          this.fetchRecords();
        }
      }, err => { throw err; });
      this.isSave = true;
    }
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "Success") {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-red'] });
    }
  }

  edit(id) { // Edit
    this.bookingService.getBookingDetailByDetailID(id).then(res => {
      let details = res[0];
      this.patchFunc(details);
    }, err => { throw err; });
  }

  patchFunc(details) {
    if (details.docType == 2) {
      this.isDocument = true;
    } else {
      this.isDocument = false;
    }
    this.specialBookingForm.patchValue({
      id: details.id,
      branchId: details.branchId,
      cnNO: details.cnNO,
      refNo: details.refNo,
      docType: details.docType,
      invoiceNo: details.invoiceNo,
      issueNo: details.issueNo,
      magazineId: details.magazineId,
      modeId: details.modeId,
      pincodeId: details.pincodeId,
      pcsWt: details.pcsWt,
      estimatedAmount: details.estimatedAmount,
      consigneeID: details.consigneeID,
      consignorID: details.consignorID,
      noOfPcs: details.noOfPcs,
      postalCode: details.postalCode,
      pcsWtKgs: details.pcsWtKgs,
      toPay: details.toPay,
      ifPostal: details.ifPostal,
      expenseID: details.expenseID,
      coloaderID: details.coloaderID,
      modeName: details.modeName,
      shipperID: details.shipperID,
      shipperID1: details.shipperID,
      cityCode: details.cityId
    });
    this.getConsignDetails();
    this.bookIssueService.getBookIssueDetails().then(res => {
      this.issueList = res;
      this.specialBookingForm.patchValue({ issueNo: details.issueNo });
    }, err => { throw err; });
    this.jobPlnrService.getBoxPcsByHAWN(this.secHawnNo).then(res => {
      this.pcsList = res;
      this.specialBookingForm.patchValue({ boxPcsId: details.boxPcsId });
    }, err => { throw err; });
    this.isSave = false;
  }

  delete(id): void {
    var Info = this.bookedDetails.filter(incInf => incInf.id === id)
    if (Info && Info.length > 0) {
      const dialogRef = this.openDialogDlte("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.bookingService.deleteBookingDetials(Info[0]).subscribe(res => {
            this.openSnackBar('Deleted Successfully!', 'Success');
            this.specialBookingForm.reset();
            this.specialBookingForm.patchValue({
              bookingID: this.bookingInfo[0].id,
              shipperID: this.bookingInfo[0].secShipper,
              shipperID1: this.bookingInfo[0].secShipper
            });
            this.fetchRecords();
          }, err => { throw err; });
        }
      }, err => { throw err; });
    }
  }

  openDialogDlte(title: string) { // Delete Confirmation
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: title };
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  docLoad() {
    var magazine = this.specialBookingForm.value.docType;
    if (magazine == 2) {
      this.isDocument = true;
      this.specialBookingForm.patchValue({
        magazineId: null,
        consigneeID: null,
        consignorID: null
      })
    } else {
      this.isDocument = false;
      this.specialBookingForm.patchValue({
        magazineId: null,
        consigneeID: null,
        consignorID: null
      })
      this.getConsignDetails();
    }
  }

  openDialog(type): void { // Open Dialog Service
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      height: '350px',
      data: { type: type, magazineId: this.specialBookingForm.value.magazineId, docType: this.specialBookingForm.value.docType }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getConsignDetails();
    }, err => { throw err; });
  }

  openIssueDialog(): void { // Open Issue Dialog Box
    if (this.specialBookingForm.value.magazineId != null) {
      const dialogRef = this.dialog.open(IssueDialogComponent, {
        width: '500px',
        height: '350px',
        data: { magazineId: this.specialBookingForm.value.magazineId }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.bookIssueService.getBookIssueDetailByMagazine(this.specialBookingForm.value.magazineId).then(res => {
          this.issueList = res;
        }, err => { throw err; })
      }, err => { throw err; });
    }
    else {
      this.openSnackBar("Enter magazine name to add issue", "");
    }
  }

  isCNNO() { // Is CNNO or Check duplicate..
    let cnNO = this.specialBookingForm.value.cnNO;
    if (cnNO > 0) {
      this.checkCNNO();
      this.bookingService.isCnNO(cnNO).then(res => {
        if (res[0][""] > 0) {
          this.openSnackBar("CNNO Already Exists!", "Error");
          this.nameField.nativeElement.focus();
          this.specialBookingForm.patchValue({
            modeId: null
          })
        }
      }, err => { throw err; });
    }
  }

  checkCNNO() {
    let Info = [];
    Info[0] = { 'cnNo': this.specialBookingForm.value.cnNO };
    this.bookingService.checkCNNO(Info[0]).subscribe(res => {
      this.checkCNNOList = res;
      if (this.checkCNNOList.length <= 0) {
        this.openSnackBar("Invalid CNNO", "Error");
        this.nameField.nativeElement.focus();
        this.specialBookingForm.patchValue({
          cnNO: null,
          modeId: null
        })
      }
      else {
        this.specialBookingForm.patchValue({
          modeName: this.checkCNNOList[0].modeName,
          modeId: this.checkCNNOList[0].modeId
        })
      }
    }, err => { throw err; })
  }

  getReport(): void {
    this.bookingService.getBookingDetailsByIDForReport(this.id).then(res => {
      this.bookedDetailsForReport = res;
      if (this.bookedDetailsForReport && this.bookedDetailsForReport.length > 0) {
        this.pdfService.specialCustomerDetailedBookingReportPDF(this.bookedDetailsForReport).subscribe(response => {
          var file = new Blob([response.body], { type: 'application/pdf' });
          var url = window.URL.createObjectURL(file);
          var objectUrl = URL.createObjectURL(file);
          var a = document.createElement("a");
          a.href = objectUrl;
          var id = this.bookedDetailsForReport[0].bookingID;
          a.download = 'Special Customer Detailed Booking - ' + id + '.pdf';
          a.click();
          window.URL.revokeObjectURL(objectUrl);
        }, err => { throw err; });
      }
      else {
        this.openSnackBar('No records found', '.');
      }
    })
  };

}

