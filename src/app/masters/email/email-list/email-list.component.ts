import { Component, OnInit } from '@angular/core';
import { Email } from '../email';
import { Router } from '@angular/router';
import { EmailService } from '../../../services/Master/emailService/email.service';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit {

  temp = [];
  email: Email = new Email();
  emailInfo: any[];

  constructor(private emailService: EmailService,
    private router: Router,
    private globals: Globals,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Email";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.emailService.getEmailDetails().then((res) => {
      this.emailInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  btnClick = function () {
    this.router.navigateByUrl('/EmailForm');
  };

  save(): void {
    if (this.email.id !== undefined && this.email.id > 0) {
      this.emailService.updateEmailDetails(this.email)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
    else {
      this.emailService.addEmailDetails(this.email)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
  }

  edit(id): void {
    this.router.navigate(['/EmailForm'], { queryParams: { id: id } });
  };

  delete(id): void {
    var emInfo = this.emailInfo.filter(em => em.id === id)
    if (emInfo && emInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.emailService.deleteEmailDetail(emInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted email successfully", "");
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
    let temp1: Email[] = this.temp.filter(function (d) {
      return d.branchCode.toLowerCase().indexOf(val) !== -1 || !val ||
        d.branchName.toLowerCase().indexOf(val) !== -1 || !val ||
        d.branchEmail.toLowerCase().indexOf(val) !== -1 || !val ||
        d.branchEmailCC.toLowerCase().indexOf(val) !== -1 || !val ||
        d.branchEmailBCC.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.emailInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Branch Code": element.branchCode,
        "Branch Name": element.branchName,
        "Email Id": element.branchEmail,
        "Email Cc": element.branchEmailCC,
        "Email Bcc": element.branchEmailBCC
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}

