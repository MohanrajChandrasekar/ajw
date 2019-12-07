import { Component, OnInit } from '@angular/core';
import { Pincode } from '../pincode';
import { PincodeService } from '../../../services/Master/pincodeService/pincode.service';
import { Router } from '@angular/router';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-pincode-list',
  templateUrl: './pincode-list.component.html',
  styleUrls: ['./pincode-list.component.scss']
})
export class PincodeListComponent implements OnInit {

  temp = [];
  pincodeInfo: any = [];
  pincode: Pincode = new Pincode();

  constructor(private pincodeService: PincodeService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Delivery Pincode Master";
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/pincodeForm');
  };

  fetchAllRecords(): void {
    this.pincodeService.getPincodeDetails().then((res) => {
      this.pincodeInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  edit(id): void {
    this.router.navigate(['/pincodeForm'], { queryParams: { Id: id } });
  }

  delete(id): void {
    var pinInfo = this.pincodeInfo.filter(pin => pin.id === id)
    if (pinInfo && pinInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          pinInfo[0].updatedBy = this.authService.userName;
          this.pincodeService.deletePincodeDetail(pinInfo[0]).subscribe(
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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: Pincode[] = this.temp.filter(function (d) {
      return (d.ajwCity.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.ajwCode.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.ajwType.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.ajwPin.indexOf(val) !== -1 || !val) ||
        (d.ajwArea.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.pincodeInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i=1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Type": element.ajwType,
        "Code": element.ajwCode,
        "Postal Type":element.ajwRateType,
        "Pincode": element.ajwPin,
        "City": element.ajwCity,
        "Area": element.ajwArea
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }
}

