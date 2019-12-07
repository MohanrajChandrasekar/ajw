import { Component, OnInit, Injectable, Inject } from '@angular/core';
import * as XLSX from 'ts-xlsx';
import { Globals } from '../../../global';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';
import { Pod } from '../pod';
import { Router } from '@angular/router';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { FailedCnnoHandlingService } from '../../../services/Transactions/failedCnnoHandlingService/failed-cnno-handling.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from 'underscore';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import * as moment from 'moment';

export interface DialogData {
  uploadData: string;
}

@Component({
  selector: 'app-pod-form',
  templateUrl: './pod-form.component.html',
  styleUrls: ['./pod-form.component.scss']
})
export class PodFormComponent implements OnInit {

  arrayBuffer: any;
  file: File;
  uploadData: any[];
  podList: Pod = new Pod();
  user: any;
  listOfPODs: any;
  podHistory: any;

  constructor(private globals: Globals,
              private router: Router,
              private xlsxService: XlsxService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private dtpFormatService: DtpBindFormatService,
              private  agentDelvService: AgentDeliveryService,
              private failedConsignService: FailedCnnoHandlingService) { }

  ngOnInit() {
    this.globals.role = 'POD Upload';
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.getFormDate();
  }

  getFormDate() {
    this.agentDelvService.getListOfPODs().subscribe(res => {
      if (res.status == 200) {
        this.listOfPODs = res.queryResults;
      }
    });
  } 

  view(podUploadRefID) {
    console.log(podUploadRefID);
    this.router.navigate(['/podListViews'], { queryParams: { podUploadRefID: podUploadRefID }});
  }

  incomingfile(event) {
    this.file = event.target.files[0];
    let m = 0;
    const n = 0;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary'});
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      this.uploadData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      for (const i of this.uploadData) { 
        const check = moment(i.DATE, 'YYYY-MM-DD', true).isValid();
        if (check) {
          this.uploadData[m]['DATE'] =  this.dtpFormatService.convert(i.DATE);
          this.uploadData[m]['isValid'] = true;
          i.delDate = this.dtpFormatService.convert(i.DATE);
        } else {
          this.uploadData[m]['isValid'] = false;
        }
        if (i.STATUS == 'D') {
          this.uploadData[m]['STATUS'] = 1;
        } else {
          this.uploadData[m]['STATUS'] = 0;
        }
        this.uploadData[m]['createdBy'] = this.user.userName;
        this.uploadData[m]['cnNo'] = this.uploadData[m]['CNNO'] === undefined ? '' : this.uploadData[m]['CNNO'];
        this.uploadData[m]['delStatus'] = this.uploadData[m]['STATUS'] === undefined ? '' : this.uploadData[m]['STATUS'];
        this.uploadData[m]['reason'] = this.uploadData[m]['REASON'] === undefined ? '' : this.uploadData[m]['REASON'];
        this.uploadData[m]['delSign'] = this.uploadData[m]['SIGN'] === undefined ? '' : this.uploadData[m]['SIGN'];
        this.uploadData[m]['delDate'] = this.uploadData[m]['DATE'] === undefined ? '' : this.uploadData[m]['DATE'];
        this.uploadData[m]['delTime'] = this.uploadData[m]['TIME'] === undefined ? '' : this.uploadData[m]['TIME'];
        this.uploadData[m]['delCode'] = this.uploadData[m]['CODE'] === undefined ? '' : this.uploadData[m]['CODE'];
        delete this.uploadData[m]['CNNO'];
        delete this.uploadData[m]['STATUS'];
        delete this.uploadData[m]['REASON'];
        delete this.uploadData[m]['SIGN'];
        delete this.uploadData[m]['DATE'];
        delete this.uploadData[m]['TIME'];
        delete this.uploadData[m]['CODE'];
        m = m + 1;
      }
      };
      fileReader.readAsArrayBuffer(this.file);
  }

  Upload() {
    this.openDialog(this.uploadData);
  }

  openDialog(data): void { // Open Dialog Service
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(PodDetailDialogComponent, {
      width: '1050px',
      height: '600px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getFormDate();
    }, err => { throw err; });
  }

  singlePOD() {
    this.router.navigateByUrl('/singlePOD');
  }

  getHistory(podRefID) {
    const obj = { podRefID : podRefID };
    this.agentDelvService.getPODHistory(obj).subscribe(res => {
      if (res.status == 200) {
        this.podHistory = JSON.parse(res.json);
        console.log(this.podHistory);
        const data: any[] = []; debugger
        this.podHistory.forEach(element => {
          const val = {
            'Uploaded Ref.ID': element.podRefID,
            'Consignment Number': element.cnNo,
            'Updated Status': element.isUpdated == 1 ? 'Updated Successfully' : 'Not - Updated, Please check with CNNO.',
            'Error Message': element.error,
            'Is Out Scanned at Source': element.refOutAddStatus ==  undefined ? '' : element.refOutAddStatus == 1 ? 'Done' : 'Not Yet',
            'Is In Scanned': element.isInScanned == undefined ? '' : element.isInScanned == true ? 'Done' : 'Not Yet',
            'Out For Delivery': element.refOutForDelivery == undefined ? '' : element.refOutForDelivery == true ? 'Done' : 'Not Yet',
            'Consignment Exists': element.Consignment == undefined ? '' : element.Consignment == 1 ? ' Exists' : 'Not Exists'
          };
          data.push(val);
        });
        this.xlsxService.saveAsExcelFile(data, 'POD_Uploaded_History_' + this.podHistory[0]['podRefID']);
      }
    });
  }

}

// <<<<<<<<<<<<<<<<<< --------------- Dialog Box TS File ------------------->>>>>>>>>>>>>>>>>>>>>
@Component({
  selector: 'podDetailDialog',
  templateUrl: 'podDetailDialog.html',
})
export class PodDetailDialogComponent {
  [x: string]: any;

  consignType: any[];
  magazineList: any[];
  docTypeList: any[];
  podDialogForm: FormGroup;
  consType: any;
  uploadableData: any;
  invalidCNNO: any;

  constructor(
    private  agentDelvService: AgentDeliveryService,
    public dialogRef: MatDialogRef<PodDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {

    this.podDialogForm = this.fb.group({});
  }

  ngOnInit() {
    
    console.log(this.data);
    this.invalidCount = 0;
    this.validCount = 0;
    this.uploadableData = this.data;
    this.invalidCNNO = _.countBy(this.uploadableData, ele => {
      return ele.isValid;
    });
    console.log(this.invalidCNNO);
  }

  upload() {
    const obj = this.uploadableData.filter( ele => {
      return ele.isValid === true;
    });
    this.agentDelvService.addPOD(obj).subscribe( res => {
      if (res.status == 200) {
        this.openSnackBar(res.msg , 'Success');
        this.dialogRef.close();
      }
    });
  }

  cancel() {
    this.dialogRef.close();
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
}