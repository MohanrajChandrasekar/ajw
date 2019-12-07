import { Component, OnInit } from '@angular/core';
import { BookIssue } from '../bookIssue';
import { BookIssueService } from '../../../services/Master/bookIssueService/book-issue.service';
import { Router } from '@angular/router';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-book-issue-list',
  templateUrl: './book-issue-list.component.html',
  styleUrls: ['./book-issue-list.component.scss']
})

export class BookIssueListComponent implements OnInit {

  temp = [];
  bookIssueInfo: any = [];
  bookIssue: BookIssue = new BookIssue();

  constructor(private bookIssueService: BookIssueService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Book Issue Master";
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/bookIssueForm');
  };

  fetchAllRecords(): void {
    this.bookIssueService.getBookIssueDetails().then((res) => {
      this.bookIssueInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; }
    );
  }

  edit(id): void {
    this.router.navigate(['/bookIssueForm'], { queryParams: { Id: id } });
  }

  delete(id): void {
    var bookIssInfo = this.bookIssueInfo.filter(bookIss => bookIss.id === id)
    if (bookIssInfo && bookIssInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure you want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          bookIssInfo[0].updatedBy = this.authService.userName;
          this.bookIssueService.deleteBookIssueDetail(bookIssInfo[0]).subscribe(
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
    let temp1: BookIssue[] = this.temp.filter(function (d) {
      return (d.issCode.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.issType.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.issDate.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.bookIssueInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i=1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Code": element.issCode,
        "Type": element.issType,
        "Issue Date": element.issDate,
        "Magazine":element.MagazineName
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}
