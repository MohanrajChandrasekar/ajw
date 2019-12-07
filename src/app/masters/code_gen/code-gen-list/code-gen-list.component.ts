import { Component, OnInit } from '@angular/core';
import { Code } from '../CodeGen';
import { Router } from '@angular/router';
import { CodeGenService } from '../../../services/Master/codeGenService/code-gen.service';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';
import { debug } from 'util';

@Component({
  selector: 'app-code-gen-list',
  templateUrl: './code-gen-list.component.html',
  styleUrls: ['./code-gen-list.component.scss']
})

export class CodeGenListComponent implements OnInit {

  code: Code = new Code();
  codeGenInfo: any[];
  temp = [];

  constructor(private codeGenService: CodeGenService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Code Generator Master";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.codeGenService.getCodeGenDetails().then((res) => {
      this.codeGenInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; }
    );
  }

  btnClick = function () {
    this.router.navigateByUrl('/CodeGenForm');
  };

  save(): void {
    if (this.code.id !== undefined && this.code.id > 0) {
      this.codeGenService.updateCodeGenDetails(this.code)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
    else {
      this.codeGenService.addCodeGenDetails(this.code)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
  }

  edit(id): void {
    this.router.navigate(['/CodeGenForm'], { queryParams: { id: id } });
  }

  delete(id): void {
    var codgnInfo = this.codeGenInfo.filter(codgn => codgn.id === id)
    if (codgnInfo && codgnInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          codgnInfo[0].updatedBy = this.authService.userName;
          this.codeGenService.deleteCodeGenDetail(codgnInfo[0]).subscribe(
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
    let temp1: Code[] = this.temp.filter(function (d) {
      return (d.codeType.toLowerCase().indexOf(val) !== -1 || !val) || 
      (d.startNo.toLowerCase().indexOf(val) !== -1 || !val) || 
      (d.name.toLowerCase().indexOf(val) !== -1 || !val) || 
      (d.modeName.toLowerCase().indexOf(val) !== -1 || !val) || 
      (d.endNo.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.codeGenInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Branch Name": element.name,
        "Mode": element.modeName,
        "Code Type": element.codeType,
        "Starting Number": element.startNo,
        "Ending Number": element.endNo,
        "Last Number": element.lastNumber
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}


