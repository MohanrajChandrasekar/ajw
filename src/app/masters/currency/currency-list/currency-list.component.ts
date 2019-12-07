import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CurrencyServiceService } from '../../../services/Master/currencyService/currency-service.service';
import { Globals } from '../../../global';
import { AuthService } from '../../../login/auth.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { Currency } from '../currency';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.scss']
})

export class CurrencyListComponent implements OnInit {

  temp = [];
  currencyList: any[];

  constructor(private currencyService: CurrencyServiceService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Currency Master";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.currencyService.getCurrencyDetails().then((res) => {
      this.currencyList = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  edit(id): void {
    this.router.navigate(['/currencyForm'], { queryParams: { id: id } });
  }

  btnClick(): void {
    this.router.navigateByUrl('/currencyForm');
  }

  delete(id): void {
    var curncyInfo = this.currencyList.filter(curnList => curnList.id === id)
    if (curncyInfo && curncyInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          curncyInfo[0].updatedBy = this.authService.userName;
          this.currencyService.removeCurrencyDetails(curncyInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Delete successfully", "");
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

  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "": i,
        "Dollar": element.dollarRupee,
        "Indian Rupee": element.indianRupee,
      }
      data.push(val);
      i = i + 1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

  // updateFilter(event) {
  //   const val = event.target.value;
  //   let temp1: Currency[] = this.temp.filter(function (d) {
  //     return d.dollarRupee !== -1 || !val ||
  //       d.indianRupee !== -1 || !val;
  //   });
  //   this.currencyList = temp1;
  // }

}

