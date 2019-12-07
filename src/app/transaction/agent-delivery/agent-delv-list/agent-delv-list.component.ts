import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { List } from '../../booking/bookingList/list';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { _ } from 'underscore';

@Component({
  selector: 'app-agent-delv-list',
  templateUrl: './agent-delv-list.component.html',
  styleUrls: ['./agent-delv-list.component.scss']
})
export class AgentDelvListComponent implements OnInit {

  listForm: FormGroup;
  agentDelvrList: any[];
  temp: any[];
  dateInfo: List = new List();
  currentUser: any;
  consignmentsList: any;
  tempConsignmentList: any;

  constructor(private globals: Globals, 
              private fb: FormBuilder, 
              private AgentDelvrService: AgentDeliveryService, 
              private router: Router, 
              private dtpService: DtpBindFormatService, 
              private xlsxService: XlsxService, 
              private dialog: MatDialog, 
              private snackBar: MatSnackBar) {
    this.listForm = this.fb.group({
      'frmDate': [null],
      'toDate': [null],
      'cnno': [null]
    });
  }

  ngOnInit() {
    this.globals.role = "Franchise / Agent";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let roles = this.currentUser.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    this.currentUser.isHO = roles == '9' ? true : false;
    console.log(this.currentUser);
    this.fetchFormData();
  }

  fetchFormData() {    // Get agent delivery details..
    this.AgentDelvrService.getAgentDelvryDetails(this.currentUser).subscribe( res => {
      if(res.status == 200){
        console.log(res.data);
        this.agentDelvrList = res.data;
        this.temp = res.data;
      }
    }, err => {throw err;});

    this.AgentDelvrService.getDeliverableConsignmentsByBranch(this.currentUser).subscribe( res => {
      if(res.status == 200){
        console.log(res);
        this.consignmentsList = res.queryResults;
        this.tempConsignmentList = res.queryResults;
      }
    }, err => {throw err;});
  }

  edit(outMFId, vendorName, agentMFId) {   // Edit agent delivery detail by MFID
    this.router.navigate(['/agentDeliveryForm'],{queryParams: {outMFId: outMFId, vendor: vendorName, agentDelvMFId: agentMFId}});
  }

  addNew() {    // Add new agent delivery detail
    this.router.navigateByUrl('/agentDeliveryForm');
  }

  updateFilter(event) {      // Filter Function
    const val = event.target.value.toLocaleLowerCase();
    let temp1: any[] = this.temp.filter(function (d) {
        return (d.refAgntDelvMFID.toLowerCase().indexOf(val) !== -1 || !val) ||
                (d.postalCode.toLowerCase().indexOf(val) !== -1 || !val) ||
                (d.name.toLowerCase().indexOf(val) !== -1 || !val) ||
                (d.refAgntMFDate.toString().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.agentDelvrList = temp1;
  }

  dateRange() {     // Date Range Filter
    this.currentUser.frmDate = this.dtpService.convert(this.dtpService.reConstructDate(this.listForm.value.frmDate));
    this.currentUser.toDate = this.dtpService.convert(this.dtpService.reConstructDate(this.listForm.value.toDate));
    if(this.currentUser.frmDate && this.currentUser.toDate){
      this.AgentDelvrService.getAgentDeliveryListByDate(this.currentUser).subscribe( res => {
        this.agentDelvrList = res;
        this.temp = res;
      }, err => {throw err;});
    }
  }

  exportXlsx() {     // Export As XLSL
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Manifest ID": element.refAgntDelvMFID,
        "Manifest Date": element.refAgntMFDate,
        "Outscan ID": element.refOutMfID,
        "scanned": element.scanned,
        "DeliveryScanned": element.outForDelivery
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

  delete(refAgntDelvMFID): void {
    if(refAgntDelvMFID == null || refAgntDelvMFID == undefined){
      this.openSnackBar("Can't perform this action!","");
      return;
    }
    var Info = this.agentDelvrList.filter(incInf => incInf.refAgntDelvMFID === refAgntDelvMFID)
      if (Info && Info.length > 0) {
        const dialogRef = this.openDialog("Are you sure want to delete?");
          dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
              this.AgentDelvrService.deleteByMfID(Info[0]).subscribe( res => {
                  this.openSnackBar("Deleted Successfully!", "Success");
                  this.fetchFormData();
              }, err => {throw err;});
            }
      });
    }
  }

  openDialog(title: string) {   // Delete Confirmation
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title
    };
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  scanning() {
    let cnno = this.listForm.value.cnno;
    if(cnno.length == 11){
      let output = _.find(this.consignmentsList, (ele) => {return ele.cnNO == cnno;});
      if(!output){
        // Invalid CNNO TOASTER
        this.openSnackBar("Invalid Consignment!",'');
        this.listForm.get('cnno').reset();
      } else if(output.cnNO == cnno){
        let tempList = _.find(this.agentDelvrList, (ele) => {
          return ele.refOutMfID == parseInt(output.refOutMfID);
        });
        if(tempList.refAgntDelvMFID == null){
          this.AgentDelvrService.getDeliveryMFID().subscribe(res => {
            if(res.status == 200){
              if(this.currentUser.id.length > 3){
                output.refAgntDelvMFID = this.currentUser.id.slice(-2) + '' + res.queryResults[0].refAgentDelvMFID;
              }else{
                output.refAgntDelvMFID = this.currentUser.id + '' + res.queryResults[0].refAgentDelvMFID;
              }
              // output.refAgntDelvMFID = res.queryResults[0].refAgentDelvMFID + this.currentUser.id;
              output.refAgntBookingTypeID = null;
              output.refAgntFrnsCode = null;
              output.refAgntRemarks = null;
              output.refAgntDestBranchID = this.currentUser.branchId;
              output.refOutForDelivery = 1;
              output.createdBy = this.currentUser.userName;
              let obj = [... output];
              this.AgentDelvrService.updateAgentDelivery(obj).subscribe(res => {
                this.openSnackBar("Dellivery Scanned Successfully, Delivery Manifest: " + output.refAgntDelvMFID , 'Success');
                this.listForm.get('cnno').reset();
                this.fetchFormData();
              });
            }
          });
        } else {
              output.refAgntDelvMFID = tempList.refAgntDelvMFID;
              output.refAgntBookingTypeID = null;
              output.refAgntFrnsCode = null;
              output.refAgntRemarks = null;
              output.refAgntDestBranchID = this.currentUser.branchId;
              output.refOutForDelivery = 1;
              output.createdBy = this.currentUser.userName;
              this.agentDelvrList = [... output];
              this.AgentDelvrService.updateAgentDelivery(this.agentDelvrList).subscribe(res => {
                this.openSnackBar("Dellivery Scanned Successfully, Delivery Manifest: " + output.refAgntDelvMFID , 'Success');
                this.listForm.get('cnno').reset();
                this.fetchFormData();
              });
        }
      }
    }
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "Success") {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }

  changeVendor() { //navigate to vendorChange screen
    this.router.navigateByUrl('/changeVendor');
  }
  
}
