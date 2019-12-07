import { Component, OnInit } from '@angular/core';
import { Document } from '../document';
import { Router } from '@angular/router';
import { DocumentMagazineService } from '../../../services/Master/documentMagazineService/document-magazine.service';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  temp = [];
  document: Document = new Document();
  documentInfo: any[];

  constructor(private documentMagazineService: DocumentMagazineService,
    private router: Router,
    private globals: Globals,
    private authService: AuthService,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Document Master";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.documentMagazineService.getDocumentDetails().then((res) => {
      this.documentInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  btnClick = function () {
    this.router.navigateByUrl('/DocumentForm');
  };

  save(): void {
    if (this.document.id !== undefined && this.document.id > 0) {
      this.documentMagazineService.updateDocumentMagazineDetail(this.document)
        .subscribe(res => {
          this.fetchAllRecords();
        },
          err => {
            throw err;
          });
    }
    else {
      this.documentMagazineService.addDocumentMagazineDetail(this.document)
        .subscribe(res => {
          this.fetchAllRecords();
        },
          err => {
            throw err;
          });
    }
  }

  edit(id): void {
    this.router.navigate(['/DocumentForm'], { queryParams: { id: id } });
  };

  delete(id): void {
    var docInfo = this.documentInfo.filter(doc => doc.id === id)
    if (docInfo && docInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          docInfo[0].updatedBy = this.authService.userName;
          this.documentMagazineService.deleteDocumentMagazineDetail(docInfo[0]).subscribe(
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
    let temp1: Document[] = this.temp.filter(function (d) {
      return (d.code.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.description.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.documentInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "": i,
        "Code": element.code,
        "Description": element.description,
      }
      data.push(val);
      i = i + 1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }
}
