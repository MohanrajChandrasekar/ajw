import { Component, OnInit } from '@angular/core';
import { Magazine } from '../magazine';
import { Router } from '@angular/router';
import { DocumentMagazineService } from '../../../services/Master/documentMagazineService/document-magazine.service';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-magazine-list',
  templateUrl: './magazine-list.component.html',
  styleUrls: ['./magazine-list.component.scss']
})
export class MagazineListComponent implements OnInit {

  temp = [];
  magazine: Magazine = new Magazine();
  magazineInfo: any[];

  constructor(private documentMagazineService: DocumentMagazineService,
    private router: Router,
    private globals: Globals,
    private authService: AuthService,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Magazine Master";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.documentMagazineService.getMagazineDetails().then((res) => {
      this.magazineInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  btnClick = function () {
    this.router.navigateByUrl('/MagazineForm');
  };

  save(): void {
    if (this.magazine.id !== undefined && this.magazine.id > 0) {
      this.documentMagazineService.updateMagazineDetail(this.magazine)
        .subscribe(res => {
          this.fetchAllRecords();
        },
          err => {
            throw err;
          });
    }
    else {
      this.documentMagazineService.addMagazineDetail(this.magazine)
        .subscribe(res => {
          this.fetchAllRecords();
        },
          err => {
            throw err;
          });
    }
  }

  edit(id): void {
    this.router.navigate(['/MagazineForm'], { queryParams: { id: id } });
  };

  delete(id): void {
    var magInfo = this.magazineInfo.filter(mag => mag.id === id)
    if (magInfo && magInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.documentMagazineService.deleteMagazineDetail(magInfo[0]).subscribe(
            res => {
              magInfo[0].updatedBy = this.authService.userName;
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
    let temp1: Magazine[] = this.temp.filter(function (d) {
      return (d.magazineCode.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.magazineName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.magazineInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "": i,
        "Code": element.magazineCode,
        "Name": element.magazineName
      }
      data.push(val);
      i = i + 1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }
}

