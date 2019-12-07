import { Component, OnInit, ViewChild } from '@angular/core';
import { Office } from '../office';
import { Router } from '@angular/router';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { MatDialog } from '@angular/material/dialog';
import { OfficeCardDetailsComponent } from '../../office/office-card-details/office-card-details.component';
import { Globals } from '../../../global';
import { pdfDocService } from '../../../services/Master/pdfDocService/pdfDoc.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service'
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.scss']
})

export class OfficeListComponent implements OnInit {
  @ViewChild('datatable') datatable: any;

  temp = [];
  officeInfo: any = [];

  constructor(private officeService: OfficeService,
    private router: Router,
    public dialog: MatDialog,
    private globals: Globals,
    private pdfService: pdfDocService,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Office";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.officeService.getOfficeDetails().then((res) => {
      this.officeInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: Office[] = this.temp.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val) || 
            (d.type.toLowerCase().indexOf(val) !== -1 || !val) ||
            (d.code.toLowerCase().indexOf(val) !== -1 || !val) ||
            (d.pin.toLowerCase().indexOf(val) !== -1 || !val) ||
            (d.ent.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.officeInfo = temp1;
  }

  edit(id): void {
    this.router.navigate(['/OfficeForm'], { queryParams: { id: id } });
  };

  delete(id): void {
    var offcInfo = this.officeInfo.filter(offc => offc.id === id)
    if (offcInfo && offcInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          offcInfo[0].updatedBy = this.authService.userName;
          this.officeService.deleteOfficeDetail(offcInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted successfully", "");
            },
            err => {
              throw err;
            });
        }
      },
      err => {
        throw err;
      });
    }
  }

  btnClick = function () {
    this.router.navigateByUrl('/OfficeForm');
  };

  // // Download PDF 
  // getReport(): void {

  //   // alert('hhh');
  //   console.log(this.officeInfo);
  //   if (this.officeInfo && this.officeInfo.length > 0) {

  //     this.pdfService.officeReportPDF(this.officeInfo).subscribe(response => {
  //       console.log(response);
  //       var file = new Blob([response.body], { type: 'application/pdf' });
  //       var url = window.URL.createObjectURL(file);
  //       console.log(url);
  //       // window.open(url);
  //       console.log(file);
  //       var objectUrl = URL.createObjectURL(file);
  //       console.log(objectUrl);
  //       // window.open(objectUrl);
  //       //Auto Download PDF
  //       var a = document.createElement("a");
  //       a.href = objectUrl;
  //       a.download = 'OfficeReport' + '.pdf';
  //       a.click();
  //       window.URL.revokeObjectURL(objectUrl);
  //     },
  //       error => {
  //         console.log(error);
  //         // console.log("Error");
  //       });
  //   }
  // };


  cardDetails: string;
  openCardDetails(id): void {
    var offcInfoArray = this.officeInfo.filter(offc => offc.id === id);
    if (offcInfoArray && offcInfoArray.length > 0) {
      var offcInfo = offcInfoArray[0];
      const dialogRef = this.dialog.open(OfficeCardDetailsComponent, {
        width: '400px',
        height: '450px',
        data: offcInfo
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      },
      err => {
        throw err;
      });
    }
  }

  exportXlsx() {
    var data: any[] = [];
    var i =1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Office Type": element.type,
        "Office Code": element.code,
        "Office Name": element.name,
        "Enterprise Name": element.ent,
        "Address 1": element.address1,
        "Address 2": element.address2,
        "City": element.city,
        "Pincode": element.pin,
        "Phone Number": element.phone,
        "Fax Number": element.fax,
        "Email Id": element.email,
        "Contact Person": element.contact,
        "Contract Number": element.contractNo,
        "Contract Date": element.contractDate,
        "Last Renewal Date": element.renewalDate,
        "Expiry Date": element.expDate
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}
