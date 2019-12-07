import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Globals } from '../../../global';
import { ConsignmentTrackingService } from '../../../services/Transactions/consignmentTrackingService/consignment-tracking.service';
import { _ } from 'underscore';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';


@Component({
  selector: 'app-tracking-bulk',
  templateUrl: './tracking-bulk.component.html',
  styleUrls: ['./tracking-bulk.component.scss']
})
export class TrackingBulkComponent implements OnInit {

  trackForm: FormGroup;
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  trackedList: any[];
  temp: any[];
  masterAwb: any[];
  magazineList: any[];
  shipperList: any[];

  constructor(private globals: Globals,
              private fb: FormBuilder,
              private trackingService: ConsignmentTrackingService,
              private xlsxService: XlsxService) {
              this.trackForm = this.fb.group({
                range: [null],
                mawbNo: [null],
                shipper: [null],
                magazine: [null]
              });
  }

  ngOnInit() {
    this.globals.role = 'Bulk Tracking';
  }

  getDate() {
    let obj = { 'fromDate': '', 'toDate': ''};
    obj.fromDate = this.trackForm.value.range[0].toISOString().slice(0, 10);
    obj.toDate = this.trackForm.value.range[1].toISOString().slice(0, 10);

    this.trackingService.trackByDates(obj).subscribe(res => {
      if(res.status == 200){
        this.trackedList = res.results;
        this.temp = res.results;
        this.masterAwb = _.unique(res.results, ele => { return parseInt(ele.manifestairwayBillNo)});
        // this.magazineList = _.unique(res.results, ele => {ele.magazineName});
        // this.shipperList = _.unique(res.results, ele => {ele.manifestshipper});
      }
    });
  }

  getByMAWB() {
    let val = this.trackForm.value.mawbNo;
    // this.trackForm.patchValue({shipper: '',magazine: ''});
    // this.trackForm.get('shipper').reset();
    let shippers = _.filter(this.temp, function(ele) {
      return ele.manifestairwayBillNo == val;
    });
    this.shipperList = _.unique(shippers, function(ele) {
      return ele.manifestshipper;
    });
    this.trackedList = shippers;
  }

  getByShipper() {
    if(!this.trackForm.value.mawbNo || this.trackForm.value.mawbNo == undefined || this.trackForm.value.mawbNo == null){
      return; //add toaster msg
    }
    // this.trackForm.patchValue({magazine:''});
    this.getByMAWB();
    let val = this.trackForm.value.shipper;
    let magazines = _.filter(this.trackedList, function(ele) {
      return ele.manifestshipper == val;
    });
    this.magazineList = _.unique(magazines, function(ele) {
      return ele.magazineName;
    });
    this.trackedList = magazines;
  }

  getByMagz() {
    if(!this.trackForm.value.mawbNo || this.trackForm.value.mawbNo == undefined || this.trackForm.value.mawbNo == null){
      return; //add toaster msg
    }
    if(!this.trackForm.value.shipper || this.trackForm.value.shipper == undefined || this.trackForm.value.shipper == null){
      return; //add toaster msg
    }
    this.getByShipper();
    let val = this.trackForm.value.magazine;
    let results = _.filter(this.trackedList, function(ele) {
      return ele.magazineName == val;
    });
    this.trackedList = results;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: any[] = this.temp.filter(function (d) {
      return (d.manifestrunNo.indexOf(val) !== -1 || !val) ||
            (d.manifestairwayBillNo.indexOf(val) !== -1 || !val) ||
            (d.manifestHawb.indexOf(val) !== -1 || !val) ||
            (d.manifestshipper.indexOf(val) !== -1 || !val) ||
            (d.cnNO.indexOf(val) !== -1 || !val) ||
            (d.consigneeName.indexOf(val) !== -1 || !val) ||
            (d.branch.toLowerCase().indexOf(val) !== -1 || !val) ||
            (d.destBranch.toLowerCase().indexOf(val) !== -1 || !val);// ||
            // (d.delStatus.toLowerCase().indexOf(val) !== -1 || !val);
      });
    this.trackedList = temp1;
  }

  exportXlsx() { // Export to xlsl
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Run No": element.manifestrunNo,
        "MAWB": element.manifestairwayBillNo,
        "HAWB": element.manifestHawb,
        "Consignment No": element.cnNO,
        "Consignee Name": element.consigneeName,
        "Consignee Address": element.consigneeAddress,
        "Shipper": element.manifestshipper,
        "Origin": element.branch,
        "Destination": element.destBranch,
        "Pincode": element.pincode,
        "Magazine": element.magazineName,
        "Estimated Amount": element.codAmount,
        "Weight (Kgs)": element.weight,
        "Invoice No": element.invoiceNo,
        "Issue No": element.issueCode,
        "Delivery Status": element.delStatus,
        "Delivery Date": element.delDate,
        "Delivery Time": element.delTime 
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

  applyTheme(pop: any) {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme, dateInputFormat: 'DD-MM-YYYY' });
  }

}
