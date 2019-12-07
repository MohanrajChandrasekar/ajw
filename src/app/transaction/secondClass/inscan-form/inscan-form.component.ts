import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from 'underscore';
import { MatSnackBar, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-inscan-form',
  templateUrl: './inscan-form.component.html',
  styleUrls: ['./inscan-form.component.scss']
})
export class InscanFormComponent implements OnInit {

  scannList: any[];
  scannedList = [];
  inScannForm: FormGroup;

  constructor(private agentService: AgentDeliveryService,
              private globals: Globals,
              private router: Router,
              private xlsxService: XlsxService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private _route: ActivatedRoute) {
              this.inScannForm = this.fb.group({
                'cnno' : [null]
              });
            }

  ngOnInit() {
    this.globals.role = "Inscan Form";
    this.fetchAllRecords();
  }

  fetchAllRecords() {
    if(this._route.snapshot.queryParams.outMFId){
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let roles = currentUser.roleId.find(element => {
          if(element == '9') return element; //HO RoleId is '9'..
        });
      currentUser.isHO = roles == '9' ? true : false;
      currentUser.refOutMFID = this._route.snapshot.queryParams.outMFId;
      currentUser.postalCode = this._route.snapshot.queryParams.vendor;
      // this.agentService.getInscanByBranchAndOutMF(currentUser).subscribe(res => {
      //   if(res.status == 200){
      //     this.scannList = res.queryResults;
      //   }
      // });
      this.agentService.getScannedCNNOs(currentUser).subscribe(res => {
        if(res.status == 200){
          this.scannedList = res.queryResults;
          console.log(this.scannedList);
        }
      }, err => {throw err;});
    }
  }

  scanning() {
    let cnno = this.inScannForm.value.cnno;
    if(cnno.length == 11){
      let output = _.find(this.scannList, (ele) => {return ele.cnNO == cnno;});
      console.log(output);
      if(!output){
        // Invalid CNNO TOASTER
        this.openSnackBar("Invalid Consignment!",'');
        this.inScannForm.get('cnno').reset();
      } else if(output.cnNO == cnno){
        this.scannedList.push(output);
        this.scannedList = [... this.scannedList];
        this.scannList = _.reject(this.scannList, (ele) => {return ele.cnNO == cnno;});
        this.agentService.updateInscannByCNNO(output).subscribe( res => {
          if(res.status == 200){
            this.openSnackBar("Inscanned Successfully!", '1');
            this.inScannForm.get('cnno').reset();
            // this.fetchAllRecords();
          }
        });
      } 
    }
  }

  goBack() {
    this.router.navigateByUrl('/inscanManifests');
  }

  // Export to xlsl
  exportXlsx() {
    var data: any[] = [];
    this.scannedList.forEach(element => {
      var val = {
        "Consignment Number": element.cnNO,
        "Out Scan MFID": element.refOutMfID,
        "Scanned Date": element.inScannedAT,
        "Consignee Name": element.consigneeName,
        "Consignee Address": element.consigneeAddress,
        "Vendor Name": element.postalCode,
        "Pincode": element.pincodeId
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
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
