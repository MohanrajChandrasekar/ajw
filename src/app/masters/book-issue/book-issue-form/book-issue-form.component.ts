import { Component, OnInit } from '@angular/core';
import { BookIssue } from '../bookIssue';
import { BookIssueService } from '../../../services/Master/bookIssueService/book-issue.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals, TextConstants } from '../../../global';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';
import { DocumentMagazineService } from '../../../services/Master/documentMagazineService/document-magazine.service';
@Component({
  selector: 'app-book-issue-form',
  templateUrl: './book-issue-form.component.html',
  styleUrls: ['./book-issue-form.component.scss']
})

export class BookIssueFormComponent implements OnInit {

  bookIssueForm: FormGroup;
  bookIssueInfo: any = [];
  bookIssue: BookIssue = new BookIssue();
  magazineList: any[];

  constructor(private bookIssueService: BookIssueService,
    private openDialogBoxService: OpenDialogBoxService,
    private _route: ActivatedRoute, private dtpBinder: DtpBindFormatService,
    private router: Router,
    private authService: AuthService,
    private documentMagazineService: DocumentMagazineService,
    private fb: FormBuilder, private globals: Globals, ) {

    this.bookIssueForm = fb.group({
      'id': '',
      'issType': [null, Validators.required],
      'issCode': [null, Validators.required],
      'issDate': [null, Validators.required],
      'magazine':[null]
    });
  }

  ngOnInit() {
    this.globals.role = 'Book Issue Master';

    this.documentMagazineService.getMagazineDetails().then(res => {
      this.magazineList = res;
    })
    console.log(this._route.snapshot.queryParams.Id);
    if (this._route.snapshot.queryParams.Id) {

      let id: number = this._route.snapshot.queryParams.Id
      this.bookIssueService.getBookIssueDetailById(id).then(res => {
        this.bookIssue = res;
        this.bookIssueForm.patchValue({
          issCode: this.bookIssue.issCode,
          issType: this.bookIssue.issType,
          issDate: this.dtpBinder.jsonDate(res.issDate),
          magazine : this.bookIssue.magazine,
          createdBy: this.bookIssue.createdBy,
          updatedBy: this.bookIssue.updatedBy
        });
      }, err => { throw err; });
    }
  }

  get f() {
    return this.bookIssueForm.controls;
  }

  fetchAllRecords(): void {
    this.bookIssueService.getBookIssueDetails().then((res) => {
      this.bookIssueInfo = res;
      this.bookIssue = res;
      console.log(res);
    }, err => { throw err; });
  }

  save(): void {
    Object.assign({}, this.bookIssue, this.bookIssueForm.value);
    this.bookIssue.issCode = this.bookIssueForm.value.issCode;
    this.bookIssue.issType = this.bookIssueForm.value.issType;
    this.bookIssue.issDate = this.dtpBinder.convert(this.dtpBinder.reConstructDate(this.bookIssueForm.value.issDate));
    this.bookIssue.magazine = this.bookIssueForm.value.magazine;
    this.bookIssue.createdBy = this.authService.userName;
    this.bookIssue.updatedBy = this.authService.userName;
    if (this.bookIssue.id !== undefined && this.bookIssue.id > 0) {
      this.bookIssueService.updateBookIssueDetail(this.bookIssue)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/bookIssueList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.bookIssueService.addBookIssueDetail(this.bookIssue)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/bookIssueList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });

    }
  }

  back() {
    if (this.bookIssueForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/bookIssueList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/bookIssueList');
    }
  }

  reset() {
    this.ngOnInit();
  }


}

