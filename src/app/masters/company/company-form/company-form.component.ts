import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '../../../shared/customValidators';
import { Company } from '../company';
import { CompanyService } from '../../../services/Master/companyService/company.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityService } from '../../../services/Master/cityService/city.service';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})

export class CompanyFormComponent implements OnInit {

  companyForm: FormGroup;
  companyInfo: any = [];
  company: Company = new Company();
  city: any[];

  constructor(private companyService: CompanyService,
    private _route: ActivatedRoute,
    private router: Router,
    private openDialogBoxService: OpenDialogBoxService,
    private fb: FormBuilder,
    private authService: AuthService,
    private cityService: CityService,
    private globals: Globals) {

    this.companyForm = fb.group({
      'id': '',
      'companyName': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'companyAddress1': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'companyAddress2': [null, Validators.compose([CustomValidators.nospaceValidator()])],
      'companyCity': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'companyPhone': [null, Validators.compose([Validators.required])],
      'companyFax': [null, Validators.compose([CustomValidators.nospaceValidator()])],
      'companyEmail': [null, Validators.compose([Validators.email])],
      'companyWeb': [null, Validators.compose([CustomValidators.nospaceValidator()])],
      'companyPan': [null, Validators.compose([CustomValidators.nospaceValidator()])],
      'companyStNo': [null, Validators.compose([CustomValidators.nospaceValidator()])],
    });
  }

  ngOnInit() {
    this.globals.role = 'Company Master';
    console.log(this._route.snapshot.queryParams.Id);
    this.cityService.getCityDetails().then(res => {
      this.city = res;
    }, err => { throw err; })
    if (this._route.snapshot.queryParams.Id) {
      let id: number = this._route.snapshot.queryParams.Id
      this.companyService.getCompanyById(id).then(res => {
        this.company = res;
        this.companyForm.patchValue({
          companyName: this.company.companyName,
          companyAddress1: this.company.companyAddress1,
          companyAddress2: this.company.companyAddress2,
          companyCity: this.company.companyCity,
          companyPhone: this.company.companyPhone,
          companyFax: this.company.companyFax,
          companyEmail: this.company.companyEmail,
          companyWeb: this.company.companyWeb,
          companyPan: this.company.companyPan,
          companyStNo: this.company.companyStNo,
          createdBy: this.company.createdBy,
          updatedBy: this.company.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.companyService.getCompanyDetails().then((res) => {
      this.companyInfo = res;
      this.company = res;
      console.log(res);
    }, err => { throw err; });
  }

  get f() {
    return this.companyForm.controls;
  }

  save(): void {
    Object.assign({}, this.company, this.companyForm.value);
    this.company.companyName = this.companyForm.value.companyName;
    this.company.companyAddress1 = this.companyForm.value.companyAddress1;
    this.company.companyAddress2 = this.companyForm.value.companyAddress2;
    this.company.companyCity = this.companyForm.value.companyCity;
    this.company.companyPhone = this.companyForm.value.companyPhone;
    this.company.companyFax = this.companyForm.value.companyFax;
    this.company.companyEmail = this.companyForm.value.companyEmail;
    this.company.companyWeb = this.companyForm.value.companyWeb;
    this.company.companyPan = this.companyForm.value.companyPan;
    this.company.companyStNo = this.companyForm.value.companyStNo;
    this.company.createdBy = this.authService.userName;
    this.company.updatedBy = this.authService.userName;
    if (this.company.id !== undefined && this.company.id > 0) {
      this.companyService.updateCompanyDetail(this.company)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/companyList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
    else {
      this.companyService.addCompanyDetail(this.company)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/companyList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
  }

  back() {
    if (this.companyForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/companyList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/companyList');
    }
  }

  reset() {
    this.ngOnInit();
  }


}


