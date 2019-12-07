import { Component, OnInit, TemplateRef, ViewChild, ContentChild, AfterContentInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportsService } from '../../../services/reports/reports.service';
import { DashboardDate } from '../../dashboard';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'underscore';

@Component({
  selector: 'app-vendor-wise',
  templateUrl: './vendor-wise.component.html',
  styleUrls: ['./vendor-wise.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VendorWiseComponent implements OnInit {

  vendorForm: FormGroup;

  //Query Selector
  @ViewChild('tpl') tpl: TemplateRef<any>;
  @ContentChild('tpl') tpl1: TemplateRef<any>;

  Temp: any[];
  mainList: any[];
  fromList: any[];
  toList: any[];

  dashboardDate: DashboardDate = new DashboardDate();
  constructor(private reportService: ReportsService,
              private xlsxService: XlsxService,
              private fb: FormBuilder,
              private incomeService: IncomeLoadService) {
                this.vendorForm = this.fb.group({
                  'fromRunno': [null],
                  'toRunno': [null]
                });
              };

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));;
    let roles = currentUser.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    currentUser.isHO = roles == '9' ? true : false;
    this.formLoadData(currentUser);
  }

  formLoadData(currentUser) {
    this.incomeService.getIncomingBranchWise(currentUser).subscribe((res) => {
      this.mainList = res;
      var element = _.max(res, function(ele) {
          return parseInt(ele.secRunno);
      });
      this.fromList = _.reject(res, function(ele) {
        return ele.secRunno == element.secRunno;
      });
      console.log(this.fromList);
    }, err => { throw err; });
  }

  toListLoad() {
    let fromRunno = this.vendorForm.value.fromRunno;
    if(fromRunno == null || fromRunno == undefined){
      this.toList = [];  
    }
    this.toList = _.reject(this.mainList, (ele) => {
      return parseInt(ele.secRunno) < parseInt(fromRunno);
    });
  }

  getReport() {
    let obj = {
      fromRunno : parseInt(this.vendorForm.value.fromRunno),
      toRunno : parseInt(this.vendorForm.value.toRunno)
    }
    if(obj.fromRunno && obj.toRunno){
      this.reportService.getDeliveryBreakupByRuns(obj).subscribe(res => {
        if(res.statusBool == 200){
          this.Temp = res.data;
          this.Temp.forEach((element, i) => { element.i = i + 1; });
          this.Temp = [... this.Temp];
        }
      });
    }
  }

  refreshData(dashboardDate) {
    this.reportService.getBehaviorView().subscribe(res => {
      console.log(res);
    });
    this.reportService.getVendorReports(dashboardDate).subscribe(res => {
      this.Temp = res.data;
      this.Temp.forEach((element, i) => { element.i = i + 1; });
      this.Temp = [... this.Temp];
    });
  }

  exportXlsx() {
    const data: any[] = [];
    this.Temp.forEach(element => {
      const val = {
        'S.No': element.i,
        'Vendor Name': element.postalCode,
        'No Of Pieces': element.noOfPcs,
        'Total Weight': element.weights,
        'Total Price': element.postalRate
      };
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'Vendorwise Distribution');
  }

}
