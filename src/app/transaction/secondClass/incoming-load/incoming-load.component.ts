import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { ShipperService } from '../../../services/Master/shipperService/shipper.service';
import { incomeLoad } from '../incomeLoad';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DeliveryCategoryService } from '../../../services/Master/deliveryCategoryService/delivery-category.service';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { BsDatepickerConfig, BsDatepickerDirective  } from 'ngx-bootstrap/datepicker';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';

@Component({
  selector: 'app-incoming-load',
  templateUrl: './incoming-load.component.html',
  styleUrls: ['./incoming-load.component.scss']
})
export class IncomingLoadComponent implements OnInit {

  @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;
  @HostListener('window:scroll')
  onScrollEvent() {this.datepicker.hide();}
  @ViewChild('myTable') table: any;
  bsConfig: Partial<BsDatepickerConfig>;
  colorTheme = 'theme-blue';
  incomeForm: FormGroup;
  listForm: FormGroup;
  temp: any[];
  boxID: Number;
  runFlag: Boolean;
  incomeInfo: incomeLoad = new incomeLoad();
  loadList: any[];
  incomeID: Number;
  boxTemplateFlag: Boolean;
  selectedRow = [];
  boxDetailList: any[];
  deptDate: Date = new Date();
  arrMinDate: any;
  editing = {};
  shipperList: any[];
  deliveryCatList: any[];
  delCatTemp: any[];
  officeBranchList: any[];
  init = 0;
  rtNavBtn = false;
  ltnavBtn = true;
  curr = this.init;
  arrDateVis = true;
  hawbFlag: Boolean;
  isRoleHO: Boolean = false;
  deliveryCatOfHAWB: any[];
  user: any;
  
  

  
  constructor(private _route: ActivatedRoute,
    private incomeService: IncomeLoadService,
    private shipperService: ShipperService,
    private deliveryCat: DeliveryCategoryService,
    private officeService: OfficeService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private openDialogBoxService: OpenDialogBoxService,
    private router: Router,
    private globals: Globals,
    private dtpBinder: DtpBindFormatService) {

    this.incomeForm = this.fb.group({
      'secRunno': [null],
      'secMawbno': [null, Validators.compose([Validators.required, Validators.maxLength(11), Validators.minLength(11)])],
      'secBranch': [null, Validators.compose([Validators.required])],
      'secDepartureDate': [null, Validators.compose([Validators.required])],
      'secManifestArrDt': [null, Validators.compose([Validators.required])],
      'secManifestDate': [null, Validators.compose([Validators.required])],
      'secDeliveryCat': [null],
      'id': [null],
      'branchName': [null]
    });
    this.listForm = this.fb.group({
      'secHAWB': [null, Validators.compose([Validators.required, Validators.maxLength(7), Validators.minLength(7)])],
      'secShipper': [null, Validators.required],
      'secPieces': [null, Validators.compose([Validators.required, Validators.maxLength(4)])],
      'secWeight': [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]+(?:\.[0-9]+)?$')])],
      'secWeightKG': [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]+(?:\.[0-9]+)?$')])],
      'secPickup': [null, Validators.required],
      'secDeliveryCat': [null, Validators.compose([Validators.required])],
      'secFrank': [null],
      'id': [null],
    });
    window.addEventListener('keydown', this.stopScroll.bind(this), false);
  }

  stopScroll: any = (event: any) => { 
    if (this.listForm.value.id) {
      if ([38, 40].indexOf(event.keyCode) > -1) { // up and down arrow keys
        event.preventDefault();
        if (event.keyCode == 38) {
          this.leftNav();
        }
        if (event.keyCode == 40) {
          this.rightNav();
        }
      }
    }
  }

  get f() {
    return this.incomeForm.controls;
  }

  get h() {
    return this.listForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Manifest Incoming Details';
    this.selectLoad();
    if (this._route.snapshot.queryParams.Id) {
      let id: number = this._route.snapshot.queryParams.Id;
      this.incomeID = id;
      this.formDataBind(id);
    } 
    this.boxTemplateFlag = false;
    debugger
    const userInfo = JSON.parse(localStorage.getItem('currentUser'));
    const currentUser = userInfo;
    const roles = currentUser.roleId.find(element => {
      if (element == '9') { return element; } // HO RoleId is '9'..
    });
    this.user = userInfo;
    this.bsConfig = Object.assign({}, { dateInputFormat: 'DD-MM-YYYY', containerClass: this.colorTheme });
    const dt = new Date();
    console.log(dt);
    this.incomeForm.patchValue({
      secManifestArrDt: dt
    });
  }

  formDataBind(id): void { // form data bind
    this.incomeService.getDeliveryCategoryByIncomeID(id).subscribe(res => {
      var deliveryCategory = [];
      if(res.statusBool == 200){
        let result = res.data;
        for(let i=0; i<result.length; i++){
          deliveryCategory[i] = result[i]['categoryId'];
        }
      }
      console.log(deliveryCategory);
      this.incomeService.getIncomingList(id).then(res => {
        this.incomeInfo = res[0];
        this.loadList = res[1];
        this.temp = res[1];
        var deptDate = new Date(this.incomeInfo.secDepartureDate);
        var mfDate = new Date(this.incomeInfo.secManifestDate);
        var mfArrDate = new Date();  
        console.log(mfArrDate);
        this.incomeService.getDeliveryCategoryByRunNo(this.incomeInfo.secRunno).subscribe(res => {
          if(res.statusBool == 200){
            this.deliveryCatOfHAWB = res.data;
          }
        });
        this.incomeForm.patchValue({
          secRunno: this.incomeInfo.secRunno,
          secMawbno: this.incomeInfo.secMawbno,
          secBranch: this.incomeInfo.secBranch,
          secDepartureDate: deptDate,
          secManifestArrDt: mfArrDate,
          secManifestDate: mfDate,
          secDeliveryCat: deliveryCategory,
          id: this.incomeInfo.id
        });
        var secBranch = this.officeBranchList.find(element =>{
          return element.id == this.incomeInfo.secBranch;
        })
        this.incomeForm.patchValue({branchName : secBranch.name});
      }, err => { throw err; });
    });
  }
 
  selectLoad() { //Select Load Call
    this.shipperService.getShipperDetails().then(res => { // Shipper Selection Items
      this.shipperList = res;
    }, err => { throw err; }); 
    this.deliveryCat.getDeliveryCategoryDetails().then(res => { // Delivery Category Items
      this.deliveryCatList = res;
      this.delCatTemp = res;
    }, err => { throw err; });
    this.officeService.getOfficeDetails().then(res => { // Office Branch Items
      this.officeBranchList = res;
    }, err => { throw err; });
  }

  editView(id) { // Edit Row Details
    this.listForm.get('secHAWB').disable();
    this.incomeService.getLoadByID(id).then(res => {
      console.log(res);
      this.incomeInfo.detailLoad = res;
      let pickupDate = new Date(this.incomeInfo.detailLoad.secPickup);
      this.listForm.patchValue({
        secHAWB: this.incomeInfo.detailLoad.secHAWB,
        secShipper: this.incomeInfo.detailLoad.secShipper,
        secPieces: this.incomeInfo.detailLoad.secPieces,
        secWeight: this.incomeInfo.detailLoad.secWeight,
        secWeightKG: this.incomeInfo.detailLoad.secWeightKG,
        secPickup: pickupDate,
        secDeliveryCat: this.incomeInfo.detailLoad.secDeliveryCat,
        secFrank: this.incomeInfo.detailLoad.secFrank,
        incomeID: this.incomeInfo.detailLoad.incomeID,
        id: this.incomeInfo.detailLoad.id
      });
    }, err => { throw err; });
    this.selectedRow = [this.incomeInfo.detailLoad];
  }

  addLoadInfo() { // Add new row Values
    debugger
    let obj = Object.assign({}, this.listForm.value);
    obj.secPickup = new Date(this.listForm.value.secPickup);
    obj.createdBy = this.user.userName;
    obj.updatedBy = this.user.userName;
    if(!obj.secHAWB){
      obj.secHAWB = this.incomeInfo.detailLoad.secHAWB;  
    }
    if (this.incomeID && !obj.id) { // save
      debugger
          obj.incomeID = this.incomeID;
          this.incomeService.addLoadInfo(obj).subscribe(res => {
              this.openSnackBar("Saved Successfully!","Success");
              this.incomeService.getIncomingList(this.incomeID).then(res => {
                  this.loadList = res[1];
                  this.temp = res[1];
                  this.loadList = [...this.loadList];
                  this.listForm.reset();
                }, err => { throw err; });
            }, err => {throw err;});
    } else { //update
      this.incomeService.updateIncomeLoadRowbyID(obj).subscribe(res => {
          this.openSnackBar("Updated Successfully!","Success");
          this.incomeService.getIncomingList(this.incomeID).then(res => {
              this.loadList = res[1];
              this.loadList = [...this.loadList];
              this.temp = res[1];
              this.listForm.reset();
              this.listForm.get('secHAWB').enable();
            }, err => { throw err; });
        }, err => { throw err; });
    }
  }

  lbs2Kgs() { //Lbs to Kgs Convertions
    let lbs = this.listForm.value.secWeight;
    let kgs = 0;
    let unit = 0.453592;
    kgs = kgs + (unit * lbs);
    let str = kgs.toString();
    let got = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) == '.') {got = i;}
    }
    got = got + 4;
    var newStr = str.substring(0, got);
    this.listForm.patchValue({secWeightKG: newStr});
  }

  kgs2Lbs() { //Kgs to Lbs Convertions
    let kgs = this.listForm.value.secWeightKG;
    let lbs = 0;
    let unit = 2.20462;
    lbs = lbs + (unit * kgs);
    let str = lbs.toString();
    let got = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) == '.') {got = i;}
    }
    got = got + 4;
    var newStr = str.substring(0, got);
    this.listForm.patchValue({secWeight: newStr});
  }

  rightNav(): void {   //right navigator
    if (this.init < this.loadList.length) {
      this.curr = this.init;
      let pickupDate = new Date(this.loadList[this.init].secPickup);
      this.listForm.patchValue({
        secHAWB: this.loadList[this.init].secHAWB,
        secShipper: this.loadList[this.init].secShipper,
        secPieces: this.loadList[this.init].secPieces,
        secWeight: this.loadList[this.init].secWeight,
        secWeightKG: this.loadList[this.init].secWeightKG,
        secPickup: pickupDate,
        secFrank: this.loadList[this.init].secFrank,
        incomeID: this.loadList[this.init].incomeID,
        id: this.loadList[this.init].id
      });
      this.selectedRow = [this.loadList[this.init]];
      this.init++;
    } else {
      this.ltnavBtn = true;
    }
    if (this.init > 0) {
      this.ltnavBtn = false;
    }
  }

  leftNav() { //left navigator
    if (this.curr > 0) {
      var i = this.curr - 1;
      let pickupDate = new Date(this.loadList[i].secPickup);
      this.listForm.patchValue({
        secHAWB: this.loadList[i].secHAWB,
        secShipper: this.loadList[i].secShipper,
        secPieces: this.loadList[i].secPieces,
        secWeight: this.loadList[i].secWeight,
        secWeightKG: this.loadList[i].secWeightKG,
        secPickup: pickupDate,
        secFrank: this.loadList[i].secFrank,
        incomeID: this.loadList[i].incomeID,
        id: this.loadList[i].id
      });
      this.selectedRow = [this.loadList[i]];
      this.curr = i;
      this.init--;
    } else {
      this.ltnavBtn = false;
    }
  }

  boxUpdateModel(id): void {
    this.router.navigate(['/boxDetails'], { queryParams: { Id: id, incomeID: this.incomeID } });
  }
  
  toggleExpandGroup(group) { // window.addEventListener()
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle(event) {
    this.loadBoxDetails(event.value.id);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  loadBoxDetails(id) {
    this.incomeService.getBoxDetailByMfstID(id).then(res => {
        this.boxDetailList = res;
      }, err => { throw err; });
  }

  boxUpdate(id): void { //Box Update 
    this.boxID = id;
    let temp1: incomeLoad[] = this.temp.filter(function (d) {
      return (d.id.toLowerCase().indexOf(id) !== -1 || !id);
    });
    this.loadList = temp1;
    if (this.loadList.length == 1) {
      this.boxTemplateFlag = true;
    }
  }

  refreshTable() { // Refresh Table
    this.incomeService.getIncomingList(this.incomeID).then(res => {
      this.loadList = res[1];
      this.temp =res[1];
    }, err => { throw err; });
    this.boxTemplateFlag = false;
  }

  receiveMessage1($event) {
    this.formDataBind(this.incomeID);
    this.boxUpdate($event.mfstID);
  }

  updateIncomeMfst() { // update income Manifst 
    debugger
    let flag = true;
    let obj = Object.assign({}, this.incomeForm.value);
    obj.secDepartureDate = new Date(this.incomeForm.value.secDepartureDate);
    obj.secManifestDate = new Date(this.incomeForm.value.secManifestDate);
    obj.secManifestArrDt = new Date(this.incomeForm.value.secManifestArrDt);
    obj.createdBy = this.user.userName;
    obj.updatedBy = this.user.userName;
    this.loadList.forEach((element, i) =>{
    //   if(this.loadList[i].secLandedPcs > this.loadList[i].secPieces || this.loadList[i].secLandedWtKGs > this.loadList[i].secWeightKG){
    //     this.openSnackBar("Please check the landed wieght/peices!","");
    //     flag = false;
    //   }else{
        this.incomeService.updateLandedPcs(this.loadList[i]).subscribe( res => {
          if ( i == this.loadList.length - 1) {
            this.incomeService.updateIncomeMfst(obj).subscribe(res => {
              this.formDataBind(this.incomeID);
              this.openSnackBar("Updated Successfully!", "Success");
              this.router.navigateByUrl('/incomeView');
            }, err => { throw err; });
          }
        }, err => {throw err;});
    //   }
    });
    // if(flag){
      
    // }
  }
    
  

  isRunNum(e) { // isRunNumber Check
    let runNo = this.incomeForm.value.secRunno;
    if(runNo){
      this.incomeService.isRunNo(this.incomeForm.value.secRunno).then(res => {
        this.runFlag = res[""];
      }, err => { throw err; });
    }
  }

  updateFilter(event) { // filter Update
    const val = event.target.value.toLowerCase();
    let temp1: incomeLoad[] = this.temp.filter(function (d) {
      return (d.secHAWB.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.shipperName.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.secPieces.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.loadList = temp1;
  }

  deCatFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: incomeLoad[] = this.delCatTemp.filter(function (d) {
      return (d.secShipper.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.secHAWB.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.secFrank.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.loadList = temp1;
  }

  deleteList(id) { // delete Income load Detail
    var Info = this.loadList.filter(incInf => incInf.id === id)
    if (Info && Info.length > 0) {
      const dialogRef = this.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.incomeService.deleteIncomeMfstList(Info[0]).subscribe(res => {
              this.refreshTable();
              this.openSnackBar("Deleted successfully", "Success");
              this.listForm.reset();
              this.listForm.get('secHAWB').enable();
            }, err => { throw err; });
        }
      }, err => { throw err; });
    }
  }

  openDialog(title: string) { // Delete Confirmation
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {title: title};
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "Success") {
      this.snackBar.open(message, '',  {duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green']});
    } else {
      this.snackBar.open(message, '', {duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red']});
    }
  }

  cloneToFields(id) { // copy from table row to fields without ID
    this.incomeService.getLoadByID(id).then(res => {
      this.incomeInfo.detailLoad = res;
      let pickupDate = new Date(this.incomeInfo.detailLoad.secPickup);
      this.listForm.patchValue({
        secShipper: this.incomeInfo.detailLoad.secShipper,
        secPieces: this.incomeInfo.detailLoad.secPieces,
        secWeight: this.incomeInfo.detailLoad.secWeight,
        secWeightKG: this.incomeInfo.detailLoad.secWeightKG,
        secPickup: pickupDate,
        secFrank: this.incomeInfo.detailLoad.secFrank,
        incomeID: this.incomeInfo.detailLoad.incomeID,
        id: ''});
    }, err => { throw err; });
  }

  customSearchDelCateg(term: string, item: any) { // ngSelect Search - Delivery Category
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchBranch(term: string, item: any) { // ngSelect Search - Branch
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchShipper(term: string, item: any) { // ngSelect Search - Branch
    term = term.toLocaleLowerCase();
    return item.shipperCode.toLocaleLowerCase().indexOf(term) > -1 || item.shipperName.toLocaleLowerCase().indexOf(term) > -1;
  }
    
  setArrivDate(event){ // Date Changed
    // this.arrDateVis = false;
    // let arrDate = new Date(this.incomeForm.value.secManifestDate);
    // this.incomeForm.patchValue({secManifestArrDt: arrDate});
    // this.arrMinDate = arrDate;
  }

  updateValue(event, cell, rowIndex){ // Event Update in Text box
    this.editing[rowIndex + '-' + cell] = false;
    if(cell == 'secLandedWtLBs'){
      this.loadList[rowIndex]['secLandedWtKGs'] = this.incomeService.lbs2kgs(event.target.value);
    }
    if(cell == 'secLandedWtKGs'){
      this.loadList[rowIndex]['secLandedWtLBs'] = this.incomeService.kgs2Lbs(event.target.value);
    }
    this.loadList[rowIndex][cell] = event.target.value;
    this.loadList = [...this.loadList];
  }
 
  updateLanded(rowIndex){
    // if(this.loadList[rowIndex].secLandedPcs > this.loadList[rowIndex].secPieces || this.loadList[rowIndex].secLandedWtKGs > this.loadList[rowIndex].secWeightKG){
    //   this.openSnackBar("Please check the landed wieght or peices!","");
    //   return
    // }else{
      this.incomeService.updateLandedPcs(this.loadList[rowIndex]).subscribe( res => {
        this.openSnackBar(res,"Success");
      }, err => {throw err;});
    // }
  }

  isHouseAirwayBillNO_duplicate(){ //checking the hawnNo is duplicate.
    let hawnNo = this.listForm.value.secHAWB;
    if(hawnNo){
      this.incomeService.isHawnNo(hawnNo).then( res =>{
        let flag = res[""];
        if(flag == '0'){
          this.hawbFlag = false;
        }else{
          this.hawbFlag = true;
        }
      });
    }
  }
  
  back(){
    if(this.listForm.dirty || this.incomeForm.dirty){
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/incomeView');
        }
      }, err => { throw err; });
    }
    else{
      this.router.navigateByUrl('/incomeView');
    }
  }

  applyTheme(pop: any) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'DD-MM-YYYY' });
    setTimeout(() => {
      pop.show();
    });
  }

  onRemoved($event) {
    let obj = {
      incomeId: this._route.snapshot.queryParams.Id,
      categoryId: $event.value.id
    }
    this.incomeService.removeCategiryByIdAndIncomeID(obj).subscribe(res => {
      console.log(res);
    })
  }

  onCleared() {
    this.incomeService.setClearAllCategoryByIncomeID(this._route.snapshot.queryParams.Id).subscribe(res => {
      console.log(res);
    });
  }

}
