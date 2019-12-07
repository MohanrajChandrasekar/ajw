import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OutgoingPacketManifestService } from '../../../services/Transactions/OutgoingPacketManifestService/outgoing-packet-manifest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OutgoingPacketManifest } from '../outgoingPacketManifest';
import { List } from '../../../transaction/booking/bookingList/list';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { _ } from 'underscore';

@Component({
  selector: 'app-outgoing-packet-manifest-list',
  templateUrl: './outgoing-packet-manifest-list.component.html',
  styleUrls: ['./outgoing-packet-manifest-list.component.scss']
})
export class OutgoingPacketManifestListComponent implements OnInit {

  outgoingListForm: FormGroup;
  outgoingList: any[];
  temp: any[];
  dateInfo: List = new List();
  currentUser: any;
  outgoingPacketManifest :OutgoingPacketManifest = new OutgoingPacketManifest();

  constructor(private globals: Globals,
    private xlsxService: XlsxService,
    private dtpService: DtpBindFormatService,
    private openDialogBoxService: OpenDialogBoxService,
    private fb: FormBuilder, 
    private outgoingPacketManifestService: OutgoingPacketManifestService, 
    private router: Router,
    private snackBar: MatSnackBar,) {
    this.outgoingListForm = this.fb.group({
      'frmDate': [null],
      'toDate': [null]
    });
  }

  ngOnInit() {
    this.globals.role = "Outgoing Packet";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let roles = this.currentUser.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    this.currentUser.isHO = roles == '9' ? true : false;
    this.fetchFormData();
  }

  fetchFormData() {    // Get agent delivery details..
    this.outgoingPacketManifestService.getOutgoingPacketManifestDetails(this.currentUser).subscribe(res => {
      this.outgoingList = res;
      this.temp = res;
    }, err => { throw err; });
  }

  updateFilter(event) {      // Filter Function
    const val = event.target.value.toLocaleLowerCase();
    let temp1: any[] = this.temp.filter(function (d) {
        return (d.refOutMfID.toLowerCase().indexOf(val) !== -1 || !val) ||
                (d.name.toLowerCase().indexOf(val) !== -1 || !val) ||
                (d.refOutMFdate.toString().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.outgoingList = temp1;
  }

  edit(id) {   // Edit agent delivery detail by MFID
    this.router.navigate(['/outgoingPacketManifestForm'], { queryParams: { refOutMfID: id } });
  }

  addNew() {    // Add new agent delivery detail
    this.router.navigateByUrl('/outgoingPacketManifestForm');
  }

  exportXlsx() {
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Outgoing Packet Manifest": element.refOutMfID,
        "Manifest Date": element.refOutMFdate
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

  dateRange() {     // Date Range Filter
    this.currentUser.frmDate = this.dtpService.convert(this.dtpService.reConstructDate(this.outgoingListForm.value.frmDate));
    this.currentUser.toDate = this.dtpService.convert(this.dtpService.reConstructDate(this.outgoingListForm.value.toDate));
    if (this.currentUser.frmDate && this.currentUser.toDate) {
      this.outgoingPacketManifestService.getOutgoingPacketManifestListByDate(this.currentUser).subscribe(res => {
        this.outgoingList = res;
        this.temp = res;
      }, err => { throw err; });
    }
  }

  delete(id): void {
    var outgoingInfo = this.outgoingList.filter(outgoing => outgoing.refOutMfID === id)
    if (outgoingInfo && outgoingInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.outgoingPacketManifestService.deleteOutgoingList(outgoingInfo[0]).subscribe( res => {
              this.fetchFormData();
              this.openDialogBoxService.openSnackBar("Deleted  successfully", "");
            });
        }
      }, err => { throw err; });
    }
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "Success") {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }

}
