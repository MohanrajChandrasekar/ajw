import { Component, OnInit, Inject } from '@angular/core';
import { Globals } from '../../../global';
import { FailedCnnoHandlingService } from '../../../services/Transactions/failedCnnoHandlingService/failed-cnno-handling.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PincodeRateMasterService } from '../../../services/Master/pincodeRateMasterService/pincode-rate-master.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

export interface DialogData {
  id: string;
  vendorName: string;
  postalCode: number;
  wt: number;
}

@Component({
  selector: 'app-re-booking-consignments',
  templateUrl: './re-booking-consignments.component.html',
  styleUrls: ['./re-booking-consignments.component.scss']
})
export class ReBookingConsignmentsComponent implements OnInit {

  rebookingList: any[];
  temp: any[];
  userInfo: any;

  constructor(
    private globals: Globals,
    private rebookingService: FailedCnnoHandlingService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.globals.role = 'Consignment Rebooking';
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    const roles = this.userInfo.roleId.find(ele => {
      if (ele == '9') {
        return ele;
      } // HO RoleId is '9'..
    });
    this.userInfo.isHO = roles == '9' ? true : false;
    this.fetchData();
  }

  fetchData() {
    this.rebookingService.getRebookingList(this.userInfo).subscribe(res => {
      var data = res;
      data.forEach((element,i) => {
        if (element.resendPOD_Status == null) {
          data[i]['resendPOD_Status'] = -1;
        }
      });
      this.rebookingList = data;
      this.temp = data;
    }, err=> {throw err;});
  }

  edit(id) {
    const obj = this.rebookingList.find( element => {
      if (element.id == id) { return element; }
    });
    if (obj.resendStatus) {
      this.openSnackBar('Cosignment send out for delivery!', '');
      return;
    } debugger
    const dialogRef = this.dialog.open( DialogOverviewChangeVendor , {
      width: '500px',
      height: '350px',
      data: { id: obj.id, vendorName: obj.takenVendorName, postalCode: obj.pincode, wt: obj.cnnoWeightKG}
    });

    dialogRef.afterClosed().subscribe(result => {
     this.fetchData();
    }, err => { throw err; });
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == 'Success') {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }

  updateFilter(event) {      // Filter Function
    const val = event.target.value.toLocaleLowerCase();
    const temp1: any[] = this.temp.filter(function (d) {
        return (d.cnNO.toLowerCase().indexOf(val) !== -1 || !val);
                // (d.name.toLowerCase().indexOf(val) !== -1 || !val) ||
                // (d.refOutMFdate.toString().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rebookingList = temp1;
  }

}


// <<<<<<<<<<<<<<<<<< --------------- Dialog Box TS File ------------------->>>>>>>>>>>>>>>>>>>>>
@Component({
  selector: 'changeVendor',
  templateUrl: 'changeVendor.html',
})
export class DialogOverviewChangeVendor {

  changeForm: FormGroup;
  vendorsList: any[];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewChangeVendor>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private pincodeRate: PincodeRateMasterService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private rebookingService: FailedCnnoHandlingService) {
    this.changeForm = this.fb.group({
      'vendorName': [null, Validators.compose([Validators.required])],
      'deliveryMFId': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.pincodeRate.getRateMasterCode().then(res => {
      console.log(res);
      this.vendorsList = res;
    }, err => { throw err; });
  }

  getVendorRate() {
    const obj = [];
    obj[0] = { 'vendorName': this.changeForm.value.vendorName, 'wt': this.data.wt };
    this.rebookingService.getVendorRateByWt(obj[0]).subscribe(res => {
      console.log(res);
      if (res == null) {
        this.openSnackBar('Vendor Cannot handle the weight!', '');
        this.changeForm.get('vendorName').reset();
      } else {
        this.data['rate'] = res.rate;
        this.data['rtoCharge'] = res.returnCharge == null ? 0 : res.returnCharge;
      }
    }, err => { throw err; });
  }

  save() {
    const obj = Object.assign({}, this.data, this.changeForm.value);
    this.rebookingService.addRebooking(obj).subscribe( res => {
      console.log(res);
      this.dialogRef.close();
    }, err => { throw err; });
  }

  back() {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == 'Success') {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }

}
