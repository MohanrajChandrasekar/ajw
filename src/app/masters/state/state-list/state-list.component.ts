import { Component, OnInit } from '@angular/core';
import { State } from '../state';
import { StateService } from '../../../services/Master/stateService/state.service';
import { Router } from '@angular/router';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.scss']
})

export class StateListComponent implements OnInit {

  temp = [];
  stateInfo: any = [];
  state: State = new State();

  constructor(private stateService: StateService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "State Master";
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/stateForm');
  };

  fetchAllRecords(): void {
    this.stateService.getStateDetails().then((res) => {
      this.stateInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; }
    );
  }

  edit(id): void {
    this.router.navigate(['/stateForm'], { queryParams: { Id: id } });
  }

  delete(id): void {
    var statInfo = this.stateInfo.filter(stat => stat.id === id)
    if (statInfo && statInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          statInfo[0].updatedBy = this.authService.userName;
          this.stateService.deleteStateDetail(statInfo[0]).subscribe(
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
    let temp1: State[] = this.temp.filter(function (d) {
      return d.stateCode.toLowerCase().indexOf(val) !== -1 || !val ||
        d.stateName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.stateInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i =1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "StateCode": element.stateCode,
        "StateName": element.stateName
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}

