import { Component, OnInit } from '@angular/core';
import { PincodeService } from '../pincodeService';
import { PincodeServiceService } from '../../../services/Master/pincodeServiceService/pincode-service.service';
import { Router } from '@angular/router';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-pin-code-service-list',
  templateUrl: './pin-code-service-list.component.html',
  styleUrls: ['./pin-code-service-list.component.scss']
})
export class PinCodeServiceListComponent implements OnInit {

  temp = [];
  pincodeServiceInfo: any = [];
  pincodeService: PincodeService = new PincodeService();

  constructor(private pincodeServiceService: PincodeServiceService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = 'Servicable Pincode Master';
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/pincodeServiceForm');
  };

  fetchAllRecords(): void {
    this.pincodeServiceService.getPincodeServiceDetails().then((res) => {
      this.pincodeServiceInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  edit(id): void {
    this.router.navigate(['/pincodeServiceForm'], { queryParams: { Id: id } });
  }

  delete(id): void {
    var pinServiceInfo = this.pincodeServiceInfo.filter(pinService => pinService.id === id)
    if (pinServiceInfo && pinServiceInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.pincodeServiceService.deletePincodeServiceDetail(pinServiceInfo[0]).subscribe(
            res => {
              pinServiceInfo[0].updatedBy = this.authService.userName;
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted pincode Service successfully", "");
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
    let temp1: PincodeService[] = this.temp.filter(function (d) {
      return d.ajwCode.toLowerCase().indexOf(val) !== -1 || !val ||
        d.ajwType.toLowerCase().indexOf(val) !== -1 || !val ||
        d.ajwPin.toLowerCase().indexOf(val) !== -1 || !val ||
        d.ajwCity.toLowerCase().indexOf(val) !== -1 || !val ||
        d.ajwArea.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.pincodeServiceInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i =1;
    this.temp.forEach(element => {
      var val = {
        "":1,
        "Code": element.ajwCode,
        "Type": element.ajwType,
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

