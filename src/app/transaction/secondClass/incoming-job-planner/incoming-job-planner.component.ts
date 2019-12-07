import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { JobPlannerService } from '../../../services/Transactions/jobPlannerService/job-planner.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-incoming-job-planner',
  templateUrl: './incoming-job-planner.component.html',
  styleUrls: ['./incoming-job-planner.component.scss']
})
export class IncomingJobPlannerComponent implements OnInit {

  runNoList: any[];
  jobPlanForm: FormGroup;
  boxPlanForm: FormGroup;
  incomingJobList: any[];
  temp: any[];
  selectedRow = [];
  boxPieces: any[];
  sumWTKGs: any;
  boxUpdate = false;
  editing = {};

  constructor(private globals: Globals,
              private incomeService: IncomeLoadService,
              private fb: FormBuilder,
              private dtpBinder: DtpBindFormatService,
              private jobPlnrService: JobPlannerService,
              private snackBar: MatSnackBar) {
  
    this.jobPlanForm = this.fb.group({
      'secRunno': [null, Validators.compose([Validators.required])],
      'secMawbno': [null, Validators.compose([Validators.required])],
      'secManifestArrDt': [null, Validators.compose([Validators.required])]
    });

    this.boxPlanForm = this.fb.group({
      'id': [null, Validators.compose([Validators.required])],
      'boxPieces': [null, Validators.compose([Validators.required])],
      'pcsWT': [null, Validators.compose([Validators.required])],
    });            
  }

  ngOnInit() {
    this.globals.role = 'Job Planner';
    this.onLoadGet();
  }

  openSnackBar(message: string, action: string) {// SnackBar Toaster
    if (action == "Success") {
      this.snackBar.open(message, '', {duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green']
      });
    } else {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red']
      });
    }
  }

  onLoadGet() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let roles = currentUser.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    currentUser.isHO = roles == '9' ? true : false;
    this.incomeService.getIncomingBranchWise(currentUser).subscribe((res) => {
      this.runNoList = res;
    }, err => { throw err; });
  }

  customSearchRunNo(term: string, item: any) { // ngSelect Search - runNo
    term = term.toLocaleLowerCase();
    return item.secRunno.toLocaleLowerCase().indexOf(term) > -1 || item.secMawbno.toLocaleLowerCase().indexOf(term) > -1;
  }

  cancelClear(indexOf){ // clear Box
    this.boxPieces[indexOf].boxPieces = ""; 
    this.boxPieces[indexOf].pcsWtKgs = ""; 
    this.boxPieces[indexOf].pcsWtLBs = ""; 
  }

  getRunNo(){ // selected runNo
    if(this.jobPlanForm.value.secRunno){
      var val = this.jobPlanForm.value.secRunno;
      var filteredObj = this.runNoList.find(function(item){
        if(item.secRunno === val){return item;}
      });
      this.jobPlanForm.patchValue({
        secMawbno: filteredObj.secMawbno,
        secManifestArrDt: this.dtpBinder.jsonDate(filteredObj.secManifestArrDt)
      });
      if(val){
        this.jobPlnrService.getIncomeDetailsByRunNo(val).then( res => {
          this.incomingJobList = this.temp = res;
        }, err => {throw err;});
      }
      this.boxUpdate = false;
    }
  }

  updateFilter(event) { // filter Update
    const val = event.target.value.toLowerCase();
    let temp1: any[] = this.temp.filter(function (d) {
      return (d.shipperName.toLowerCase().indexOf(val) !== -1 || !val) ||
            (d.secHAWB.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.incomingJobList = temp1;
  }

  refreshTable() { // Refreshing Table 
    let runNo = this.jobPlanForm.value.secRunno;
    if(runNo){
      this.jobPlnrService.getIncomeDetailsByRunNo(this.jobPlanForm.value.secRunno).then( res => {
        this.incomingJobList = this.temp = res;
      }, err => {throw err;});
    }
  }

  onSelect(){ // Data Table Selected
    if(this.selectedRow[0]){
      var val = this.selectedRow[0]['id'];
        let iterations = 0;
        this.incomeService.getBoxDetailByMfstID(val).then( res => {
          this.boxPieces = res;
          this.boxPieces.forEach(function (item){
            iterations = iterations + item.pcsWtKgs;
          });
          this.sumWTKGs = iterations.toFixed(2);
          if(this.boxPieces.length > 0){
            this.boxUpdate = true;
          }else{
            this.boxUpdate = false;
          }
        }, err =>{throw err;});
    }
  }

  calcBoxWt() {
    var val = this.selectedRow[0].id;
    let iterations = 0;
    this.incomeService.getBoxDetailByMfstID(val).then( res => {
      let temp = res;
      temp.forEach(function (item){
        iterations = iterations + item.pcsWtKgs;
      });
      this.sumWTKGs = iterations.toFixed(2);
      if(temp.length > 0){
        this.boxUpdate = true;
      }else{
        this.boxUpdate = false;
      }
    }, err =>{throw err;});
  }

  updateValue(event, cell, rowIndex){ // Event Update in Text box
  
    this.editing[rowIndex + '-' + cell] = false;
    if(event.keyCode != 9){
      if(cell == 'pcsWtLBs'){
        this.boxPieces[rowIndex]['pcsWtKgs'] = this.incomeService.lbs2kgs(event.target.value);
      }
    }
    if(cell == 'pcsWtKgs'){
      this.boxPieces[rowIndex]['pcsWtLBs'] = this.incomeService.kgs2Lbs(event.target.value);
    }
    this.boxPieces[rowIndex][cell] = event.target.value;
    this.boxPieces = [...this.boxPieces];
  }

  indBoxSave(rowIndex) { // Individaul Box update
    let boxVal: number = 0;
    this.boxPieces.forEach(element =>{
      boxVal = boxVal + parseFloat(element.pcsWtKgs)
    });
    let landedWeightKG = (this.selectedRow[0].secLandedWtKGs).toFixed(2); debugger
    if (boxVal.toFixed(2) > landedWeightKG) {
      this.openSnackBar("Box Weight does not match the provided landed weight!","");
    } else {
      this.incomeService.updateBoxDetailByMfstID(this.boxPieces[rowIndex])
        .subscribe( res => {
          this.openSnackBar(res,"Success");
          this.calcBoxWt();
      }, err => { throw err; } );
    }
  }

  saveAllBox(){ // Over All Save
    let boxVal: number = 0;
    this.boxPieces.forEach(element =>{
      boxVal = boxVal + parseFloat(element.pcsWtKgs)
    });
    let landedWeightKG = (this.selectedRow[0].secLandedWtKGs + 0.3).toFixed(2);
    if(boxVal.toFixed(2) > landedWeightKG){
        this.openSnackBar("Box Weight does not match the provided landed weight!","");
        this.calcBoxWt();
    }else{
      this.incomeService.updateAllBoxDetailByMfstID(this.boxPieces).subscribe( res => {
        this.openSnackBar(res,"Success");
        this.calcBoxWt();
      }, err => { throw err; });
    } 
  }   

  clearPlanner() { //clear Planner
    this.jobPlanForm.reset();
    this.incomingJobList = [];
    this.boxUpdate = false;
  }
}
