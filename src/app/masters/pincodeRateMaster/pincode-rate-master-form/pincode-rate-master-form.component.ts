import { Component, OnInit } from '@angular/core';
import { PincodeRateMaster } from '../pincodeRateMaster';
import { PincodeRateMasterService } from '../../../services/Master/pincodeRateMasterService/pincode-rate-master.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals, TextConstants } from '../../../global';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { AuthService } from '../../../login/auth.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { CityService } from '../../../services/Master/cityService/city.service';
import { ModeService } from '../../../services/Master/modeService/mode.service';
import { StateService } from '../../../services/Master/stateService/state.service';
import { DeliveryCategoryService } from '../../../services/Master/deliveryCategoryService/delivery-category.service';
@Component({
  selector: 'app-pincode-rate-master-form',
  templateUrl: './pincode-rate-master-form.component.html',
  styleUrls: ['./pincode-rate-master-form.component.scss']
})

export class PincodeRateMasterFormComponent implements OnInit {

  pincodeRateMasterForm: FormGroup;
  pincodeRateMasterInfo: any = [];
  pincodeRateMaster: PincodeRateMaster = new PincodeRateMaster();
  cityInfo: any[];
  stateInfo: any[];
  modeInfo: any[];
  deliveryCategoryInfo: any[];
  bookingTypes: any[];

  constructor(private pincodeRateMasterService: PincodeRateMasterService,
    private _route: ActivatedRoute,
    private globals: Globals,
    private router: Router,
    private snackBar: MatSnackBar,
    private dtpBinder: DtpBindFormatService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService,
    private cityService: CityService,
    private modeService: ModeService,
    private stateService: StateService,
    private deliveryCategoryService: DeliveryCategoryService,
    private fb: FormBuilder) {

    this.pincodeRateMasterForm = fb.group({
      'id': '',
      'postalCode': [null, Validators.compose([Validators.required, Validators.maxLength(6), Validators.minLength(6)])],
      'wtFrom': [null, Validators.compose([Validators.required])],
      'wtTo': [null, Validators.compose([Validators.required])],
      'rate': [null, Validators.compose([Validators.required])],
      'vendorName': [null, Validators.compose([Validators.required])],
      'customerType': [null, Validators.compose([Validators.required])],
      'city': [null],
      'state': [null],
      'returnCharge': [null],
      'category': [null],
      'mode': [null]
    });
  }

  ngOnInit() {

    this.cityService.getCityDetails().then(res => {
      this.cityInfo = res;
    }, err => { throw err });
    this.deliveryCategoryService.getDeliveryCategoryDetails().then(res => {
      this.deliveryCategoryInfo = res;
    }, err => { throw err });
    this.stateService.getStateDetails().then(res => {
      this.stateInfo = res;
    }, err => { throw err });
    this.modeService.getModeDetails().then(res => {
      this.modeInfo = res;
    }, err => { throw err });
    this.bookingTypes = [{'id':'1','type':'domestic'}, {'id':'2','type':'secondary'}];

    this.globals.role = 'Pincode Rate Master';
    if (this._route.snapshot.queryParams.Id) {
      let id: number = this._route.snapshot.queryParams.Id
      this.pincodeRateMasterService.getPincodeRateMasterById(id).then(res => {
        this.pincodeRateMaster = res;
        this.pincodeRateMasterForm.patchValue({
          vendorName: this.pincodeRateMaster.vendorName,
          postalCode: this.pincodeRateMaster.postalCode,
          wtFrom: this.pincodeRateMaster.wtFrom,
          wtTo: this.pincodeRateMaster.wtTo,
          rate: this.pincodeRateMaster.rate,
          state: this.pincodeRateMaster.state,
          city: this.pincodeRateMaster.city,
          returnCharge: this.pincodeRateMaster.returnCharge,
          category: this.pincodeRateMaster.category,
          mode: this.pincodeRateMaster.mode,
          createdBy: this.pincodeRateMaster.createdBy,
          updatedNy: this.pincodeRateMaster.updatedBy,
          customerType: this.pincodeRateMaster.customerType
        });
      }, err => { throw err; });
    }
  }

  get f() {
    return this.pincodeRateMasterForm.controls;
  }

  fetchAllRecords(): void {
    this.pincodeRateMasterService.getPincodeRateMasterDetails().then((res) => {
      this.pincodeRateMasterInfo = res;
      this.pincodeRateMaster = res;
    }, err => { throw err; });
  }

  save(): void {
    console.log(this.pincodeRateMaster);
    console.log(this.pincodeRateMasterForm.value);
    let obj = Object.assign({}, this.pincodeRateMaster, this.pincodeRateMasterForm.value);
    // this.pincodeRateMaster.vendorName = this.pincodeRateMasterForm.value.vendorName;
    // this.pincodeRateMaster.postalCode = this.pincodeRateMasterForm.value.postalCode;
    // this.pincodeRateMaster.city = this.pincodeRateMasterForm.value.city;
    // this.pincodeRateMaster.wtFrom = this.pincodeRateMasterForm.value.wtFrom;
    // this.pincodeRateMaster.wtTo = this.pincodeRateMasterForm.value.wtTo;
    // this.pincodeRateMaster.rate = this.pincodeRateMasterForm.value.rate;
    // this.pincodeRateMaster.state = this.pincodeRateMasterForm.value.state;
    // this.pincodeRateMaster.returnCharge = this.pincodeRateMasterForm.value.returnCharge;
    // this.pincodeRateMaster.category = this.pincodeRateMasterForm.value.category;
    // this.pincodeRateMaster.mode = this.pincodeRateMasterForm.value.mode;
    // this.pincodeRateMaster.createdBy = this.authService.userName;
    // this.pincodeRateMaster.updatedBy = this.authService.userName;
    obj.createdBy = this.authService.userName;
    obj.updatedBy = this.authService.userName;
    obj.id = this.pincodeRateMaster.id;
    console.log(obj);

    if (obj.id !== undefined && obj.id > 0) {
      this.pincodeRateMasterService.updatePincodeRateMasterDetail(obj).subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/pincodeRateMasterList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    } else {
      this.pincodeRateMasterService.addPincodeRateMasterDetail(obj).subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/pincodeRateMasterList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
  }

  back() {
    if (this.pincodeRateMasterForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/pincodeRateMasterList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/pincodeRateMasterList');
    }
  }

  reset() {
    this.ngOnInit();
  }

  citySearch(term: string, item: any) { // ngSelect Search - city
    term = term.toLocaleLowerCase();
    return item.cityCode.toLocaleLowerCase().indexOf(term) > -1 || item.cityName.toLocaleLowerCase().indexOf(term) > -1;
  }

  stateSearch(term: string, item: any) { // ngSelect Search - state
    term = term.toLocaleLowerCase();
    return item.stateCode.toLocaleLowerCase().indexOf(term) > -1 || item.stateName.toLocaleLowerCase().indexOf(term) > -1;
  }

  categorySearch(term: string, item: any) { // ngSelect Search - Delivery Category
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  modeSearch(term: string, item: any) { // ngSelect Search - mode
    term = term.toLocaleLowerCase();
    return item.modeCode.toLocaleLowerCase().indexOf(term) > -1 || item.modeName.toLocaleLowerCase().indexOf(term) > -1;
  }


}


