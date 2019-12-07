import { Component, OnInit } from '@angular/core';
import { Mode } from '../mode';
import { Router } from '@angular/router';
import { ModeService } from '../../../services/Master/modeService/mode.service';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-mode-list',
  templateUrl: './mode-list.component.html',
  styleUrls: ['./mode-list.component.scss']
})

export class ModeListComponent implements OnInit {

  temp = [];
  mode: Mode = new Mode();
  modeInfo: any[];

  constructor(private modeService: ModeService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Mode Master";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.modeService.getModeDetails().then((res) => {
      this.modeInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  btnClick = function () {
    this.router.navigateByUrl('/ModeForm');
  };

  save(): void {
    if (this.mode.id !== undefined && this.mode.id > 0) {
      this.modeService.updateModeDetails(this.mode)
        .subscribe(res => {
          this.fetchAllRecords();
        },
          err => {
            throw err;
          });
    }
    else {
      this.modeService.addModeDetails(this.mode)
        .subscribe(res => {
          this.fetchAllRecords();
        },
          err => {
            throw err;
          });
    }
  }

  edit(id): void {
    this.router.navigate(['/ModeForm'], { queryParams: { id: id } });
  };

  delete(id): void {
    var mdInfo = this.modeInfo.filter(md => md.id === id)
    if (mdInfo && mdInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          mdInfo[0].updatedBy = this.authService.userName;
          this.modeService.deleteModeDetail(mdInfo[0]).subscribe(
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
    let temp1: Mode[] = this.temp.filter(function (d) {
      return (d.modeCode.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.modeName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.modeInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "": i,
        "Mode": element.modeCode,
        "Description": element.modeName,
      }
      data.push(val);
      i = i + 1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }
}
