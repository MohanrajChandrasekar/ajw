import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { Office } from '../office';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Globals, TextConstants } from '../../../global';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { AuthService } from '../../../login/auth.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
@Component({
  selector: 'app-office-form',
  templateUrl: './office-form.component.html',
  styleUrls: ['./office-form.component.scss']
})

export class OfficeFormComponent implements OnInit {

  offcForm: FormGroup;
  office: Office = new Office();
  officeInfo: any[];

  constructor(private officeService: OfficeService,
    private fb: FormBuilder,
    private router: Router,
    private globals: Globals,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService,
    private dtpBinder: DtpBindFormatService) {

    this.offcForm = fb.group({
      'id': '',
      'name': [null, Validators.required],
      'code': [null, Validators.required],
      'type': [null, Validators.required],
      'ent': [null],
      'address1': [null, Validators.required],
      'address2': [null],
      'city': [null, Validators.required],
      'pin': [null, Validators.compose([Validators.maxLength(6)])],
      'phone': [null],
      'fax': [null],
      'email': [null, Validators.compose([Validators.email])],
      'contact': [null],
      'contractNo': [null],
      'contractDate': [null],
      'renewalDate': [null],
      'expDate': [null]
    });
  }

  get f() {
    return this.offcForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Office Master';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.officeService.getOfficeDetailById(id).then(res => {
        this.office = res;
        this.offcForm.patchValue({
          name: this.office.name,
          code: this.office.code,
          type: this.office.type,
          ent: this.office.ent,
          address1: this.office.address1,
          address2: this.office.address2,
          city: this.office.city,
          pin: this.office.pin,
          fax: this.office.fax,
          email: this.office.email,
          phone: this.office.phone,
          contact: this.office.contact,
          contractNo: this.office.contractNo,
          contractDate: this.dtpBinder.jsonDate(res.contractDate),
          renewalDate: this.dtpBinder.jsonDate(res.renewalDate),
          expDate: this.dtpBinder.jsonDate(res.expDate),
          createdBy: this.office.createdBy,
          updatedBy: this.office.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.officeService.getOfficeDetails().then((res) => {
      this.officeInfo = res;
      this.office = res;
      console.log(res);
    }, err => { throw err; });
  }

  onFormSubmit(): void {
    console.log(this.offcForm.value);
    this.office.contractDate = this.dtpBinder.convert(this.dtpBinder.reConstructDate(this.offcForm.value.contractDate));
    this.office.renewalDate = this.dtpBinder.convert(this.dtpBinder.reConstructDate(this.offcForm.value.renewalDate));
    this.office.expDate = this.dtpBinder.convert(this.dtpBinder.reConstructDate(this.offcForm.value.expDate));
    this.office.createdBy = this.authService.userName;
    this.office.updatedBy = this.authService.userName;

    let office = Object.assign({}, this.offcForm.value, this.office);

    if (office.id !== undefined && office.id > 0) {
      this.officeService.updateOfficeDetails(office)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/OfficeList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.officeService.addOfficeDetails(office)
        .subscribe(res => {

          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/OfficeList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
  }

  fetch(id): void {
    var offcInfo = this.officeInfo.filter(offc => offc.id === id)
    this.office = offcInfo[0];
  }

  reset() {
    this.ngOnInit();
  }

  back() {
    if (this.offcForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/OfficeList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/OfficeList');
    }
  }


}
