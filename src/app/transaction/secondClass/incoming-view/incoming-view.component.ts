import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { incomeLoad } from '../incomeLoad';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { pdfDocService } from '../../../services/Master/pdfDocService/pdfDoc.service';
import { BarcodeService } from '../../../services/sharedServices/barcodeService/barcode.service';

@Component({
  selector: 'app-incoming-view',
  templateUrl: './incoming-view.component.html',
  styleUrls: ['./incoming-view.component.scss']
})
export class IncomingViewComponent implements OnInit {

  incomeInfo: any[];
  temp: any[];
  income: incomeLoad = new incomeLoad();
  reportDetails: any[];
  barcode:any[];

  constructor(private globals: Globals,
    private incomeService: IncomeLoadService,
    private router: Router,
    private dialog: MatDialog,
    private pdfService: pdfDocService,
    private snackBar: MatSnackBar,
    private barcodeService : BarcodeService,
    private xlsxService: XlsxService) { }

  ngOnInit() {
    this.globals.role = "Master Incoming Packages";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void { // Load Records
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let roles = currentUser.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    currentUser.isHO = roles == '9' ? true : false;
    this.incomeService.getIncomingBranchWise(currentUser).subscribe((res) => {
      this.incomeInfo = res;
      this.temp = res;
    }, err => { throw err; });
  };

  add(): void { // Add Click
    this.router.navigateByUrl('/newIncomeLoad');
  };

  edit(id): void { // Edit Click
    this.router.navigate(['/incomeLoad'], { queryParams: { Id: id } });
  };

  getReport(secMawbno,secRunno): void {
    this.income.secMawbno = secMawbno;
    this.income.secRunno = secRunno;
    this.barcodeService.generateBarcode(secMawbno).subscribe(res=>{
      this.barcode = res;
    }, err => { throw err; })
    this.incomeService.getReportDataByMawbNo(this.income).subscribe(res => {
      if(res.status == 200){
        this.reportDetails = res.data;
        this.pdfService.MawNo(this.reportDetails).subscribe(response => {
          var file = new Blob([response.body], { type: 'application/pdf' });
          var objectUrl = URL.createObjectURL(file);
          var a = document.createElement("a");
          let mawbNo;
          if(!this.reportDetails[0]){
            mawbNo = this.income.secMawbno;
          }else{
            mawbNo = this.reportDetails[0].secMawbno;
          }
          a.href = objectUrl;
          a.download = 'Master Airway Bill Number - ' + mawbNo + '.pdf';
          a.click();
          window.URL.revokeObjectURL(objectUrl);
        },err => { throw err; });
      }
    }, err => { throw err; })
  };

  openDialog(title: string) { // Delete Confirmation
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {title: title};
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  delete(id): void {
    var Info = this.incomeInfo.filter(incInf => incInf.id === id)
    if (Info && Info.length > 0) {
      const dialogRef = this.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.incomeService.deleteIncomeMfst(Info[0]).subscribe(res => {
              this.fetchAllRecords();
              this.openSnackBar("Deleted successfully", "");
            },err => {throw err;});
        }
      }, err => { throw err; });
    }
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "") {
      this.snackBar.open(message, '', {duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green']});
    } else {
      this.snackBar.open(message, '', {duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red']});
    }
  }

  updateFilter(event) { // filter Update
    const val = event.target.value.toLocaleLowerCase();
    let temp1: incomeLoad[] = this.temp.filter(function (d) {
      return (d.secRunno.toLocaleLowerCase().indexOf(val) !== -1 || !val) ||
        (d.secMawbno.toLocaleLowerCase().indexOf(val) !== -1 || !val);
        // (d.officeName.toLocaleLowerCase().indexOf(val) !== -1 || !val) || 
        // (d.secDepartureDate.toLocaleLowerCase().indexOf(val) !== -1 || !val) ||
        // (d.secManifestArrDt.toLocaleLowerCase().indexOf(val) !== -1 || !val) ||
        // (d.secManifestDate.toLocaleLowerCase().indexOf(val) !== -1 || !val); 
        
    });
    this.incomeInfo = temp1;
  }

  exportXlsx() { // Export to xlsl
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Run No": element.secRunno,
        "Manifest Airway Bill No": element.secMawbno,
        "Branch": element.secBranch,
        "Departure Date": element.secDepartureDate,
        "Manifest Date": element.secManifestDate,
        "Manifest Arrival Date": element.secManifestArrDt
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

  getGroupedReport(secMawbno,secRunno): void {
    this.income.secMawbno = secMawbno;
    this.income.secRunno = secRunno;
    this.barcodeService.generateBarcode(secMawbno).subscribe(res=>{
      this.barcode = res;
    }, err => { throw err; })
    this.incomeService.getGroupedDetailsByMawbNo(this.income).subscribe(res => {
      this.reportDetails = res;
      if (this.reportDetails && this.reportDetails.length > 0) {
        this.pdfService.MawNoGroupedReport(this.reportDetails).subscribe(response => {
          var file = new Blob([response.body], { type: 'application/pdf' });
          var objectUrl = URL.createObjectURL(file);
          var a = document.createElement("a");
          var id = this.reportDetails[0].secMawbno;
          a.href = objectUrl;
          a.download = 'Master Airway Bill Number - ' + id + '.pdf';
          a.click();
          window.URL.revokeObjectURL(objectUrl);
        },err => {console.log(err);});
      }
      else {
        this.openSnackBar('Enter booking details to get report', '.')
      }
    }, err => { throw err; })
  };

  getWeightReport(secMawbno, secRunno) {
    if (secMawbno !== undefined && secRunno !== undefined) {
      this.income.secMawbno = secMawbno;
      this.income.secRunno = secRunno;
      // this.income.secDelivaryDesc = 
      this.barcodeService.generateBarcode(secMawbno).subscribe(res => {
        this.barcode = res;
      }, err => { throw err; })
      this.incomeService.getWeightBreakupReportByMAWB(this.income).subscribe( res => {
        this.reportDetails = res.data;
        this.reportDetails[0]['secMawbno'] = secMawbno;
        this.reportDetails[0]['secRunno'] = secRunno;
        if (this.reportDetails && this.reportDetails.length > 0) {
          this.pdfService.weightBreakup(this.reportDetails).subscribe(res => {
            var file = new Blob([res.body], { type: 'application/pdf' });
            var objUrl = URL.createObjectURL(file);
            var a = document.createElement('a');
            var id = this.income.secMawbno;
            a.href = objUrl;
            a.download = 'Master Airway Bill Number Breakup - ' + id + '.pdf';
            a.click();
            window.URL.revokeObjectURL(objUrl); 
          }, err => {console.log(err)});
        }
      }, err => {throw err;});
    }else{
      this.openSnackBar('Something went wrong!', 'error');
    }
  }

}
