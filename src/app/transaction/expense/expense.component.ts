import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Globals } from '../../global';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { IncomeLoadService } from '../../services/Transactions/incomeLoadService/income-load.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ExpenseManagerService } from '../../services/Transactions/expenseManager/expense-manager.service';
import { Expense } from './expense';
import { OpenDialogBoxService } from '../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../login/auth.service';
import { ExpensesService } from '../../services/Master/expensesService/expenses.service';
import { BarcodeService } from '../../services/sharedServices/barcodeService/barcode.service';
import { pdfDocService } from '../../services/Master/pdfDocService/pdfDoc.service';
import { XlsxService } from '../../services/sharedServices/xlsxService/xlsx.service';
import { ReportsService } from '../../services/reports/reports.service';
import { _ } from 'underscore';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  airwayBillList: any[];
  xpncList: any[];
  expense: Expense = new Expense();
  expenseMngrForm: FormGroup;
  expenseManagerList: any[];
  barcode: any[];
  reportDetails: any[];
  options: any[];
  isCustomDuty: Boolean = false;
  isAOCharges: Boolean = false;
  isPaletes: Boolean = false;
  printableData = [];
  firstClass: any[];
  secondClass: any[];
  thirdClass: any[];
  expressClass: any[];
  firstClassDetails = [];
  secondClassDetails = [];
  thirdClassDetails = [];
  fourthClasssDetails = [];

  @ViewChild('table') table: ElementRef;

  colors = ['Red', 'Green', 'Blue', 'Orange', 'Violet'];

  constructor(private incomeService: IncomeLoadService,
    private globals: Globals,
    private fb: FormBuilder,
    private openDialogBoxService: OpenDialogBoxService,
    private expensesService: ExpensesService,
    private authService: AuthService,
    private reportsService: ReportsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private barcodeService: BarcodeService,
    private pdfService: pdfDocService,
    private xlsxService: XlsxService,
    private xpnceService: ExpenseManagerService) {
    this.expenseMngrForm = fb.group({
      'id': '',
      'mawbNo': [null, Validators.compose([Validators.required])] ,
      'customsDA': [null] ,
      'ifChargesAO': [null] ,
      'mfWeight': [null, Validators.compose([Validators.required])],
      'chargesAAI': [null, Validators.compose([Validators.required])] ,
      'chargesAO': [null, Validators.compose([Validators.required])] ,
      'customsDuty': [null] ,
      'commisionDD': [null] ,
      'chargesUnitechCHA': [null],
      'paletesReceived': [null],
      'chargesPacking': [null],
      'noOfPaletes': [null],
      'chargesDelivery': [null],
      'chargesService': [null],
      'chargesAddedService': [null],
      'chargesOthers': [null],
      'chargesOthers1236': [null],
      'chargesFreight': [null],
      'chargesTotal': [null],
      'currency': [null],
    });
  }

  get f() {
    return this.expenseMngrForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Expense Manager';
    this.fetchAllRecords();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const roles = currentUser.roleId.find(element => {
      if (element == '9') {
        return element;
      }  // HO RoleId is '9'..
    });
    currentUser.isHO = roles == '9' ? true : false;
    this.incomeService.getIncomingBranchWise(currentUser).subscribe((res) => {
      this.airwayBillList = res;
    }, err => { throw err; });

    this.options  = [{'id': '1', 'options': 'Yes', 'value': 1}, {'id': '2', 'options': 'No', 'value': 0}];
  }

  airwayBillNoSearch(term: string, item: any) { // Airway Bill No Search.,
    term = term.toLocaleLowerCase();
    return item.secMawbno.toLocaleLowerCase().indexOf(term) > -1 || item.secRunno.toLocaleLowerCase().indexOf(term) > -1;
  }

  xpnceCateSearch(term: string, item: any) { // Expense Category Search.,
    term = term.toLocaleLowerCase();
    return item.expenseCategory.toLocaleLowerCase().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  fetchAllRecords(): void {
    this.xpnceService.getExpenseDetails().then((res) => {
      if (res.status == 200) {
        const data = res.response;
        this.expenseManagerList = data;
      }
    }, err => { throw err; });
  }

  save(expenseMngrForm): void {
    const obj = Object.assign({}, this.expenseMngrForm.value);
    this.expense.secMawbno = this.expenseMngrForm.value.secMawbno;
    this.expense.expenseCategoryID = this.expenseMngrForm.value.expenseCategoryID;
    this.expense.expenses = this.expenseMngrForm.value.expenses;
    obj.createdBy = this.userName;
    obj.updatedBy = this.userName;
    if (obj.id !== undefined && obj.id > 0) {
      this.xpnceService.updateExpenseDetails(obj).subscribe(res => {
          this.openDialogBoxService.openSnackBar("Updated Successfully", "");
          this.expenseMngrForm.reset();
          this.fetchAllRecords();
      }, err => {
          throw err;
      });
    } else {
      this.xpnceService.addExpenseDetails(obj).subscribe(res => {
          this.openDialogBoxService.openSnackBar("Saved Successfully", "");
          this.expenseMngrForm.reset();
          this.fetchAllRecords();
        }, err => {
            throw err;
        });
    }
  }

  reset() {
    this.ngOnInit();
  }

  get userName(): string {
    var _user = this.authService.currentUser();
    if (_user != undefined && _user != null) {
      return this.authService.currentUser().userName;
    }
    return '';
  }

  edit(id) {
    this.xpnceService.getExpenseDetailById(id).then(res => {
      this.expense = res;
      console.log(res);
      if(res.status == 200){
        let data = res.response[0];
        if(data.customsDA){
          this.isCustomDuty = true;
        }
        if(data.paletesReceived){
          this.isAOCharges = true;
        }
        if(data.ifChargesAO){
          this.isPaletes = true;
        }
        this.expenseMngrForm.patchValue({
          id: data.id,
          mawbNo: data.mawbNo,
          mfWeight: data.mfWeight,
          customsDA: data.customsDA == true ? 1 : 0,
          paletesReceived: data.paletesReceived == true ? 1 : 0,
          ifChargesAO: data.ifChargesAO == true ? 1 : 0,
          chargesAAI: data.chargesAAI,
          chargesAddedService: data.chargesAddedService,
          chargesAO: data.chargesAO,
          chargesDelivery: data.chargesDelivery,
          chargesFreight: data.chargesFreight,
          chargesOthers: data.chargesOthers,
          chargesOthers1236: data.chargesOthers1236,
          chargesPacking: data.chargesPacking,
          chargesService: data.chargesService,
          chargesTotal: data.chargesTotal,
          chargesUnitechCHA: data.chargesUnitechCHA,
          commisionDD: data.commisionDD,
          currency: data.currency,
          customsDuty: data.customsDuty,
          noOfPaletes: data.noOfPaletes
        });
      }
    }, err => { throw err; });
  }

  delete(id): void {
    var exInfo = this.expenseManagerList.filter(ex => ex.id === id)
    if (exInfo && exInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.xpnceService.deleteExpenseDetail(exInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted expense successfully", "");
            }, err => { throw err; });
        }
      }, err => { throw err; });
    }
  }

  checksecMawbno() {
    let mawbNo = parseInt(this.expenseMngrForm.value.mawbNo);
    this.xpnceService.getManifestWtByMAWB(mawbNo).subscribe(res =>{
      console.log(res);
      if(res.status == 200){
        let data = res.response[0];
        this.expenseMngrForm.patchValue({
          mfWeight: data.weightKGS
        });
      } 
    });
  }

  back() {
    if (this.expenseMngrForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.expenseMngrForm.reset();
        }
      }, err => { throw err; });
    }
    else {
      this.expenseMngrForm.reset();
    }
  }

  getVendorReport(secMawbno, secRunno): void {
    this.expense.secMawbno = secMawbno;
    this.expense.secRunno = secRunno;
    this.barcodeService.generateBarcode(secMawbno).subscribe(res => {
      this.barcode = res;
    }, err => { throw err; })
    this.xpnceService.vendorwise(this.expense).subscribe(res => {
      this.reportDetails = res;
      if (this.reportDetails && this.reportDetails.length > 0) {
        this.pdfService.vendorwise(this.reportDetails).subscribe(response => {
          var file = new Blob([response.body], { type: 'application/pdf' });
          var url = window.URL.createObjectURL(file);
          var objectUrl = URL.createObjectURL(file);
          var a = document.createElement("a");
          var id1 = this.reportDetails[0].secMawbno;
          var id2 = this.reportDetails[0].secRunno;
          a.href = objectUrl;
          a.download = 'Vendor Expense - ' + id1 + ',' + id2 + '.pdf';
          a.click();
          window.URL.revokeObjectURL(objectUrl);
        }, err => { console.log(err); });
      }
      else {
        this.openSnackBar('No records found', '.')
      }
    }, err => { throw err; })
  };

  getColoaderReport(secMawbno, secRunno): void {
    this.expense.secMawbno = secMawbno;
    this.expense.secRunno = secRunno;
    this.barcodeService.generateBarcode(secMawbno).subscribe(res => {
      this.barcode = res;
    }, err => { throw err; })
    this.xpnceService.coloaderwise(this.expense).subscribe(res => {
      this.reportDetails = res;
      if (this.reportDetails && this.reportDetails.length > 0) {
        this.pdfService.coloaderwise(this.reportDetails).subscribe(response => {
          var file = new Blob([response.body], { type: 'application/pdf' });
          var url = window.URL.createObjectURL(file);
          var objectUrl = URL.createObjectURL(file);
          var a = document.createElement("a");
          var id1 = this.reportDetails[0].secMawbno;
          var id2 = this.reportDetails[0].secRunno;
          a.href = objectUrl;
          a.download = 'Coloader Expense - ' + id1 + ',' + id2 + '.pdf';
          a.click();
          window.URL.revokeObjectURL(objectUrl);
        }, err => { console.log(err); });
      }
      else {
        this.openSnackBar('No records found', '.')
      }
    }, err => { throw err; })
  };

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "") {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-red'] });
    }
  }

  changeFilter(val) {
    if(val == 1){//custom duty
      let customDty = parseInt(this.expenseMngrForm.value.customsDA);
      if(customDty){
        this.isCustomDuty = true;
      }else{
        this.isCustomDuty = false;
      }
    } else if(val ==2) {//AO Charges
      let aoCharges = parseInt(this.expenseMngrForm.value.ifChargesAO);
      if(aoCharges){
        this.isAOCharges = true;
      }else{
        this.isAOCharges = false;
      }
    } else if(val == 3) {//Paletes  
      let paletes = parseInt(this.expenseMngrForm.value.paletesReceived);
      if(paletes){
        this.isPaletes = true;
      }else{
        this.isPaletes = false;
      }
    }
  }

  // Export to xlsl
  reportExpenseBill(row) {
    console.log(row);
    let mawbNo = parseInt(row.mawbNo);
    this.xpnceService.getExpenseBillReportByMAWB(mawbNo).subscribe(res =>{
      console.log(res);
      if(res.status == 200){
        var data = res.response;

        var catA = _.filter(data, ele => { return ele.code == 'A'});
        var catB = _.filter(data, ele => { return ele.code == 'B'});
        var catD = _.filter(data, ele => { return ele.code == 'D'});
        var catE = _.filter(data, ele => { return ele.code == 'E'});

        var result = _.unique(catA, ele => {
          return ele.secShipper && ele.secPickup;
        });
        for(var i=0; i<catA.length; i++){
          for(var j=0; j<result.length; j++){
            if(catA[i].id == result[j].id){
              catA[i]['serviceCharges'] = 25;
            }
          }
        }
        
        catB[0]['serviceCharges'] = 200;
        catE.forEach(ele => {
            ele.serviceCharges = 3;
        });
        catD.forEach(ele => {
          ele.serviceCharges = 50;
        });

        var catAVOS = 0;
        var catAKGS = 0;
        var catAarticles = 0;
        var catASvrChrgs = 0;
        catA.forEach(ele => {
          catAVOS = catAVOS + parseFloat(ele.valueOfStamp);
          catAKGS = catAKGS + parseFloat(ele.secLandedWtKGs);
          catAarticles = catAarticles + parseInt(ele.noOfArticals);
          if(ele.serviceCharges){
            catASvrChrgs = catASvrChrgs + parseFloat(ele.serviceCharges);  
          }
        });

        var catBVOS = 0;
        var catBKGS = 0;
        var catBarticles = 0;
        var catBSvrChrgs = 0;
        catB.forEach(ele => {
          catBVOS = catBVOS + parseFloat(ele.valueOfStamp);
          catBKGS = catBKGS + parseFloat(ele.secLandedWtKGs);
          catBarticles = catBarticles + parseInt(ele.noOfArticals);
          if(ele.serviceCharges){
            catBSvrChrgs = catBSvrChrgs + parseFloat(ele.serviceCharges);  
          }
        });

        var catDVOS = 0;
        var catDKGS = 0;
        var catDarticles = 0;
        var catDSvrChrgs = 0;
        catD.forEach(ele => {
          catDVOS = catDVOS + parseFloat(ele.valueOfStamp);
          catDKGS = catDKGS + parseFloat(ele.secLandedWtKGs);
          catDarticles = catDarticles + parseInt(ele.noOfArticals);
          if(ele.serviceCharges){
            catDSvrChrgs = catDSvrChrgs + parseFloat(ele.serviceCharges);  
          }
        });

        var catEVOS = 0;
        var catEKGS = 0;
        var catEarticles = 0;
        var catESvrChrgs = 0;
        catE.forEach(ele => {
          catEVOS = catEVOS + parseFloat(ele.valueOfStamp);
          catEKGS = catEKGS + parseFloat(ele.secLandedWtKGs);
          catEarticles = catEarticles + parseInt(ele.noOfArticals);
          if(ele.serviceCharges){
            catESvrChrgs = catESvrChrgs + parseFloat(ele.serviceCharges);  
          }
        });

        //First Class
        var catADesc = {
          'valueOfMoney': 'INR', 
          'valueOfStamp' : catAVOS,
          'customsDuty': row.customsDuty,
          'chargesAAI': row.chargesAAI,
          'chargesAO': row.chargesAO,
          'chargesUnitechCHA': row.chargesUnitechCHA,   
          'chargesDelivery' : row.chargesDelivery,
          'bangaloreTransportation' : catAKGS * 8,
          'stickerPastingCharges' : catAarticles * 0.25,
          'chargesOthers' : row.chargesOthers,
          'chargesFreight' : row.chargesFreight,
          'chargesService' : catASvrChrgs * row.currency,
          'total': 0
        };
        catADesc.total = catADesc.valueOfStamp + catADesc.customsDuty + catADesc.chargesAAI + catADesc.chargesAO + catADesc.chargesUnitechCHA + catADesc.chargesDelivery + catADesc.bangaloreTransportation + catADesc.stickerPastingCharges + catADesc.chargesOthers + catADesc.chargesFreight + catADesc.chargesService;
        catADesc.chargesService.toFixed(2);
        catADesc.total.toFixed(2);
        this.firstClassDetails.push(catADesc);

        var usd = parseFloat(row.currency);
        var catADescUSD = {
            'valueOfMoney': 'USD($)',
            'valueOfStamp': (catADesc.valueOfStamp / usd).toFixed(2),
            'customsDuty': (catADesc.customsDuty / usd).toFixed(2),
            'chargesAAI': (catADesc.chargesAAI / usd).toFixed(2),
            'chargesAO': (catADesc.chargesAO / usd).toFixed(2),
            'chargesUnitechCHA': (catADesc.chargesUnitechCHA / usd).toFixed(2),
            'chargesDelivery': (catADesc.chargesDelivery / usd).toFixed(2),
            'bangaloreTransportation': (catADesc.bangaloreTransportation / usd).toFixed(2),
            'stickerPastingCharges': (catADesc.stickerPastingCharges / usd).toFixed(2),
            'chargesOthers': (catADesc.chargesOthers / usd).toFixed(2),
            'chargesFreight': (catADesc.chargesFreight / usd).toFixed(2),
            'chargesService': catASvrChrgs,
            'total': 0
        }
        catADescUSD.total = parseFloat(catADescUSD.valueOfStamp) + parseFloat(catADescUSD.customsDuty) + parseFloat(catADescUSD.chargesAAI) + parseFloat(catADescUSD.chargesAO) + parseFloat(catADescUSD.chargesUnitechCHA) + parseFloat(catADescUSD.chargesDelivery) + parseFloat(catADescUSD.bangaloreTransportation) + parseFloat(catADescUSD.stickerPastingCharges) + parseFloat(catADescUSD.chargesOthers) + parseFloat(catADescUSD.chargesFreight) + catADescUSD.chargesService;
        catADescUSD.total.toFixed(2);
        this.firstClassDetails.push(catADescUSD);

        //Second Class
        var catBDesc = {
          'valueOfMoney': 'INR', 
          'valueOfStamp' : catBVOS,
          'bangaloreTransportation' : catBKGS * 8,
          'stickerPastingCharges' : catBarticles * 0.25,
          'chargesService' : catBSvrChrgs * row.currency,
          'total' : 0
        }
        catBDesc.total = catADesc.valueOfStamp + catADesc.bangaloreTransportation + catADesc.stickerPastingCharges + catADesc.chargesService;
        catBDesc.total.toFixed(2);
        this.secondClassDetails.push(catBDesc);

        var catBDescUSD = {
          'valueOfMoney': 'USD($)',
          'valueOfStamp': (catADesc.valueOfStamp / usd).toFixed(2),
          'bangaloreTransportation': (catADesc.bangaloreTransportation / usd).toFixed(2),
          'stickerPastingCharges': (catADesc.stickerPastingCharges / usd).toFixed(2),
          'chargesService': catASvrChrgs,
          'total': 0
        }
        catBDescUSD.total = parseFloat(catBDescUSD.valueOfStamp) + parseFloat(catBDescUSD.bangaloreTransportation) + parseFloat(catBDescUSD.stickerPastingCharges) +  catBDescUSD.chargesService;
        catBDescUSD.total.toFixed(2);
        this.secondClassDetails.push(catBDescUSD);

        //Door to Door Class
        var catDDesc = {
          'valueOfMoney': 'INR', 
          'valueOfStamp' : catDVOS,
          'bangaloreTransportation' : catDKGS * 8,
          'stickerPastingCharges' : catDarticles * 0.25,
          'chargesService' : catDSvrChrgs * row.currency,
          'total' : 0
        }
        catDDesc.total = catDDesc.valueOfStamp + catDDesc.bangaloreTransportation + catDDesc.stickerPastingCharges + catDDesc.chargesService;
        catDDesc.total.toFixed(2);
        this.thirdClassDetails.push(catDDesc);

        var catDDescUSD = {
          'valueOfMoney': 'USD($)',
          'valueOfStamp': (catDDesc.valueOfStamp / usd).toFixed(2),
          'bangaloreTransportation': (catDDesc.bangaloreTransportation / usd).toFixed(2),
          'stickerPastingCharges': (catDDesc.stickerPastingCharges / usd).toFixed(2),
          'chargesService': catDSvrChrgs,
          'total': 0
        }
        catDDescUSD.total = parseFloat(catDDescUSD.valueOfStamp) + parseFloat(catDDescUSD.bangaloreTransportation) + parseFloat(catDDescUSD.stickerPastingCharges) +  catDDescUSD.chargesService;
        catDDescUSD.total.toFixed(2);
        this.thirdClassDetails.push(catDDescUSD);

        //Express Class
        var catEDesc = {
          'valueOfMoney': 'INR', 
          'valueOfStamp' : catEVOS,
          'bangaloreTransportation' : catEKGS * 8,
          'stickerPastingCharges' : catEarticles * 0.25,
          'chargesService' : catESvrChrgs * row.currency,
          'total' : 0
        }
        catEDesc.total = catEDesc.valueOfStamp + catEDesc.bangaloreTransportation + catEDesc.stickerPastingCharges + catEDesc.chargesService;
        catEDesc.total.toFixed(2);
        this.fourthClasssDetails.push(catEDesc);

        var catEDescUSD = {
          'valueOfMoney': 'USD($)',
          'valueOfStamp': (catEDesc.valueOfStamp / usd).toFixed(2),
          'bangaloreTransportation': (catEDesc.bangaloreTransportation / usd).toFixed(2),
          'stickerPastingCharges': (catEDesc.stickerPastingCharges / usd).toFixed(2),
          'chargesService': catESvrChrgs,
          'total': 0
        }
        catEDescUSD.total = parseFloat(catEDescUSD.valueOfStamp) + parseFloat(catEDescUSD.bangaloreTransportation) + parseFloat(catEDescUSD.stickerPastingCharges) +  catEDescUSD.chargesService;
        catEDescUSD.total.toFixed(2);
        this.fourthClasssDetails.push(catEDescUSD);
        
        console.log(this.firstClassDetails);
        this.firstClass = catA;
        this.secondClass = catB;
        this.thirdClass = catD;
        this.expressClass = catE;
        
      }
    });
  }

  fireEvent() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }

}

