import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import { DashboardDate } from '../../dashboard';
import { OutgoingPacketManifestService } from '../../../services/Transactions/OutgoingPacketManifestService/outgoing-packet-manifest.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import _ from 'underscore';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-out-packed-manifest-report',
  templateUrl: './out-packed-manifest-report.component.html',
  styleUrls: ['./out-packed-manifest-report.component.scss']
})
export class OutPackedManifestReportComponent implements OnInit {

  outPackedForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  dashboardDate: DashboardDate = new DashboardDate();
  data: DashboardDate = new DashboardDate();
  colorTheme = 'theme-blue';
  options: any[];
  userInfo: any;
  outPackedList: any;
  isVendor: any;

  constructor(private fb: FormBuilder,
              private xlsxService: XlsxService,
              private outManifestService: OutgoingPacketManifestService,
              private snackBar: MatSnackBar) {
    this.outPackedForm = this.fb.group({
      range: null,
      choosenType: null
    });
  }

  applyTheme(pop: any) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'YYYY-MM-DD' });
    setTimeout(() => {
      pop.show();
    });
  }

  ngOnInit() {
    this.options = [{'id':'1', 'type':'Vendor Based'},{'id':'2', 'type':'City Based'}];
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
  }

  getDate() {
    
  }

  getData() {
    if (this.outPackedForm.value.range == undefined || this.outPackedForm.value.range == null) {
        this.openSnackBar('Please Select Date Range!', '2');
        return;
    }
    let obj = Object.assign({}, this.outPackedForm.value, this.userInfo);
    obj.fromDate = obj.range[0].toISOString().slice(0, 10);
    obj.toDate = obj.range[1].toISOString().slice(0, 10);
    obj.isVendor = obj.choosenType == 1 ? true : false;
    this.isVendor = obj.choosenType == 1 ? 1 : 2;
    this.outManifestService.getOutPackedReportData(obj).subscribe( res => {
      if (res.status == 200){
        this.outPackedList = res.queryResults;
        var i = 1;
        this.outPackedList.forEach(ele => {
          ele.i = i;
          i = i + 1;
        });
      }
    });
  }

  getDetailed(row) {
    const obj = Object.assign({}, this.outPackedForm.value, this.userInfo, row);
    obj.fromDate = obj.range[0].toISOString().slice(0, 10);
    obj.toDate = obj.range[1].toISOString().slice(0, 10);
    obj.isVendor = obj.choosenType == 1 ? true : false;
    obj.branchName = obj.name == undefined ? '' : obj.name;
    obj.postalCode = obj.isVendor == false ? '' : obj.postalCode;
    this.outManifestService.getOutPackedDetailedReport(obj).subscribe( res => {
      if ( res.status === 200 ) {
        const results = res.queryResults;
        this.exportXlsx(results);
      }
    }, err =>  { throw err; } );
  }

  exportXlsx(obj) {
    const data: any[] = [];
    obj.forEach(element => {
      const val = {
        'Consignment Number': element.cnNO,
        'Pieces': element.noOfPcs,
        'Weight(Kgs)': element.pcsWtKgs,
        'Destination Office': element.name,
        'Pincode': element.pincodeId,
        'Consignee Name': element.consigneeName,
        'Consignee Address': element.consigneeAddress,
        'Outpackaged Date': element.createdDate
      };
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'OutPackage_Detailed_Report');
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == '1') {
      this.snackBar.open(message, "", { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else if (action == '2') {
      this.snackBar.open(message, "", { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    } else {
      this.snackBar.open(message, "", { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }
}
