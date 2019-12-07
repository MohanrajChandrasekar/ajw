import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '../../../shared/customValidators';
import { PincodeService } from '../pincodeService';
import { PincodeServiceService } from '../../../services/Master/pincodeServiceService/pincode-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-pin-code-service-form',
  templateUrl: './pin-code-service-form.component.html',
  styleUrls: ['./pin-code-service-form.component.scss']
})

export class PinCodeServiceFormComponent implements OnInit {

  const: CustomValidators = new CustomValidators();
  pincodeServiceForm: FormGroup;
  pincodeServiceInfo: any = [];
  pincodeService: PincodeService = new PincodeService();

  constructor(private pincodeServiceService: PincodeServiceService,
    private _route: ActivatedRoute,
    private globals: Globals,
    private router: Router,
    private openDialogBoxService: OpenDialogBoxService,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.pincodeServiceForm = fb.group({
      'id': '',
      'ajwCode': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'ajwType': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'ajwPin': [null, Validators.compose([Validators.required, CustomValidators.pincodePattern()])],
      'ajwArea': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'ajwCity': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
    });
  }


  ngOnInit() {
    this.globals.role = 'Servicable Pincode Master';
    console.log(this._route.snapshot.queryParams.Id);
    if (this._route.snapshot.queryParams.Id) {
      let id: number = this._route.snapshot.queryParams.Id
      this.pincodeServiceService.getPincodeServiceById(id).then(res => {
        this.pincodeService = res;
        this.pincodeServiceForm.patchValue({
          ajwCode: this.pincodeService.ajwCode,
          ajwType: this.pincodeService.ajwType,
          ajwPin: this.pincodeService.ajwPin,
          ajwArea: this.pincodeService.ajwArea,
          ajwCity: this.pincodeService.ajwCity,
          createdBy: this.pincodeService.createdBy,
          updatedBy: this.pincodeService.updatedBy
        });
      }, err => { throw err; });
    }
  }

  get f() {
    return this.pincodeServiceForm.controls;
  }


  fetchAllRecords(): void {
    this.pincodeServiceService.getPincodeServiceDetails().then((res) => {
      this.pincodeServiceInfo = res;
      this.pincodeService = res;
      console.log(res);
    }, err => { throw err; });
  }

  save(): void {
    Object.assign({}, this.pincodeService, this.pincodeServiceForm.value);
    this.pincodeService.ajwCode = this.pincodeServiceForm.value.ajwCode;
    this.pincodeService.ajwType = this.pincodeServiceForm.value.ajwType;
    this.pincodeService.ajwPin = this.pincodeServiceForm.value.ajwPin;
    this.pincodeService.ajwArea = this.pincodeServiceForm.value.ajwArea;
    this.pincodeService.ajwCity = this.pincodeServiceForm.value.ajwCity;
    this.pincodeService.createdBy = this.authService.userName;
    this.pincodeService.updatedBy = this.authService.userName;

    if (this.pincodeService.id !== undefined && this.pincodeService.id > 0) {
      this.pincodeServiceService.updatePincodeServiceDetail(this.pincodeService)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Edited Successfully", "");
          this.router.navigateByUrl('/pincodeServiceList');
          this.fetchAllRecords();
        },
          err => {

            throw err;
          });
    }
    else {
      this.pincodeServiceService.addPincodeServiceDetail(this.pincodeService)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Saved Successfully", "");
          this.router.navigateByUrl('/pincodeServiceList');
          this.fetchAllRecords();
        },
          err => {

            throw err;
          });
    }
  }

  back() {
    if (this.pincodeServiceForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/pincodeServiceList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/pincodeServiceList');
    }
  }

  reset() {
    this.ngOnInit();
  }


}


