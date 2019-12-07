import { Component, OnInit } from '@angular/core';
import { ColoaderRate } from '../coloaderRate';
import { ColoaderRateService } from '../../../services/Master/coloaderRateService/coloader-rate.service';
import { Router } from '@angular/router';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';

@Component({
  selector: 'app-coloader-rate-list',
  templateUrl: './coloader-rate-list.component.html',
  styleUrls: ['./coloader-rate-list.component.scss']
})
export class ColoaderRateListComponent implements OnInit {

  constructor(private coloaderRateService: ColoaderRateService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) { }

  temp = [];
  coloaderRateInfo: any = [];
  coloaderRate: ColoaderRate = new ColoaderRate();

  ngOnInit() {
    this.globals.role = "Coloader Rate";
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/coloaderRateForm');
  };

  fetchAllRecords(): void {
    this.coloaderRateService.getColoaderRateDetails().subscribe((res) => {
      this.coloaderRateInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; }
    );
  }

  edit(id): void {
    this.router.navigate(['/coloaderRateForm'], { queryParams: { Id: id } });
  }

  delete(id): void {
    var coRateInfo = this.coloaderRateInfo.filter(coRate => coRate.id === id)
    if (coRateInfo && coRateInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.coloaderRateService.deleteColoaderRateDetail(coRateInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted coloaderRate successfully", "");
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
    let temp1: ColoaderRate[] = this.temp.filter(function (d) {
      return (d.coloaderName.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.modeName.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.origin.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.destination.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.coloaderRateInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "BR Code": element.brCode,
        "Customer Code": element.custCode,
        "From Date": element.fromDate,
        "To Date": element.toDate,
        "Wt From": element.wtFrom,
        "Wt To": element.wtTo,
        "Rate": element.rate
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}



