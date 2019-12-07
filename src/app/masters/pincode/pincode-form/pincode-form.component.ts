import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '../../../shared/customValidators';
import { Pincode } from '../pincode';
import { PincodeService } from '../../../services/Master/pincodeService/pincode.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals, TextConstants } from '../../../global';
import { Office } from '../../office/office';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';
import { PincodeRateMasterService } from '../../../services/Master/pincodeRateMasterService/pincode-rate-master.service';
import { VALID } from '@angular/forms/src/model';

@Component({
  selector: 'app-pincode-form',
  templateUrl: './pincode-form.component.html',
  styleUrls: ['./pincode-form.component.scss']
})
export class PincodeFormComponent implements OnInit {

  pincodeForm: FormGroup;
  pincodeInfo: any = [];
  pincode: Pincode = new Pincode();
  office: Office = new Office();
  postalList: any[];

  constructor(private pincodeService: PincodeService,
    private _route: ActivatedRoute,
    private globals: Globals,
    private router: Router,
    private openDialogBoxService: OpenDialogBoxService,
    private fb: FormBuilder,
    private authService: AuthService,
    private officeService: OfficeService,
    private pincodeRateService: PincodeRateMasterService) {
    this.pincodeForm = fb.group({
      'id': '',
      'ajwCode': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'ajwType': [null, Validators.required],
      'ajwPin': [null, Validators.compose([Validators.required, Validators.maxLength(6)])],
      'ajwArea': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'ajwCity': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'ajwRateType': [null]
    });
  }

  ngOnInit() {
    this.officeService.getOfficeDetails().then(res => {
      this.office = res;
    }, err => { throw err; })
    this.globals.role = 'Delivery Pincode Master'
    console.log(this._route.snapshot.queryParams.Id);
    if (this._route.snapshot.queryParams.Id) {
      let id: number = this._route.snapshot.queryParams.Id
      this.pincodeService.getPincodeById(id).then(res => {
        this.pincode = res;
        console.log(this.pincode);
        this.pincodeForm.patchValue({
          id: this.pincode.id,
          ajwCode: this.pincode.ajwCode,
          ajwType: this.pincode.ajwType,
          ajwPin: this.pincode.ajwPin,
          ajwArea: this.pincode.ajwArea,
          ajwCity: this.pincode.ajwCity,
          ajwRateType: this.pincode.ajwRateType,
          createdBy: this.pincode.createdBy,
          updatedBy: this.pincode.updatedBy
        });
      }, err => { throw err; });
    }
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.pincodeService.getPincodeDetails().then((res) => {
      this.pincodeInfo = res;
      this.pincode = res;
      console.log(res);
    }, err => { throw err; });

    this.pincodeRateService.getRateMasterCode().then(res => {
      this.postalList = res;
      console.log(res);
    }, err => { throw err });

  }

  get f() {
    return this.pincodeForm.controls;
  }

  save(): void {
    this.pincode = Object.assign({}, this.pincodeForm.value);
    this.pincode.createdBy = this.authService.userName;
    this.pincode.updatedBy = this.authService.userName;

    if (this.pincode.id !== undefined && this.pincode.id > 0) {
      this.pincodeService.updatePincodeDetail(this.pincode)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/pincodeList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.pincodeService.addPincodeDetail(this.pincode)
        .subscribe(res => {

          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/pincodeList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
  }

  back() {
    if (this.pincodeForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/pincodeList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/pincodeList');
    }
  }

  reset() {
    this.ngOnInit();
  }


}


