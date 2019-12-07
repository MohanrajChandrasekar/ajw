import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';
import { Globals } from '../../../global';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { PincodeRateMasterService } from '../../../services/Master/pincodeRateMasterService/pincode-rate-master.service';
import { _ } from 'underscore';

@Component({
  selector: 'app-change-vendors',
  templateUrl: './change-vendors.component.html',
  styleUrls: ['./change-vendors.component.scss']
})
export class ChangeVendorsComponent implements OnInit {

  changeForm: FormGroup;
  user: any;
  consignmentsList: any[];
  vendorsList: any[];
  toVendors: any[];
  pinRateList: any[];
  changedList: any[];

  constructor(private fb: FormBuilder,
              private globals: Globals,
              private snackBar: MatSnackBar,
              private pincodeRate: PincodeRateMasterService,
              private agentService: AgentDeliveryService) {
    this.changeForm = this.fb.group({
      fromVendor: [null, Validators.required],
      toVendor: [null, Validators.required],
      cnno: [null, Validators.required],
      rate: [null, Validators.required]
    });
  }

  get f() {
    return this.changeForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Change Vendors';
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var roles = currentUser.roleId.find(element => {
        if(element == '9') return element; //HO RoleId is '9'..
    });
    currentUser.isHO = roles == '9' ? true : false;
    this.user = currentUser;
    this.fetchRecords();
  }

  fetchRecords() {
    this.agentService.getDeliverablesVendorsByBranchId(this.user).subscribe( res => {
      if(res.status == 200){
        this.vendorsList = res.queryResults;
      }
    });

    // this.pincodeRate.getRateMasterCode().then(res => {
    //   this.toVendors = res;
    //   console.log(res);
    // }, err => { throw err; });

    this.pincodeRate.getPincodeRateMasterDetails().then(res => {
      this.pinRateList = res;
      console.log(res);
    }, err => { throw err; });

    this.agentService.getVendorChangedConsignments(this.user).subscribe(res => {
      if(res.status == 200){
        this.changedList = res.queryResults;
        console.log(this.changedList);
      }
    })
  }

  getScannables() {
    this.user.postalCode = this.changeForm.value.fromVendor;
    this.agentService.getDeliverableConsignmentsByBranchId(this.user).subscribe(res => {
      if(res.status == 200){
        this.consignmentsList = res.queryResults;
        console.log(this.consignmentsList);
      }
    });
  }

  setVendor() {
    let toVendor = this.changeForm.value.toVendor;
    if(this.changeForm.value.fromVendor == toVendor){
      this.changeForm.get('toVendor').reset();
      this.openSnackBar('From and To vendors are same!', '');
    }
    var obj = _.find(this.toVendors, (ele) => { return ele.vendorName ==  toVendor; });
    console.log(obj);
    this.changeForm.patchValue({
      rate: obj.rate
    });
  }

  scanning() {
    var cnno = this.changeForm.value.cnno;
    var fromVendor = this.changeForm.value.fromVendor;
    if(cnno.length == 11){
      var obj = _.find(this.consignmentsList, (ele) => { return ele.cnNO == cnno } );
      console.log(obj);
      if(obj == undefined){
        this.openSnackBar('Consignment Not Found!', '');
        this.changeForm.get('toVendor').reset();
        return;
      }
      // var toVendor = this.changeForm.value.toVendor;
      var rateObj = _.filter(this.pinRateList, (ele) => { return ele.postalCode == obj.pincodeId && ele.vendorName != fromVendor } );
      if(rateObj == undefined){
        this.openSnackBar('No matched vedors found!', '');
        this.changeForm.get('toVendor').reset();
        return;
      }
      console.log(rateObj);
      var findObj = _.find(rateObj, (ele) => { return ele.wtFrom <= obj.pcsWtKgs && ele.wtTo >= obj.pcsWtKgs; } );
      if(findObj == undefined){
        this.openSnackBar('Consignment weight not matched!', '');
        this.changeForm.get('toVendor').reset();
        return;
      }
      console.log(findObj);
      this.toVendors = [...findObj];
    }
  }

  onSave() {
    let obj = Object.assign({},  this.changeForm.value, this.user, );
    this.agentService.changeVendor(obj).subscribe(res => {
      if(res.status == 200){
        this.openSnackBar('Successfully Vendor Changed!', '1');
        this.fetchRecords();
        this.changeForm.get('cnno').reset();
        this.changeForm.get('toVendor').reset();
        this.changeForm.get('fromVendor').reset();
      }
    })
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == '1') {
      this.snackBar.open(message, "", { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else if (action == '2') {
      this.snackBar.open(message, "", { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-orange'] });
    } else {
      this.snackBar.open(message, "", { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }

}
