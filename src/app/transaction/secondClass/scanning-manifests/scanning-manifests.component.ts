import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';
import { OutgoingPacketManifestService } from '../../../services/Transactions/OutgoingPacketManifestService/outgoing-packet-manifest.service';
import { _ } from 'underscore';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { ConsignmentTrackingComponent } from '../../tracking/consignment-tracking/consignment-tracking.component';

@Component({
  selector: 'app-scanning-manifests',
  templateUrl: './scanning-manifests.component.html',
  styleUrls: ['./scanning-manifests.component.scss']
})
export class ScanningManifestsComponent implements OnInit {

  inScaneForm: FormGroup;
  currentUser: any;
  inscanList: any[];
  tempScanlist: any[];
  scannList: any[];
  temp: any[];

  constructor(private globals: Globals,
              private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private agentService: AgentDeliveryService,
              private outPackService: OutgoingPacketManifestService) {
                this.inScaneForm = this.fb.group({
                  frmDate: [null],
                  toDate: [null],
                  cnno: [null]
                });
              }

  ngOnInit() {
    this.globals.role = 'Inscan Manifests';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const roles = this.currentUser.roleId.find(element => {
      if (element == '9') {
        return element; // HO RoleId is '9'..
      }
    });
    this.currentUser.isHO = roles == '9' ? true : false;
    this.fetchFormData();
  }

  fetchFormData() {    // Get agent delivery details..
    this.outPackService.getOutPackedForScanning(this.currentUser).subscribe( res => {
        res.forEach(ele => {
          const balance = ele.totCNNO - ele.scanned;
          if (balance) {
            ele.fullyScanned = false;
          } else {
            ele.fullyScanned = true;
          }
        });
        this.inscanList = res;
        this.tempScanlist = res;
        this.temp = res;
    }, err => { throw err; });

    this.agentService.getInScannableByBranch(this.currentUser).subscribe(res => {
      if (res.status == 200) {
        this.scannList = res.queryResults;
      }
    });
  }

  edit(outMFId, vendorName, agentMFId) {   // Edit agent delivery detail by MFID
    this.router.navigate(['/inscanForm'], {queryParams: {outMFId: outMFId, vendor: vendorName, agentDelvMFId: agentMFId}});
  }

  scanning() {
    const cnno = this.inScaneForm.value.cnno;
    if (cnno.length == 11) {
      const output = _.find(this.scannList, (ele) => {
        return ele.cnNO == cnno;
      });
      if (!output) {
        // Invalid CNNO TOASTER
        this.openSnackBar('Consignment not in the displayed list, Kindly use track option.!', '');
        this.inScaneForm.get('cnno').reset();
      } else if (output.cnNO == cnno) {
        const tempList = _.find(this.tempScanlist, (ele) => {
          return ele.refOutMfID == parseInt(output.refOutMfID, 10);
        });
        this.inscanList = [... tempList];
        this.agentService.updateInscannByCNNO(output).subscribe( res => {
          if (res.status == 200) {
            this.openSnackBar('Inscanned Successfully, Outscan Manifest: ' + output.refOutMfID , '1');
            this.inScaneForm.get('cnno').reset();
            this.fetchFormData();
          }
        });
      }
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

  openTrackDialog(): void { // Open tracking as dialog box
    const dialogRef = this.dialog.open(ConsignmentTrackingComponent, {
      width: '750px',
      height: '550px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    }, err => { throw err; });
  }

  updateFilter(event) {      // Filter Function
    const val = event.target.value.toLocaleLowerCase();
    const temp1: any[] = this.temp.filter(function (d) {
        return (d.refOutMfID.toLowerCase().indexOf(val) !== -1 || !val) ||
                (d.name.toLowerCase().indexOf(val) !== -1 || !val) ||
                (d.refOutMFdate.toString().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.inscanList = temp1;
  }

}
