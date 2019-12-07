import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingDetailsService } from '../../../services/Transactions/bookingDetailsService/booking-details.service';
import { PincodeRateMasterService } from '../../../services/Master/pincodeRateMasterService/pincode-rate-master.service';
import { PincodeService } from '../../../services/Master/pincodeService/pincode.service';
import { ModeService } from '../../../services/Master/modeService/mode.service';
import { ConsignServiceService } from '../../../services/Master/consignService/consign-service.service';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { DocumentMagazineService } from '../../../services/Master/documentMagazineService/document-magazine.service';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals } from '../../../global';
import { bookingInfo } from './bookingInfo';
import { pdfDocService } from '../../../services/Master/pdfDocService/pdfDoc.service';
import { BookIssueService } from '../../../services/Master/bookIssueService/book-issue.service';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { UserService } from '../../../services/users/users.service';
import { AuthService } from '../../../login/auth.service';
import { BarcodeService } from '../../../services/sharedServices/barcodeService/barcode.service';
import { ExpensesService } from '../../../services/Master/expensesService/expenses.service';
import { ShipperService } from '../../../services/Master/shipperService/shipper.service';
import { JobPlannerService } from '../../../services/Transactions/jobPlannerService/job-planner.service';
import { PincodeServiceService } from '../../../services/Master/pincodeServiceService/pincode-service.service';
import { CityService } from '../../../services/Master/cityService/city.service';
import { _ } from 'underscore';
import { CookieService } from 'ngx-cookie-service';
import { CustomerService } from '../../../services/Master/customerService/customer.service';

export interface DialogData {
  type: string;
  magazineId: string;
  docType: string;
}

@Component({
  selector: 'app-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: ['./booking-info.component.scss']
})

export class BookingInfoComponent implements OnInit {

  @ViewChild('cnNO') nameField: ElementRef;
  @ViewChild('length') length: ElementRef;
  @ViewChild('breadth') breadth: ElementRef;
  @ViewChild('width') width: ElementRef;

  public detailsForm: FormGroup;
  bookingInfo: any[];
  barcode: any[];
  cityList: any[];
  docsList: any[];
  checkCNNOList: any[];
  magazineList: any[];
  tempMagazineList: any[];
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
  bookInfo: bookingInfo = new bookingInfo();
  validationCount: any[];
  landedWeight: any;
  bookedWeight: any;
  bookedTotAmount: any;
  postalType: Boolean = false;
  postalList: any[];
  BDPostalRates: any[];
  secHawnNo: any[];
  issueList: any[];
  podStatus: Boolean = false;
  vendorsList: any[];
  calcMethods: any[];
  canEditFailureBooking: Boolean;
  listOfExpenses: any[];
  isDocument: Boolean = false;
  officeBranchList: any[];
  shipperList: any[];
  isDomestic: Boolean;
  userInfo: any;
  isCorrectWieght: Boolean = true;
  tempVendorList: any[];
  cityCodes: any[];
  servicedPincodes: any[];
  tempMagazines: any[];
  cookieValue: any;
  consigneeNameList: any[];
  consigneeAddressList: any[];
  consigneeCityList: any[];
  tempConsigneeList: any[];
  specialConsigneeList: any[];
  isExpress: Boolean = false;
  numberOfVendors: any;
  amountAuto: Boolean = true;
  isF4: Boolean = false;
  isCashCustomer: Boolean = false;
  isUnder150Available: Boolean = false;

  constructor(private router: Router,
    private fb: FormBuilder,
    private documentService: DocumentMagazineService,
    private officeService: OfficeService,
    private modeService: ModeService,
    public dialog: MatDialog,
    private _route: ActivatedRoute,
    private globals: Globals,
    private incomeService: IncomeLoadService,
    private bookingService: BookingDetailsService,
    private userService: UserService,
    private consignService: ConsignServiceService,
    private authService: AuthService,
    private pdfService: pdfDocService,
    private bookIssueService: BookIssueService,
    private pincodeRate: PincodeRateMasterService,
    private pinocdes: PincodeService,
    private barcodeService: BarcodeService,
    private expenseService: ExpensesService,
    private snackBar: MatSnackBar,
    private shipperService: ShipperService,
    private plannerService: JobPlannerService,
    private pincodeServiceable: PincodeServiceService,
    private cityService: CityService,
    private customerService: CustomerService,
    private cookieService: CookieService) {

    this.detailsForm = this.fb.group({
      'id': '',
      'bookingID': '',
      'cnNO': [null, Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11)])],
      'refNo': [null],
      'cityCode': [null, Validators.compose([Validators.required])],
      'cityCode1': [null, Validators.compose([Validators.required])],
      'boxPcsId': [null],
      'pcsWt': [null],
      'pincodeId': [null, Validators.compose([Validators.required, Validators.maxLength(6), Validators.minLength(6)])],
      'modeId': [null],
      'modeName': [null],
      'docType': [null],
      'magazineId': [null],
      'invoiceNo': [null, Validators.compose([Validators.maxLength(6)])],
      'issueNo': [null],
      'consigneeID': [null],
      'consignorID': [null],
      'shipperID': [null],
      'shipperID1': [null],
      'estimatedAmount': [null],
      'noOfPcs': [null, Validators.compose([Validators.required])],
      'pcsWtKgs': [null, Validators.compose([Validators.required])],
      'toPay': [null],
      'postalCode': [null, Validators.compose([Validators.required])],
      'ifPostal': [null],
      'calcType': [null],
      'expenseID': [null],
      'branchId': [null],
      'branchId1': [null],
      'coloaderID': [null],
      'consigneeName': [null, Validators.compose([Validators.required])],
      'consigneeAddress': [null, Validators.compose([Validators.required])],
      'consigneeCity': [null],
      'magazineName': [null],
      'bookPostalRate': [null],
      'postalRateValue': [null],
      'isSpecialConsignment': [null],
      'cashCustomer': [null],
      'length': [null],
      'width': [null],
      'breadth': [null],
      'weight': [null]
    });
  }

  get f() {
    return this.detailsForm.controls;
  }

  ngOnInit() {

    this.globals.role = 'Detailed Booking';
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userInfo = currentUser;
    const roles = currentUser.roleId.find(element => {
      if (element == '9') {
        return element;
      } // HO RoleId is '9'..
    });
    currentUser.isHO = roles == '9' ? true : false;

    if (this._route.snapshot.queryParams.Id) {
      let id = this._route.snapshot.queryParams.Id
      this.detailsForm.patchValue({ bookingID: id });
      this.bookInfo.bookingID = id;
      this.bookingService.getBookingInfoByID(id).then(res => {
        this.bookingInfo = res;
        if(this.bookingInfo[0].secDeliveryCat == 5){
          this.isExpress = true;
        }
        this.detailsForm.patchValue({
          shipperID: res[0]['secShipper'],
          shipperID1: res[0]['secShipper']
        });
        this.secHawnNo = res[0].secHAWB;
        this.plannerService.getLandedWtByHAWN(this.secHawnNo).then(res => {
          this.landedWeight = res[0]['landedWeight'];
        }, err => { throw err; });

        if (res[0]['bookingType'] == "Secondary") {
          this.isDomestic = false;
          this.getConsignDetails();
        } else {
          this.isDomestic = true;
          this.getConsignDetails();
        }

        if (this.secHawnNo) {
          this.bookingService.getPcsListByHawnNo(this.secHawnNo).then(res => {
            this.pcsList = res;
          }, err => { throw err; });
        }
      }, err => { throw err; });
      this.bookingService.getBookingDetailsByID(id).then(res => {
        this.bookedDetails = res;
        let wt: number = 0;
        let totAmt: number = 0;
        this.bookedDetails.forEach(element => {
          wt = wt + element.pcsWtKgs;
          totAmt = totAmt + parseFloat(element.estimatedAmount);
        });
        this.bookedWeight = wt.toFixed(3);
        this.bookedTotAmount = totAmt.toFixed(2);
      }, err => { throw err; });

      this.postalList = [{ 'id': '1', 'type': 'URP' }, { 'id': '2', 'type': 'BD' }];
      this.calcMethods = [{ 'id': '1', 'type': 'Manual' }, { 'id': '2', 'type': 'Auto' }];
    }

    this.cityService.getCityDetails().then(res => {
      this.cityCodes = res;
    });

    this.documentService.getDocumentDetails().then(res => {
      this.docTypeList = res;
    }, err => { throw err; });

    this.documentService.getMagazineDetails().then(res => {
      // this.magazineList = res;
      this.tempMagazineList = res;
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
      this.tempVendorList = this.vendorsList;
      this.numberOfVendors = this.vendorsList.length;
    }, err => { throw err; });

    this.expenseService.getExpenseDetails().then(res => {
      this.listOfExpenses = res;
    }, err => { throw err; });

    this.officeService.getOfficeDetails().then(res => {
      this.officeBranchList = res;
    }, err => { throw err; });

    this.shipperService.getShipperDetails().then(res => { // Shipper Selection Items
      this.shipperList = res;
    }, err => { throw err; });

    this.pincodeServiceable.getPincodeServiceDetails().then(res => {
      this.servicedPincodes = res;
    });

    this.detailsForm.patchValue({ calcType: '2' });
  }

  magazineDetails(details) {
    this.detailsForm.patchValue({
      magazineId: details.id
    });
  }

  getFilteredMagz(event) {
    const term = this.detailsForm.value.magazineName.toLocaleLowerCase();
    if (term.length > 2) {
      const results = _.filter(this.tempMagazineList, function(element){
        return element.magazineCode.toLocaleLowerCase().indexOf(term) > -1 || element.magazineName.toLocaleLowerCase().indexOf(term) > -1;
      });
      this.magazineList = [...results];
    } else {
      if (event.keyCode == 8) {
        this.magazineList = [];
      }
    }
  }

  changeFilter(event) {
    this.consigneeNameList = [];
    if (event.keyCode == 115) {
      this.detailsForm.patchValue({
        isSpecialConsignment: false
      });
      if (this.isF4) {
        this.isF4 = false;
        this.openSnackBar('Special Consignee Removed!', 'Success');
        this.detailsForm.get('consigneeName').reset();
        this.detailsForm.get('isSpecialConsignment').reset();
        this.detailsForm.patchValue({
          isSpecialConsignment: false
        });
        this.getCity();
      } else {
        this.isF4 = true;
        this.detailsForm.get('consigneeName').reset();
        this.detailsForm.get('postalCode').reset();
        this.detailsForm.get('isSpecialConsignment').reset();
        this.detailsForm.patchValue({
          isSpecialConsignment: true
        });
        this.detailsForm.patchValue({ estimatedAmount: 0 });
        this.openSnackBar('Special Consignee Loaded!', 'Success');
      }
    }
    let val = this.detailsForm.value.consigneeName;
    if (this.isF4) {
      // this.consigneeNameList = this.specialConsigneeList;
      const results = _.filter(this.specialConsigneeList, function(element) {
        val = val.toLocaleLowerCase();
        return element.consigneeName.toLocaleLowerCase().indexOf(val) > -1;
      });
      this.consigneeNameList = [...results];
    } else {
      // this.consigneeNameList = this.specialConsigneeList;
      const results = _.filter(this.tempConsigneeList, function(element) {
        val = val.toLocaleLowerCase();
        return element.consigneeName.toLocaleLowerCase().indexOf(val) > -1;
      });
      this.consigneeNameList = [...results];
    }
  }

  consigneeDetails(details) {
    this.vendorsList.push({
      vendorName: details.consigneeName,
      });
    this.detailsForm.patchValue({
      consigneeAddress: details.consigneeAddress,
      consigneeCity: details.consigneeCity == undefined ? null : details.consigneeCity
    });
    if (this.detailsForm.value.isSpecialConsignment) {
      this.detailsForm.get('postalCode').reset();
      this.detailsForm.patchValue({
        amount: 0,
        postalCode: details.consigneeName
      });
    }
  }

  consignorSelect() {
    if (this.detailsForm.value.consignorID == 248) {
      this.isCashCustomer = true;
    }
  }

  checkDimension() {
    const obj = Object.assign({}, this.detailsForm.value);
    if (obj.length > 120) {
      this.openSnackBar('Odd Dimensional Shipment!', 'error');
      this.length.nativeElement.focus();
      return;
    } else if (obj.breadth > 120) {
      this.openSnackBar('Odd Dimensional Shipment!', 'error');
      this.breadth.nativeElement.focus();
      return;
    } else if (obj.width > 120) {
      this.openSnackBar('Odd Dimensional Shipment!', 'error');
      this.width.nativeElement.focus();
      return;
    }
    const breadth = obj.breadth === null ? 0 : obj.breadth === undefined ? 0 : obj.breadth;
    const length = obj.length === null ? 0 : obj.length === undefined ? 0 : obj.length;
    const width = obj.width === null ? 0 : obj.width === undefined ? 0 : obj.width;
    const total = parseFloat(breadth) + parseFloat(length) + parseFloat(width);
    const wt = total / 5000;
    this.detailsForm.patchValue({
      weight: wt
    });
  }

  consignorFilter(event) {
    const val = event.target.value.toLocaleLowerCase();
    const results = _.filter(this.consignorList, function(element) {
      return element.name.toLocaleLowerCase().indexOf(val) > -1;
    });
    this.consignorList = [...results];
  }

  getKeyCode(event) {
    const keyVal = event.keyCode;
    if (keyVal == 80) {
      const cookieResults = JSON.parse(this.cookieService.get('bookingInfo'));
        this.detailsForm.patchValue({
          docType: cookieResults.docType,
          boxPcsId: cookieResults.boxPcsId
        });
        this.docLoad();
        const obj = _.find(this.tempMagazineList, function(element) {
          return cookieResults.magazineId == element.id;
        });
        this.detailsForm.patchValue({
          magazineName: obj.magazineName,
          issueNo: cookieResults.issueNo,
          invoiceNo: cookieResults.invoiceNo,
          noOfPcs: cookieResults.noOfPcs,
          pcsWtKgs: cookieResults.pcsWtKgs
        });
        this.magazineDetails(obj);
    }
  }

  getCity() {
      const pincode = this.detailsForm.value.pincodeId;
      this.detailsForm.get('consigneeName').reset();
      this.detailsForm.get('postalCode').reset();
      if (pincode.length > 5) {
        const result = _.find(this.servicedPincodes, function(element) {
          return element.ajwPin == pincode;
        });
        let rateResult = _.filter(this.pinRateList, function(element) {
          return element.postalCode == pincode;
        });
        if (pincode.charAt(0) == '6' || pincode.charAt(0) == '5') { // Add postal vendors too..
          if (pincode.charAt(0) == '6') {
            _.filter(this.pinRateList, (ele) => {
              if (ele.vendorName == 'POSTAL') { rateResult.push(ele); }
            });
            this.isUnder150Available = true;
          } else if (pincode.charAt(0) == '5' && pincode.charAt(1) == '0' || pincode.charAt(1) == '2' || pincode.charAt(1) == '3') {
            _.filter(this.pinRateList, (ele) => {
              if (ele.vendorName == 'POSTAL') { rateResult.push(ele); }
            });
            this.isUnder150Available = true;
          } else if (pincode.charAt(0) == '5' && pincode.charAt(1) == '6' || pincode.charAt(1) == '7') {
            _.filter(this.pinRateList, (ele) => {
              if (ele.vendorName == 'POSTAL') { rateResult.push(ele); }
            });
            this.isUnder150Available = true;
          }
        } else {
          this.isUnder150Available = false;
        }
        console.log(rateResult);
        if (!this.isExpress) {
          if (rateResult.length) {
            this.vendorsList = rateResult;
            this.tempVendorList = rateResult;
            this.detailsForm.get('postalCode').reset();
            const vendorName = [...new Set(rateResult.map(x => x.vendorName))];
            this.detailsForm.patchValue({postalCode : vendorName[0]});
            this.getRate();
          } else {
            let rateResult = _.filter(this.pinRateList, function(element) {
              return element.postalCode == null;
            });
            this.vendorsList = rateResult;
            this.tempVendorList = rateResult;
            this.detailsForm.get('postalCode').reset();
            const vendorName = [...new Set(rateResult.map(x => x.vendorName))];
            this.detailsForm.patchValue({postalCode : vendorName[0]});
            this.getRate();
          }
        }
        if (this.isExpress) {
            const len = this.tempVendorList.length;
            if (this.numberOfVendors < len) {
              this.vendorsList.splice(len - 1 , 1);
            }
            this.vendorsList.push({vendorName: 'Self Delivery'});
            this.vendorsList = [ ...this.vendorsList];
        }
        if (result != undefined) {
          this.detailsForm.patchValue({
            cityCode: result.ajwCity, cityCode1: result.ajwCity, branchId: result.branchId, branchId1: result.branchId
          });
        } else {
          this.detailsForm.patchValue({ cityCode: '', cityCode1: '' });
          this.detailsForm.get('branchId1').reset();
        }
        this.bookingService.getConsigneeByPostalID(pincode).then(res => {
          if (res.statusBool == 200) {
            this.consigneeNameList = res.data;
            this.tempConsigneeList = res.data;
          }
        });
        this.bookingService.getSpecialConsignees().subscribe(res => {
          if (res.statusBool == 200) {
            const tempData = _.filter(res.data, (ele) => {
              return ele.pincode == pincode;
            });
            this.specialConsigneeList = tempData;
          }
        });
      }
  }

  getWieght() {
    const pcsID = this.detailsForm.value.boxPcsId;
    const filteredObj = this.pcsList.find(function (item) {
      if (item.id === pcsID) { return item; }
    });
    this.detailsForm.patchValue({
      pcsWt: filteredObj.pcsWtKgs
    });
  }

  customSearchBranch(term: string, item: any) { // Branch Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  pincodeSearch(term: string, item: any) { // Pincode Search
    term = term.toLocaleLowerCase();
    return item.ajwPin.toLocaleLowerCase().indexOf(term) > -1 || item.ajwCity.toLocaleLowerCase().indexOf(term) > -1;
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

  citySearch(term: string, item: any) { // ngSelect Search - runNo
    term = term.toLocaleLowerCase();
    return item.cityCode.toLocaleLowerCase().indexOf(term) > -1 || item.cityName.toLocaleLowerCase().indexOf(term) > -1;
  }

  searchConsignee(term: string, item: any) { // Search Consignee
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().indexOf(term) > -1
      || item.city.toLocaleLowerCase().indexOf(term) > -1
      || item.address.toLocaleLowerCase().indexOf(term) > -1;
  }

  searchConsignor(term: string, item: any) { // search Consignor
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().indexOf(term) > -1
      || item.code.toLocaleLowerCase().indexOf(term) > -1;
  }

  issuSearch(term: string, item: any) { // Book Issue No Search,
    term = term.toLocaleLowerCase();
    return item.id.toLocaleLowerCase().indexOf(term) > -1 || item.issCode.toLocaleLowerCase().indexOf(term) > -1;
  }

  edit(id) { // Edit
    let loginId = this.userName;
    this.bookingService.getpod(loginId).then(res => {
      let count = res.count;
    });
    this.bookingService.getBookingDetailByDetailID(id).then(res => {
      let details = res[0];
      let cnNO = parseInt(details.cnNO);
      this.bookingService.isDeliveryFailedCNNO(cnNO).then(res => {
        if (res.value > 1) {
          if (this.canEditFailureBooking == true) {
            if (details.rebookingFlag == false) {
              this.openSnackBar('Consignment Rebooking not allowed.', 'warning');
            } else {
              this.patchFunc(details);
              this.amountAuto = false;
            }
          } else {
            this.openSnackBar('User Not Allowed to Edit, Please Contact HO!', 'warning');
          }
        } else {
          this.patchFunc(details);
        }
      }, err => { throw err; });
    }, err => { throw err; });
  }

  get userName(): string {
    const _user = this.authService.currentUser();
    if (_user != undefined && _user != null) {
      return this.authService.currentUser().userName;
    }
    return '';
  }

  patchFunc(details) {
    if (details.postalCode == 'POSTAL') {
      this.postalType = true;
    } else {
      this.postalType = false;
    }
    if (details.podStatus == false) { // Handle If Undelivered Package,
      this.detailsForm.patchValue({ postalCode: '' });
      this.postalType = false;
    } else {
      this.detailsForm.patchValue({ postalCode: details.postalCode });
    }
    if (details.docType == 2) {
      this.isDocument = true;
    } else {
      this.isDocument = false;
    }

    const tempMagazines = _.find(this.tempMagazineList, function(ele){
      return ele.id == details.magazineId;
    });
    this.magazineList = [...tempMagazines];

    this.detailsForm.patchValue({
      id: details.id,
      cnNO: details.cnNO,
      bookingID: details.bookingID,
      branchId: details.branchId,
      branchId1: details.branchId,
      refNo: details.refNo,
      docType: details.docType,
      invoiceNo: details.invoiceNo,
      magazineId: details.magazineId,
      modeId: details.modeId,
      pincodeId: details.pincodeId,
      pcsWt: details.pcsWt,
      estimatedAmount: details.estimatedAmount,
      // consigneeID: details.consigneeID,
      consignorID: details.consignorID,
      noOfPcs: details.noOfPcs,
      pcsWtKgs: details.pcsWtKgs,
      toPay: details.toPay,
      ifPostal: details.ifPostal,
      expenseID: details.expenseID,
      modeName: details.modeName,
      shipperID: details.shipperID,
      shipperID1: details.shipperID,
      cityCode: details.cityId,
      cityCode1: details.cityId,
      consigneeName: details.consigneeName,
      consigneeAddress: details.consigneeAddress,
      consigneeCity: details.consigneeCity,
      magazineName: tempMagazines.magazineName
    });

    this.getConsignDetails();
    this.bookIssueService.getBookIssueDetails().then(res => {
      this.issueList = res;
      this.detailsForm.patchValue({ issueNo: details.issueNo });
    }, err => { throw err; });
    this.plannerService.getBoxPcsByHAWN(this.secHawnNo).then(res => {
      this.pcsList = res;
      this.detailsForm.patchValue({ boxPcsId: details.boxPcsId });
    }, err => { throw err; });
  }

  save() { // Save or Update Booking Details
    this.bookInfo = Object.assign({}, this.detailsForm.value);
    this.bookInfo.cityId = this.detailsForm.value.cityCode;
    this.bookInfo.bookingID = +this.detailsForm.value.bookingID;
    this.bookInfo.cnNO = +this.detailsForm.value.cnNO;
    this.bookInfo.refNo = +this.detailsForm.value.refNo;
    this.bookInfo.pcsWt = +this.detailsForm.value.pcsWt;
    this.bookInfo.pcsWtKgs = +this.detailsForm.value.pcsWtKgs;
    this.bookInfo.noOfPcs = +this.detailsForm.value.noOfPcs;
    this.bookInfo.estimatedAmount = +this.detailsForm.value.estimatedAmount;
    this.bookInfo.toPay = +this.detailsForm.value.toPay;
    this.bookInfo.createdBranchId = this.userInfo.branchId;
    this.bookInfo.createdBy = this.userInfo.userName;
    this.bookInfo.updatedBy = this.userInfo.userName;
    if (!this.bookInfo.id) {
      if (this.isDomestic == false) {
        if (this.bookedWeight >= this.landedWeight) {
          this.openSnackBar("No more boxes for booking.", "Error");
          return;
        }
      }
      this.bookingService.addConsignmentDetails(this.bookInfo).subscribe(res => {
        if (res.status == 200) {
          this.cookieService.set('bookingInfo', JSON.stringify(this.detailsForm.value));
          this.openSnackBar("Saved Successfully!", "Success");
          this.detailsForm.reset();
          this.nameField.nativeElement.focus();
          this.detailsForm.patchValue({
            bookingID: this.bookInfo.bookingID,
            shipperID: this.bookInfo.shipperID,
            shipperID1: this.bookInfo.shipperID
          });
          if (this.secHawnNo) {
            this.bookingService.getPcsListByHawnNo(this.secHawnNo).then(res => {
              this.pcsList = res;
            }, err => { throw err; });
          }
          this.bookingService.getBookingDetailsByID(this.bookInfo.bookingID).then(res => {
            this.bookedDetails = res;
            let wt: number = 0;
            let totAmt: number = 0;
            this.bookedDetails.forEach(element => {
              wt = wt + element.pcsWtKgs;
              totAmt = totAmt + parseFloat(element.estimatedAmount);
            });
            this.bookedWeight = wt.toFixed(3);
            this.bookedTotAmount = totAmt.toFixed(2);
            this.bookingService.getCountValidations(this.bookInfo.bookingID).then(res => {
            })
          }, err => { throw err; });
        }
      }, err => { throw err; });
    } else {
      this.bookingService.updateBookingDetails(this.bookInfo)
        .subscribe(res => {
          this.bookingService.getBookingDetailsByID(this.bookInfo.bookingID).then(res => {
            this.bookedDetails = res;
            let wt: number = 0;
            let totAmt: number = 0;
            this.bookedDetails.forEach(element => {
              wt = wt + element.pcsWtKgs;
              totAmt = totAmt + parseFloat(element.estimatedAmount);
            });
            this.bookedWeight = wt.toFixed(3);
            this.bookedTotAmount = totAmt.toFixed(2);
            this.openSnackBar("Updated Successfully!", "Success");
            this.postalType = false;
            this.detailsForm.reset();
            this.detailsForm.patchValue({
              bookingID: this.bookInfo.bookingID,
              shipperID: this.bookInfo.shipperID,
              shipperID1: this.bookInfo.shipperID
            });
            if (this.secHawnNo) {
              this.bookingService.getPcsListByHawnNo(this.secHawnNo).then(res => {
                this.pcsList = res;
              }, err => { throw err; });
            }
            this.bookingService.getBookingDetailsByID(this.bookInfo.bookingID).then(res => {
              this.bookedDetails = res;
              let wt: number = 0;
              let totAmt: number = 0;
              this.bookedDetails.forEach(element => {
                wt = wt + element.pcsWtKgs;
                totAmt = totAmt + parseFloat(element.estimatedAmount);
              });
              this.bookedWeight = wt.toFixed(3);
              this.bookedTotAmount = totAmt.toFixed(2);
              this.bookingService.getCountValidations(this.bookInfo.bookingID).then(res => {
              }, err => { throw err; });
            }, err => { throw err; });
          }, err => { throw err; });
        }, err => { throw err; });
    }
  }

  openDialog(type): void { // Open Dialog Service
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      height: '350px',
      data: { type: type, magazineId: this.detailsForm.value.magazineId, docType: this.detailsForm.value.docType }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getConsignDetails();
    }, err => { throw err; });
  }

  openIssueDialog(): void { // Open Issue Dialog Box
    if (this.detailsForm.value.magazineId != null) {

      const dialogRef = this.dialog.open(IssueDialogComponent, {
        width: '500px',
        height: '350px',
        data: { magazineId: this.detailsForm.value.magazineId }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.bookIssueService.getBookIssueDetailByMagazine(this.detailsForm.value.magazineId).then(res => {
          this.issueList = res;
        }, err => { throw err; });
      }, err => { throw err; });
    } else {
      this.openSnackBar('Enter magazine name to add issue', '');
    }
  }

  formStatus() {
    if (this.detailsForm.value.magazineId == null) {
      this.openSnackBar('Enter magazine name to add issue', '');
      this.detailsForm.patchValue({
        issueNo: null
      });
    }
  }

  // SnackBar Toaster
  openSnackBar(message: string, action: string) {
    if (action == 'Success') {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-red'] });
    }
  }

  getConsignDetails() { // Get Consign Details By Magazine ID
    const MagazineId = this.detailsForm.value.magazineId;
    const consigneeID = this.detailsForm.value.consigneeID;
    const consignorID = this.detailsForm.value.consignorID;
    const DocId = this.detailsForm.value.docType;
    const issueNo = this.detailsForm.value.issueNo;
    const Info = [];
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
            this.detailsForm.patchValue({
              consigneeID: consigneeID
            });
          }
        }, err => { throw err; });
      }
    }
    console.log(this.bookingInfo);
    this.customerService.getCustomerDetailsByType(this.bookingInfo[0].custType).then( res => {
      this.consignorList = res;
    });

    // this.consignService.getConsignorDetails().then(res => {
    //   this.consignorList = res;
    //   this.consignorList = [...this.consignorList];
    //   if (consignorID) {
    //     this.detailsForm.patchValue({
    //       consignorID: consignorID
    //     });
    //   }
    // }, err => { throw err; });
  }

  getNullConsigneeList(consigneeID) {
    this.consignService.getConsigneeDetail().then(res => {
      this.consigneeList = res;
      this.consigneeList = [...this.consigneeList];
      if (consigneeID) {
        this.detailsForm.patchValue({
          consigneeID: consigneeID
        });
      }
    }, err => { throw err; });
  }

  delete(id): void {
    const Info = this.bookedDetails.filter(incInf => incInf.id === id);
    if (Info && Info.length > 0) {
      const dialogRef = this.openDialogDlte('Are you sure want to delete?');
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.bookingService.deleteBookingDetials(Info[0]).subscribe(res => {
            // get update table
            this.bookingService.getBookingDetailsByID(this.bookInfo.bookingID).then( res => {
              this.bookedDetails = res;
              let wt = 0;
              let totAmt = 0;
              this.bookedDetails.forEach(element => {
                wt = wt + element.pcsWtKgs;
                totAmt = totAmt + parseFloat(element.estimatedAmount);
              });
              this.bookedWeight = wt.toFixed(3);
              this.bookedTotAmount = totAmt.toFixed(2);
              this.openSnackBar('Deleted successfully!', 'Success');
              this.detailsForm.reset();
              this.detailsForm.patchValue({
                bookingID: this.bookInfo.bookingID,
                shipperID: this.bookInfo.shipperID,
                shipperID1: this.bookInfo.shipperID
              });
              if (this.secHawnNo) {
                this.bookingService.getPcsListByHawnNo(this.secHawnNo).then(res => {
                  this.pcsList = res;
                }, err => { throw err; });
              }
            }, err => { throw err; });
          }, err => { throw err; });
        }
      }, err => { throw err; });
    }
  }

  openDialogDlte(title: string) {   // Delete Confirmation
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: title };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  openDialogCancel(title: string) { // Cancel Confirmation
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: title };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  back(id) { // Cancel Action
    if (this.detailsForm.dirty) {
      const dialogRef = this.openDialogCancel('You may lost the data?');
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/bookedDetails');
        }
      }, err => { throw err; });
    } else {
      this.router.navigateByUrl('/bookedDetails');
    }
  }

  isCNNO() { // Is CNNO or Check duplicate..
    const cnNO = this.detailsForm.value.cnNO;
    if (cnNO > 0) {
      this.checkCNNO();
      this.bookingService.isCnNO(cnNO).then(res => {
        if (res[0][''] > 0) {
          this.openSnackBar('Consignment Number Already Assigned!', 'Error');
          this.nameField.nativeElement.focus();
          this.detailsForm.patchValue({
            modeId: null
          });
        }
      }, err => { throw err; });
    }
  }

  checkCNNO() {
    this.bookInfo.cnNo = this.detailsForm.value.cnNO;
    const obj = {
      'cnNo' : this.detailsForm.value.cnNO,
      'branchId' : this.userInfo.branchId
    };
    this.bookingService.checkCNNO(obj).subscribe(res => {
      this.checkCNNOList = res;
      if (this.checkCNNOList.length <= 0) {
        this.openSnackBar('Invalid CNNO', 'Error');
        this.nameField.nativeElement.focus();
        this.detailsForm.patchValue({
          cnNO: null,
          modeId: null
        });
      } else {
        this.detailsForm.patchValue({
          modeName: this.checkCNNOList[0].modeName,
          modeId: this.checkCNNOList[0].modeId
        });
      }
    }, err => { throw err; });
  }

  postalRateByPin() { // New func since 27/02/2019
    const obj = [];
    obj[0] = { 'pincode': this.detailsForm.value.pincodeId };
    this.pincodeRate.getPostalVendorAndRate(obj[0]).subscribe(res => {
      if (res.status == 200) {
        const object = res.data;
        this.tempVendorList = object;
        const vendorName = [...new Set(object.map(x => x.vendorName))];
        this.detailsForm.patchValue({
          postalCode: vendorName[0]
        });
        if (this.detailsForm.value.pcsWtKgs) {
          this.getRate();
        }
      }
    }, err => { throw err; });
  }

  getRate() { debugger
    const numOfPcs = this.detailsForm.value.noOfPcs;
    let val = this.detailsForm.value.pcsWtKgs;
    const pincode = this.detailsForm.value.pincodeId;
    this.getURP_or_BP(val, numOfPcs);
    if (numOfPcs > 1 && val != null) {
      const wtPerPcs = val / numOfPcs;
      val = parseFloat(wtPerPcs.toFixed(3));
      this.getURP_or_BP(val, numOfPcs);
    }
    if (this.isUnder150Available && val <= 0.150) {
      const postalVendor = _.filter(this.tempVendorList, ele => {
        return ele.vendorName == 'POSTAL';
      });
      this.tempVendorList = [];
      this.tempVendorList = postalVendor;
    } else if (this.isUnder150Available && val >= 0.150) {
      this.tempVendorList = [];
      this.tempVendorList = this.vendorsList;
      console.log(this.vendorsList);
    }
    if (val != null || val != undefined) {
      for (const i of this.tempVendorList) {
        if (val >= i.wtFrom && val <= i.wtTo) {
          this.detailsForm.patchValue({ estimatedAmount: i.rate });
          this.detailsForm.patchValue({postalCode: i.vendorName});
          this.getMultiRates(numOfPcs);
          if (this.detailsForm.value.isSpecialConsignment) {
            this.detailsForm.patchValue({
              amount : 0
            });
          }
          // console.log(this.detailsForm.value.postalCode);
          // console.log(this.detailsForm.value.postalRateValue);
          // console.log(this.detailsForm.value.bookPostalRate);
          // console.log(this.detailsForm.value.estimatedAmount);
          // console.log(this.detailsForm.value.ifPostal);
          return;
        } else if (val > 0.500 && i.vendorName == 'POSTAL') {
          const amt = this.getPostalRateByWieghtForSavingBack(val);
          this.postalType = false;
          this.detailsForm.patchValue({ estimatedAmount: amt.toFixed(2) });
        } else if ( val <= 0.250 && i.vendorName == 'POSTAL' ) {
          this.postalType = true;
        } else {
          this.detailsForm.patchValue({ estimatedAmount: 0 });
          this.postalType = false;
        }
      }
    }
    this.getMultiRates(numOfPcs);
    if (this.detailsForm.value.isSpecialConsignment) {
      this.detailsForm.patchValue({
        amount : 0
      });
      // console.log(this.detailsForm.value.postalCode);
      // console.log(this.detailsForm.value.postalRateValue);
      // console.log(this.detailsForm.value.bookPostalRate);
      // console.log(this.detailsForm.value.estimatedAmount);
      // console.log(this.detailsForm.value.ifPostal);
      return;
    }
    // this.checkBookPost();
    // console.log(this.detailsForm.value.postalCode);
    // console.log(this.detailsForm.value.postalRateValue);
    // console.log(this.detailsForm.value.bookPostalRate);
    // console.log(this.detailsForm.value.estimatedAmount);
    // console.log(this.detailsForm.value.ifPostal);
  }

  getURP_or_BP(val, numOfPcs) {
    if (val <= 0.250) {
      let amount = 0;
      if (val >= 0.001 && 0.050 >= val) {
        amount = 4;
      }
      if (val >= 0.051 && 0.100 >= val) {
        amount = 7;
      }
      if (val >= 0.101 && 0.150 >= val) {
        amount = 10;
      }
      if (val >= 0.151 && 0.200 >= val) {
        amount = 13;
      }
      if (val >= 0.201 && 0.250 >= val) {
        amount = 16;
      }
      this.detailsForm.patchValue({
        bookPostalRate: amount * numOfPcs,
        ifPostal: 'BP'
      });
    } else {
      this.detailsForm.patchValue({
        bookPostalRate: 0,
        ifPostal: 'URP'
      });
    }
  }

  getMultiRates(count) {
    const estimatedAmount = this.detailsForm.value.estimatedAmount;
    const estimation = estimatedAmount * count;
    this.detailsForm.patchValue({
      estimatedAmount: estimation.toFixed(2)
    });
    if (this.detailsForm.value.postalCode == 'POSTAL') {
      this.detailsForm.patchValue({
        postalRateValue : estimation.toFixed(2)
      });
    } else {
      const val = this.detailsForm.value.pcsWtKgs;
      const wt = parseFloat((val / count).toFixed(3));
      let amount = this.getPostalRateByWieghtForSavingBack(wt);
      if (count > 1) {
        amount = amount * count;
      }
      this.detailsForm.patchValue({ postalRateValue: amount.toFixed(2) });
    }
  }

  getPostalRateByWieghtForSavingBack(val) {
    let amt = 0;
    if (val > 0.500) {
      let blnc = val - 0.500;
      if (blnc < 0.500) {
        amt = 19 + 16;
      } else {
        const a = val % 0.500;
        const b = val / 0.500;
        let d = parseInt(b.toFixed(2));
        const c = parseFloat(a.toFixed(3));
        let sum = 0;
        if (c == 0) {
          d = d - 1;
          sum = sum + 19;
        } else {
          sum = sum + 19;
        }
        sum = sum + d * 16;
        amt = sum;
      }
    } else {
      if (val >= 0.001 && 0.020 >= val) {
        amt = 5;
      } else if (val >= 0.021 && 0.040 >= val) {
        amt = 10;
      } else if (val >= 0.041 && 0.060 >= val) {
        amt = 15;
      } else if (val >= 0.061 && 0.500 >= val) {
        amt = 19;
      }
    }
    return amt;
  }

  checkBookPost() {
    let val = parseFloat(this.detailsForm.value.pcsWtKgs);
    let postal = this.detailsForm.value.ifPostal;
    if(postal == 'BD'){
      if( val <= 0.250 ){
        let amount = 0;
        if (val >= 0.001 && 0.050 >= val) {
          amount = 4;
        }
        if (val >= 0.051 && 0.100 >= val) {
          amount = 7;
        }
        if (val >= 0.101 && 0.150 >= val) {
          amount = 10;
        }
        if (val >= 0.151 && 0.200 >= val) {
          amount = 13;
        }
        if (val >= 0.201 && 0.250 >= val) {
          amount = 16;
        }
        this.detailsForm.patchValue({ bookPostalRate: amount });
      }
    } else {
      this.detailsForm.patchValue({ bookPostalRate: 0 });
    }
  }

  clearVendorList() {
    // this.detailsForm.get('pincodeId').reset();
    this.detailsForm.patchValue({
      pcsWtKgs: 0,
      estimatedAmount: 0
    });
  }

  ifPostalTrue() {// If Postal Type?
    const postalType = this.detailsForm.value.ifPostal;
    this.pincodeRate.getRateMasterPostalBD(postalType).then(res => {
      this.BDPostalRates = res;
    }, err => { throw err; });
  }

  docLoad() {
    const magazine = this.detailsForm.value.docType;
    if (magazine == 2) {
      this.isDocument = true;
      this.detailsForm.patchValue({
        magazineId: null,
        consigneeID: null,
        consignorID: null,
        issueNo: null
      });
    } else {
      this.isDocument = false;
      this.detailsForm.patchValue({
        magazineId: null,
        consigneeID: null,
        consignorID: null,
        issueNo: null
      });
      this.getConsignDetails();
    }
  }

  getReport(): void {
    this.bookingService.getBookingDetailsByIDForReport(this.bookInfo.bookingID).then(res => {
      this.bookedDetailsForReport = res;
      if (this.bookedDetailsForReport && this.bookedDetailsForReport.length > 0) {
        this.pdfService.detailedBookingReportPDF(this.bookedDetailsForReport).subscribe(response => {
          var file = new Blob([response.body], { type: 'application/pdf' });
          var url = window.URL.createObjectURL(file);
          var objectUrl = URL.createObjectURL(file);
          var a = document.createElement('a');
          a.href = objectUrl;
          var id = this.bookedDetailsForReport[0].bookingID;
          a.download = 'Detailed Booking - ' + id + '.pdf';
          a.click();
          window.URL.revokeObjectURL(objectUrl);
        }, err => { throw err; });
      } else {
        this.openSnackBar('No records found', '.');
      }
    });
  }

  autoCalcChanged() {
    let val = this.detailsForm.value.calcType;
    if (val == '1') {
      this.amountAuto = false;
    } else {
      this.amountAuto = true;
    }
  }

  getIssueByMagazine() {
    if (this.detailsForm.value.magazineId != undefined && this.detailsForm.value.magazineId != null) {
      this.bookIssueService.getBookIssueDetailByMagazine(this.detailsForm.value.magazineId).then(res => {
        this.issueList = res;
      }, err => { throw err; })
      this.detailsForm.patchValue({
        issueNo: null
      })
    }
  }

  isSpecialCust() {
    let consigneeID = this.detailsForm.value.consigneeID;
    this.consigneeList.forEach(element => {
      if (consigneeID == element.id) {
        if (element.isSpecialCustomer == true && element.isSpecialCustomer != null) {
          this.openSnackBar('Selected consignee is a special customer, Please choose special booking options', '');
          this.detailsForm.get('consigneeID').reset();
          return 0;
        }
      }
    })
  }

  getPincodeList() {
    // let val = this.detailsForm.value.cityCode;
    // this.pincodeServiceable.getPincodeServiceByCity(val).then(res => {
    //   this.detailsForm.get('pincodeId').reset();
    //   this.cityList = res;
    // })
  }

  addClick() {
    this.router.navigate(['/misRouted'], { queryParams: { bookingMF: this.bookingInfo[0].bookingMF, HAWB: this.bookingInfo[0].secHAWB, MAWB: this.bookingInfo[0].secMawbno, run: this.bookingInfo[0].secRunno } });
  }

}

// <<<<<<<<<<<<<<<<<< --------------- Dialog Box TS File ------------------->>>>>>>>>>>>>>>>>>>>>
@Component({
  selector: 'consignDialog',
  templateUrl: 'consignDetailDialog.html',
})
export class DialogOverviewExampleDialog {

  consignType: any[];
  magazineList: any[];
  docTypeList: any[];
  dialogForm: FormGroup;
  consType: any;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private consignService: ConsignServiceService,
    private documentService: DocumentMagazineService) {

    this.dialogForm = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'city': [null, Validators.compose([Validators.required])],
      'address': [null, Validators.compose([Validators.required])],
      'type': [null],
      'magazine': [null],
      'contactNumber': [null],
      'zipCode': [null, Validators.compose([Validators.required])],
      'docID': [null],
      'isSpecialCustomer': [null]
    });
  }

  ngOnInit() {

    this.dialogForm.patchValue({ type: this.data.type });
    if (this.data.type == '1') {
      this.consType = 'Consignor';
    }
    if (this.data.type == '2') {
      this.consType = 'Consignee';
    }

    this.documentService.getMagazineDetails().then(res => {
      this.magazineList = res;
    }, err => { throw err; });

    this.documentService.getDocumentDetails().then(res => {
      this.docTypeList = res;
    }, err => { throw err; });

  }

  // Magazine Search
  magazineTypeSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  // Document Search
  documentTypeSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.type.toLocaleLowerCase().indexOf(term) > -1;
  }

  saveDetails(): void {
    // this.dialogForm.value.magazine = this.data.magazineId == undefined ? null : this.data.magazineId;
    // this.dialogForm.value.docID = this.data.docType == undefined ? null : this.data.docType;
    this.consignService.addConsignDetails(this.dialogForm.value).subscribe(res => {
    }, err => { throw err; });
    this.dialogRef.close();
  }

  back() {
    this.dialogRef.close();
  }

}

//  <<<<<<<<<<<<<<<<< ------------- Issue Dialog Model ------------- >>>>>>>>>>>>>>>
@Component({
  selector: 'issueDialog',
  templateUrl: 'issueDetailDialog.html'
})
export class IssueDialogComponent {

  issueForm: FormGroup;

  title: String;
  constructor(private dialogRef: MatDialogRef<IssueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder, private dtpService: DtpBindFormatService,
    private bookIssueService: BookIssueService) {
    this.issueForm = this.fb.group({
      'issType': [null, Validators.required],
      'issCode': [null, Validators.required],
      'issDate': [null, Validators.required],
      'magazine': [null],
      'cnnoStart': [null],
      'cnnoEnd': [null],
      'createdBy': [null]
    });
  }

  ngOnInit() {
  }

  saveDetails() {
    this.issueForm.value.magazine = this.data.magazineId;
    this.issueForm.value.issDate = this.dtpService.dateISO(this.issueForm.value.issDate);
    let obj = Object.assign({}, this.issueForm.value);
    this.bookIssueService.addBookIssueDetail(obj).subscribe(res => {
    }, err => { throw err; });
    this.dialogRef.close();
  }

  back() {
    this.dialogRef.close();
  }

}