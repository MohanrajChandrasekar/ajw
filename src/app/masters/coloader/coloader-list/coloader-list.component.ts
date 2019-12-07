import { Component, OnInit } from '@angular/core';
import { Coloader } from '../coloader';
import { Router } from '@angular/router';
import { ColoaderService } from '../../../services/Master/coloaderService/coloader.service';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-coloader-list',
  templateUrl: './coloader-list.component.html',
  styleUrls: ['./coloader-list.component.scss']
})
export class ColoaderListComponent implements OnInit {

  constructor(private coloaderService: ColoaderService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  coloader: Coloader = new Coloader();
  temp = [];
  coloaderInfo: any[];

  ngOnInit() {
    this.globals.role = "Coloader";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.coloaderService.getColoaderDetails().then((res) => {
      this.coloaderInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  btnClick = function () {
    this.router.navigateByUrl('/ColoaderForm');
  };

  save(): void {
    if (this.coloader.id !== undefined && this.coloader.id > 0) {
      this.coloaderService.updateColoaderDetails(this.coloader)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
    else {
      this.coloaderService.addColoaderDetails(this.coloader)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
  }

  edit(id): void {
    this.router.navigate(['/ColoaderForm'], { queryParams: { id: id } });
  };

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: Coloader[] = this.temp.filter(function (d) {
      return d.coloaderName.toLowerCase().indexOf(val) !== -1 || !val ||
        d.coloaderCode.toLowerCase().indexOf(val) !== -1 || !val ||
        d.coloaderAdd1.toLowerCase().indexOf(val) !== -1 || !val ||
        d.coloaderAdd2.toLowerCase().indexOf(val) !== -1 || !val ||
        d.coloaderContact.toLowerCase().indexOf(val) !== -1 || !val ||
        d.coloaderPhone.toLowerCase().indexOf(val) !== -1 || !val ||
        d.coloaderRepOffType.toLowerCase().indexOf(val) !== -1 || !val ||
        d.coloaderRepOff.toLowerCase().indexOf(val) !== -1 || !val ||
        d.coloaderMode.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.coloaderInfo = temp1;
  }

  delete(id): void {
    var coldrInfo = this.coloaderInfo.filter(coldr => coldr.id === id)
    if (coldrInfo && coldrInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          coldrInfo[0].updatedBy = this.authService.userName;
          this.coloaderService.deleteColoaderDetail(coldrInfo[0]).subscribe(
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

  exportXlsx() {
    var data: any[] = [];
    var i=1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Coloader Code": element.coloaderCode,
        "Coloader Name": element.coloaderName,
        "Address 1": element.coloaderAdd1,
        "Address 2": element.coloaderAdd2,
        "Contact Person Name": element.coloaderContact,
        "Phone Number": element.coloaderPhone,
        "Reporting Office Type": element.coloaderRepOffType,
        "Reporting Office": element.coloaderRepOff,
        "Mode": element.coloaderMode
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}

