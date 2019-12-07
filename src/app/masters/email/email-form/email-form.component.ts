import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder, } from "@angular/forms";
import { Email } from '../email';
import { EmailService } from '../../../services/Master/emailService/email.service';
import { CustomValidators } from '../../../shared/customValidators';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})

export class EmailFormComponent implements OnInit {

  emailForm: FormGroup;
  email: Email = new Email();
  emailInfo: any[];

  constructor(private emailService: EmailService,
    private router: Router,
    private fb: FormBuilder,
    private globals: Globals,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.emailForm = fb.group({
      'id':'',
      'branchCode': [null, Validators.compose([CustomValidators.stringLength(0, 5), Validators.required, CustomValidators.nospaceValidator()])],
      'branchName': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator(), CustomValidators.stringLength(3, 20)])],
      'branchEmail': [null, Validators.compose([Validators.email])],
      'branchEmailCC': [null, Validators.compose([Validators.email])],
      'branchEmailBCC': [null, Validators.compose([Validators.email])],
    });
    console.log(this.emailForm);
  }

  get f() {
    return this.emailForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Email';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.emailService.getEmailDetailById(id).then(res => {
        this.email = res;
        this.emailForm.patchValue({
          branchName: this.email.branchName,
          branchCode: this.email.branchCode,
          branchEmail: this.email.branchEmail,
          branchEmailCC: this.email.branchEmailCC,
          branchEmailBCC: this.email.branchEmailBCC,
          createdBy: this.email.createdBy,
          updatedBy: this.email.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.emailService.getEmailDetails().then((res) => {
      this.emailInfo = res;
      this.email = res;
      console.log(res);
    }, err => { throw err; });
  }

  onFormSubmit(emailForm): void {
    Object.assign({}, this.email, this.emailForm.value);
    console.log(this.emailForm.value);
    this.email.branchName = this.emailForm.value.branchName;
    this.email.branchCode = this.emailForm.value.branchCode;
    this.email.branchEmail = this.emailForm.value.branchEmail;
    this.email.branchEmailCC = this.emailForm.value.branchEmailCC;
    this.email.branchEmailBCC = this.emailForm.value.branchEmailBCC;
    this.email.createdBy = this.authService.userName;
    this.email.updatedBy = this.authService.userName;

    if (this.email.id !== undefined && this.email.id > 0) {
      this.emailService.updateEmailDetails(this.email)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Edited Successfully", "");
          console.log(res);
          this.router.navigateByUrl('/EmailList');
          this.fetchAllRecords();
        },
          err => {

            throw err;
          });
    }
    else {
      this.emailService.addEmailDetails(this.email)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Saved Successfully", "");
          this.router.navigateByUrl('/EmailList');
          this.fetchAllRecords();
        },
          err => {

            throw err;
          });
    }
  }

  back(id) {
    this.router.navigate(['/EmailList'], { queryParams: { id: id } });
  }

  reset() {
    this.ngOnInit();
  }

}