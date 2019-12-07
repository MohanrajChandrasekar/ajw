import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import { DashboardDate } from '../../dashboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import _ from 'underscore';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { OfficeService } from '../../../services/Master/officeService/office.service';

@Component({
  selector: 'app-delivery-vendor-report',
  templateUrl: './delivery-vendor-report.component.html',
  styleUrls: ['./delivery-vendor-report.component.scss']
})
export class DeliveryVendorReportComponent implements OnInit {

  outDeliveryForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  dashboardDate: DashboardDate = new DashboardDate();
  data: DashboardDate = new DashboardDate();
  colorTheme = 'theme-blue';
  options: any[];
  userInfo: any;
  outPackedList: any;
  isVendor: any;
  branches: any;

  constructor(private fb: FormBuilder,
              private xlsxService: XlsxService,
              private dtpFormatService: DtpBindFormatService,
              private agentService: AgentDeliveryService,
              private officeServ: OfficeService,
              private snackBar: MatSnackBar) {
    this.outDeliveryForm = this.fb.group({
      range: null,
      branchId: null
    });
  }

  applyTheme(pop: any) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'YYYY-MM-DD' });
    setTimeout(() => {
      pop.show();
    });
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    let roles = this.userInfo.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    this.userInfo.isHO = roles == '9' ? true : false;
    this.officeServ.getOfficeDetails().then(res => {
      this.branches = res.filter( ele => {
        return ele.type === 'BO';
      });
    });
  }

  getData() {
    const obj = Object.assign({}, this.outDeliveryForm.value);
    obj.fromDate = this.dtpFormatService.convert(obj.range[0]);
    obj.toDate = this.dtpFormatService.convert(obj.range[1]);
    if (!this.userInfo.isHO) {
      obj.branchId = this.userInfo.branchId;
    }
    this.agentService.getVendorDistributionList(obj).subscribe( res => {
      if (res.status === 200) {
        this.outPackedList = res.queryResults;
        let i = 1;
        this.outPackedList.forEach(ele => {
          ele.i = i;
          i = i + 1;
        });
      }
    });
  }

  getDetailed(rows) {
    const obj = Object.assign({}, this.outDeliveryForm.value, rows);
    obj.fromDate = this.dtpFormatService.convert(obj.range[0]);
    obj.toDate = this.dtpFormatService.convert(obj.range[1]);
    if (!this.userInfo.isHO) {
      obj.branchId = this.userInfo.branchId;
    }
    this.agentService.getDetailedDistributionByVendor(obj).subscribe( res => {
      if (res.status === 200) {
        const results = res.queryResults;
        this.exportXlsx(results, obj);
      }
    });
  }

  exportXlsx(obj, printData) {
    const data: any[] = [];
    obj.forEach(element => {
      const val = {
        'Consignment Number': element.cnNO,
        'Pieces': element.noOfPcs,
        'Weight(Kgs)': element.pcsWtKgs,
        'Pincode': element.pincodeId,
        'Consignee Name': element.consigneeName,
        'Consignee Address': element.consigneeAddress,
        'Vendor Picked Date': element.createdDate,
        'Delivery Status': (element.podStatus == 1) ? 'Delivered' :
                            (element.podStatus == 0) ? 'Non-Delivered' :
                            (element.podStatus == null) ? 'Not-Updated' : 'Not-Updated',
        'Delivery Date': element.podDelDate
      };
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, printData.postalCode + '_' + printData.fromDate + '_' + printData.toDate);
  }

  exportReport() {
    const data: any[] = [];
    let postalCode = '';
    this.outPackedList.forEach(element => {
      const val = {
        'S.No': element.i,
        'Delivery Vendor': element.postalCode,
        'Total Consignments': element.totCNNO,
        'Total Pieces': element.totNOPcs,
        'Total Weight(Kgs)': element.totWtKgs,
        'Vendor Picked': element.totDeliveryPicked,
        'Vendor Delivered': element.totDelivered,
        'Vendor Delivery Failed': element.totDeliveryFailed,
        'POD Not Updated': element.totNonUpdated
      };
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'DeliveryReport');
  }

}
