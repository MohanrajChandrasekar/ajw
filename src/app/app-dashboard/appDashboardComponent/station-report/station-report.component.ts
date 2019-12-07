import { Component, OnInit } from '@angular/core';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '../../../services/reports/reports.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { pdfDocService } from '../../../services/Master/pdfDocService/pdfDoc.service';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-station-report',
  templateUrl: './station-report.component.html',
  styleUrls: ['./station-report.component.scss']
})
export class StationReportComponent implements OnInit {

  stationForm: FormGroup;
  mainList: any[];
  temp: any[];

  constructor(private reportService: ReportsService,
              private xlsxService: XlsxService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private pdfService: pdfDocService,
              private incomeService: IncomeLoadService) { 
                this.stationForm = this.fb.group({
                  'runNo': [null]
                });
              }

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
    }, err => { throw err; });
  }

  getReport() {
    this.temp = [];
    let runNo = this.stationForm.value.runNo;
    if(runNo){
      this.incomeService.getStationArrivalReportByRunNo(runNo).subscribe(res => {
        if(res.statusBool == 200){
          console.log(res.data);
          this.temp = res.data;
          this.temp.forEach((element, i) => { element.i = i + 1; });
          // this.temp = [... this.temp];
        }
      });
    }
  }

  printAsPDF() {
    const dialogRef = this.openDialog("Are you sure to email the report?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.pdfService.stationArrival(this.temp).subscribe(res => {
            console.log(res);
            if(res.status == 200){
              this.openSnackBar(res.message,"Success");
            }else{
              this.openSnackBar(res.message,"Error");
            }
          });
        }
      });
  }

  exportXlsx() {
    debugger
    const data: any[] = [];
    this.temp.forEach(element => {
      const val = {
        'S.No': element.i,
        'HAWB NO': element.secHAWB,
        'No Of Pcs As Per Manifes': element.mfPcs,
        'Total No of Pcs Received': element.lndPcs,
        ' Manifest Wt(In LBS)': element.mfLBS,
        'Manifest Wt(In KGS)': element.mfKGS,
        'Landed Wt(In KGS)': element.lndKGS,
        'Difference': element.diff,
        'Category': element.code
      };
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, 'Station Arrival Report');
  }

  openDialog(title: string) { // Delete Confirmation
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {title: title};
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "Success") {
      this.snackBar.open(message, '', {duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green']});
    } else {
      this.snackBar.open(message, '', {duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red']});
    }
  }

}
