import { Component, OnInit } from '@angular/core';
import { MisroutedServicesService } from '../../../services/Transactions/misrouted/misrouted-services.service';
import { DashboardDate } from '../../dashboard';
import { ReportsService } from '../../../services/reports/reports.service';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';

@Component({
  selector: 'app-misrouted-report',
  templateUrl: './misrouted-report.component.html',
  styleUrls: ['./misrouted-report.component.scss']
})
export class MisroutedReportComponent implements OnInit {

  listOfMAWB: any[];
  data: any[];
  resultData: any[];
  Temp: any[];
  misroutedReportForm: FormGroup;

  dashboardDate: DashboardDate = new DashboardDate();
  constructor(private reportService: ReportsService,
            private misroutedService: MisroutedServicesService,
            private fb: FormBuilder, 
            private snackBar: MatSnackBar,
            private xlsxService: XlsxService,
            private openDialogBoxService: OpenDialogBoxService,
            private incomeService: IncomeLoadService) { 
              this.misroutedReportForm = this.fb.group({
                secRunno: null
              });
            }

  ngOnInit() {
    this.incomeService.getIncomingDetails().then(res => {
      this.listOfMAWB = res;
    });
  }

  refreshData() {
    this.reportService.getBehaviorView().subscribe(res => {
      this.data = res;
    });
    this.data['MAWBno'] = this.misroutedReportForm.value.secRunno;
    this.misroutedService.reportMisroutedShipment(this.data).subscribe(res => {
      if(res.length){
        this.resultData = res;
        this.resultData.forEach((element, i) => { element.i = i + 1; });
        this.resultData = [... this.resultData];
        this.Temp = this.resultData;
      }else{
        this.openDialogBoxService.openSnackBar("No records found", "");
      }
    });
  }

  customSearchRunNo(term: string, item: any) { // ngSelect Search - runNo
    term = term.toLocaleLowerCase();
    return item.secRunno.toLocaleLowerCase().indexOf(term) > -1 || item.secMawbno.toLocaleLowerCase().indexOf(term) > -1;
  }

  exportXlsx() {
    const data: any[] = [];
    this.Temp.forEach(element => {
      const val = {
        'S.No': element.i,
        'Consignee Name': element.customerName,
        'Consignee Address': element.custAddress,
        'Consignee City': element.custCity,
        'Consignee State': element.custState,
        'Consignee Country': element.custCountry,
        'Shipper': element.shipperName,
        'Magazine': element.magazineName,
        'Weight(Kgs)': element.pcsWtKgs
      };
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'Misrouted Shipments');
  }

}
