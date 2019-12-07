import { Component, OnInit } from '@angular/core';
import { PincodeRateMaster } from '../pincodeRateMaster';
import { PincodeRateMasterService } from '../../../services/Master/pincodeRateMasterService/pincode-rate-master.service';
import { Router } from '@angular/router';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-pincode-rate-master-list',
  templateUrl: './pincode-rate-master-list.component.html',
  styleUrls: ['./pincode-rate-master-list.component.scss']
})

export class PincodeRateMasterListComponent implements OnInit {

  temp = [];
  pincodeRateMasterInfo: any = [];
  pincodeRateMaster: PincodeRateMaster = new PincodeRateMaster();

  constructor(private pincodeRateMasterService: PincodeRateMasterService,
    private globals: Globals,
    private router: Router,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Pincode Rate Master";
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/pincodeRateMasterForm');
  };

  fetchAllRecords(): void {
    this.pincodeRateMasterService.getPincodeRateMasterDetails().then((res) => {
      this.pincodeRateMasterInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  edit(id): void {
    this.router.navigate(['/pincodeRateMasterForm'], { queryParams: { Id: id } });
  }

  delete(id): void {
    var pinRateMasterInfo = this.pincodeRateMasterInfo.filter(pinRateMaster => pinRateMaster.id === id)
    if (pinRateMasterInfo && pinRateMasterInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          pinRateMasterInfo[0].updatedBy = this.authService.userName;
          this.pincodeRateMasterService.deletePincodeRateMasterDetail(pinRateMasterInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted successfully", "");
            });
        }
      },
        err => {
          throw err;
        });
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: PincodeRateMaster[] = this.temp.filter(function (d) {
      return d.vendorName.toLowerCase().indexOf(val) !== -1 || !val ||
        d.city.toLowerCase().indexOf(val) !== -1 || !val ||
        d.state.toLowerCase().indexOf(val) !== -1 || !val ;
    });
    this.pincodeRateMasterInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "": i,
        "Vendor Name": element.vendorName,
        "City": element.city,
        "State": element.state,
        "Pincode": element.postalCode,
        "Wt From": element.wtFrom,
        "Wt To": element.wtTo,
        "Rate": element.rate,
        "Return Charge": element.returnCharge,
        "Mode": element.mode,
        "Category": element.category
      }
      data.push(val);
      i = i + 1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}


