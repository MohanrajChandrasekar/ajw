import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';
import { Agent } from '../../agent-delivery/Agent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { pdfDocService } from '../../../services/Master/pdfDocService/pdfDoc.service';
import { BarcodeService } from '../../../services/sharedServices/barcodeService/barcode.service';
import { AuthService } from '../../../login/auth.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { OutgoingPacketManifestService } from '../../../services/Transactions/OutgoingPacketManifestService/outgoing-packet-manifest.service';
import { _ } from 'underscore';
import { ConsignmentTrackingComponent } from '../../tracking/consignment-tracking/consignment-tracking.component';

@Component({
  selector: 'app-agent-delivery',
  templateUrl: './agent-delivery.component.html',
  styleUrls: ['./agent-delivery.component.scss']
})
export class AgentDeliveryComponent implements OnInit {

  bookedList = [];
  temp: any[];
  barcode: any[];
  agentForm: FormGroup;
  officeBranchList: any[];
  customerType: any[];
  agent: Agent = new Agent;
  editForm: boolean = false;
  deliveryMF: any;
  vendorList: any[];
  outGoingPCKs: any[];
  ifEdit: Boolean = false;
  user: any;
  vendorsList: any;
  consignmentsList: any;

  constructor(private globals: Globals,
    private router: Router,
    private officeService: OfficeService,
    private fb: FormBuilder, 
    private dialog: MatDialog,
    private pdfService: pdfDocService,
    private agentService: AgentDeliveryService,
    private _route: ActivatedRoute,
    private barcodeService: BarcodeService,
    private openDialogBoxService: OpenDialogBoxService,
    private outgoingPacketManifestService: OutgoingPacketManifestService,
    private authService:AuthService,
    private snackBar: MatSnackBar) {

    this.agentForm = this.fb.group({
      'id': '',
      'cnNO': '',
      'refOutMFID': [null],
      'postalCode': [null, Validators.compose([Validators.required])],
      'refOutMFID1': [null],
      'postalCode1': [null],
      'refAgntDestBranchID': [null],
      'refAgntBookingTypeID': [null],
      'refAgntFrnsCode': [null],
      'refAgntMFDate': [null],
      'refAgntMFTime': [null],
      'mfDate1': [null],
      'mfTime1': [null],
      'refAgntDelvMFID': [null, Validators.compose([Validators.required])],
      'refAgntDelvMFID1': [null, Validators.compose([Validators.required])],
      'refAgntRemarks': [null]
    });
  }

  ngOnInit() {
    this.globals.role = 'Franchise / Agent Delivery Manifest';
    this.fetchAllRecords();
  }

  get f() {
    return this.agentForm.controls;
  }

  fetchAllRecords() { // Form Load Data

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const roles = currentUser.roleId.find(element => {
        if (element == '9') {
          return element; // HO RoleId is '9'..
        }
    });
    currentUser.isHO = roles == '9' ? true : false;
    this.user = currentUser;

    if (this._route.snapshot.queryParams.agentDelvMFId) {
      const mfId = this._route.snapshot.queryParams.agentDelvMFId;
      this.editForm = true;
      this.agentService.getAgentDelvryDetailsByMfID(mfId).then(res => {
        const records = res[0];
        this.deliveryMF = records.refAgntDelvMFID;
        this.agentForm.patchValue({
          postalCode: records.postalCode,
          postalCode1: records.postalCode,
          refOutMFID: records.refOutMfID,
          refOutMFID1: records.refOutMfID,
          refAgntDelvMFID: records.refAgntDelvMFID,
          refAgntDelvMFID1: records.refAgntDelvMFID,
          refAgntBookingTypeID: records.refAgntBookingTypeID,
          refAgntFrnsCode: records.refAgntFrnsCode,
          refAgntRemarks: records.refAgntRemarks,
          refAgntDestBranchID: records.refAgntDestBranchID
        });
      }, err => { throw err; });

      this.agentService.getBookedAgentDelvrListByMfID(mfId).then(res => {
        this.bookedList = res;
      }, err => { throw err; });
    } else {

      this.agentService.getDeliverablesVendorsByBranchId(this.user).subscribe( res => {
        if (res.status == 200) {
          this.vendorsList = res.queryResults;
        }
      });
      this.getDeliveryManifestID();
      if (this._route.snapshot.queryParams.outMFId && this._route.snapshot.queryParams.vendor) {
        let outMFId = this._route.snapshot.queryParams.outMFId;
        let vendorName = this._route.snapshot.queryParams.vendor;
        this.agentForm.patchValue({
          refOutMFID : outMFId,
          refOutMFID1: outMFId,
          postalCode: vendorName,
          postalCode1: vendorName
        });
        currentUser.refOutMFID = outMFId;
        currentUser.postalCode = vendorName;
        this.agentService.getBookedListBycnno1(currentUser).subscribe(res => {
          this.bookedList = res;
        }, err => { throw err; });
        this.outgoingPacketManifestService.generateOutMFID().subscribe(res => {
          if (res.statusBool == 200) {
            let refAgntDelvMFID;
            if (this.user.id.length > 3) {
              refAgntDelvMFID = '2' + this.user.id.slice(-2) + '' + res.data[0].outMFID;
            } else {
              refAgntDelvMFID = this.user.id + '' + res.data[0].outMFID;
            }
            this.agentForm.patchValue({
              refAgntDelvMFID: refAgntDelvMFID,
              refAgntDelvMFID1: refAgntDelvMFID
            });
          }
        });
      }
    }

    this.officeService.getOfficeDetails().then(res => {   // Office Branch Details
      this.officeBranchList = res;
    }, err => { throw err; });

    this.customerType = [{ 'id': '1', 'type': 'CUST' }, { 'id': '2', 'type': 'FR' }, { 'id': '3', 'type': 'CASH' }];

    const d = new Date();  // set Current Date & Time
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    const yyyy = d.getFullYear();
    const HH = d.getHours();
    const MM = d.getMinutes();
    const SS = d.getSeconds();
    const date = dd + '/' + mm + '/' + yyyy;
    const time = HH + ':' + MM + ':' + SS;
    this.agentForm.patchValue({ mfDate1: date, mfTime1: time });

    // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.agentService.getOutgoingPCKsList(currentUser).subscribe( res => {
      if (res.status == 200) {
        this.outGoingPCKs = res.data;
        if (this.outGoingPCKs.length) {
          this.outGoingPCKs.push({refOutMFID: 'ALL'});
        }
      }
    }, err => { throw err; });
  }

  updateValue(event, name, rowIndex) {  // Get Details By CNNO
    // if (event.keyCode == 13) {
    const cnno = this.agentForm.value.cnNO;
    if (cnno.length == 11) {
      const len = this.bookedList.length;
      this.bookedList.forEach((element, i) => {
        if (element.cnNO == this.agentForm.value.cnNO) {
          this.bookedList[i]['refOutForDelivery'] = 1;
          this.agentForm.patchValue({cnNO: ''});
          return;
        }
      });
      this.bookedList = [...this.bookedList];
    }
  }

  getDeliveryManifestID() {
    this.agentService.getDeliveryMFID().subscribe(res => {
      if (res.status == 200) {
        let refAgntDelvMFID;
        if (this.user.id.length > 3) {
          refAgntDelvMFID = this.user.id.slice(-2) + '' + res.queryResults[0].refAgentDelvMFID;
        } else {
          refAgntDelvMFID = this.user.id + '' + res.queryResults[0].refAgentDelvMFID;
        }
        this.agentForm.patchValue({
          refAgntDelvMFID: refAgntDelvMFID,
          refAgntDelvMFID1: refAgntDelvMFID
        });
      }
    });
  }

  save() { // Save
    if (!this.bookedList.length) {
      this.openSnackBar('Empty Scanned List!', '');
      return;
    }
    this.agent = Object.assign({}, this.agentForm.value);
    let count = 0;
    for (let i in this.bookedList) {    // Assigned to array of Objects ..
      this.bookedList[i]['refAgntDelvMFID'] = this.agent.refAgntDelvMFID;
      this.bookedList[i]['refAgntFrnsCode'] = this.agent.refAgntFrnsCode;
      this.bookedList[i]['refAgntBookingTypeID'] = this.agent.refAgntBookingTypeID;
      this.bookedList[i]['refAgntDestBranchID'] = this.agent.refAgntDestBranchID;
      this.bookedList[i]['refAgntRemarks'] = this.agent.refAgntRemarks;
      this.bookedList[i]['refOutForDelivery'] = 1;
      if(this.bookedList[i]['refOutForDelivery'] == 1){
        count = count + 1;
      }
      this.bookedList[i]['createdBy'] = this.user.userName;
    }
    
    if (this.bookedList.length > count) {
      const dialogRef = this.openDialog("Partial Consignments only selected, You want save?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.agentService.updateAgentDelivery(this.bookedList).subscribe(res => {
            this.openSnackBar('Updated Successfully!', '1');
            this.router.navigateByUrl('/agentDelivery');
          }, err => { throw err; });
        }
      })
    } else {
      this.agentService.updateAgentDelivery(this.bookedList).subscribe(res => {
        this.openSnackBar('Updated Successfully!', '1');
        this.router.navigateByUrl('/agentDelivery');
      }, err => { throw err; });
    }
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == '1') {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else if (action == '2') {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-orange'] });
    } else {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }

  preventSubmit(event) { // Prevent Submit Action
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== 'textarea') { return false; }
  }

  getReport(): void { // Report Download
    if (this.bookedList && this.bookedList.length > 0) {
      this.pdfService.agentReportPDF(this.bookedList).subscribe(response => {
        const file = new Blob([response.body], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(file);
        const objectUrl = URL.createObjectURL(file);
        const a = document.createElement('a');
        const id = this.bookedList[0].refAgntDelvMFID;
        a.href = objectUrl;
        a.download = 'FR Delivery Manifest - ' + id + '.pdf';
        a.click();
        window.URL.revokeObjectURL(objectUrl);
      }, err => {
        console.log(err);
        throw err;
      });
    } else {
      this.openSnackBar('No records found','.');
    }
  }

  get branchId(): number {
    const _user = this.authService.currentUser();
    if (_user != undefined && _user != null) {
      return this.authService.currentUser().branchId;
    }
    return 0;
  }

  branchSearch(term: string, item: any) { // Branch Custom Search
      term = term.toLocaleLowerCase();
      return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  typeSearch(term: string, item: any) { // Type Custom Search
    term = term.toLocaleLowerCase();
    return item.type.toLocaleLowerCase().indexOf(term) > -1;
  }

  back() {
    if (this.agentForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel('You may lost the data?');
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/agentDelivery');
        }
      }, err => { throw err; });
    } else {
      this.router.navigateByUrl('/agentDelivery');
    }
  }

  // Delete Confirmation
  openDialog(title: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { title: title };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  getScannables() {
    this.user.postalCode = this.agentForm.value.postalCode;
    this.agentService.getDeliverableConsignmentsByBranchId(this.user).subscribe(res => {
      if (res.status == 200) {
        this.consignmentsList = res.queryResults;
        this.bookedList = [];
      }
    });
  }

  scanning() {
    const cnno = this.agentForm.value.cnNO;
    if (cnno.length == 11) {
      const output = _.find(this.consignmentsList, (ele) => {
        return ele.cnNO == cnno;
      });
      const check = _.find(this.bookedList, (ele) => {
        return ele.cnNO == cnno;
      });
      if (check) {
        if (check.cnNO == cnno) {
          this.openSnackBar('Already Scanned!', ''); // Invalid CNNO TOASTER
          this.agentForm.get('cnNO').reset();
          return;
        }
      }
      if (!output) {
        this.openSnackBar('Consignment not in the displayed list, Kindly use track option.!', ''); // Invalid CNNO TOASTER
        this.agentForm.get('cnNO').reset();
      } else if (output.cnNO == cnno) {
        // this.bookedList.push(output);
        this.bookedList.push(output);
        console.log(this.bookedList);
        this.bookedList = [...this.bookedList];
        this.agentForm.get('cnNO').reset();
        this.openSnackBar('Added Successfullly Into Deliverables!', '1');
      }
    }
  }

  openTrackDialog(): void { // Open tracking as dialog box
    const dialogRef = this.dialog.open(ConsignmentTrackingComponent, {
      width: '750px',
      height: '550px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    }, err => { throw err; });
  }

}
