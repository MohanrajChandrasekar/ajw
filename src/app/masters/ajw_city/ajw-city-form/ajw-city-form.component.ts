import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm, FormGroupDirective } from "@angular/forms";
import { City } from '../City';
import { CityService } from '../../../services/Master/cityService/city.service';
import { CustomValidators } from '../../../shared/customValidators';
import { ErrorStateMatcher } from '@angular/material/core';
import { StateService } from '../../../services/Master/stateService/state.service';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { State } from '../../state/state';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(frmCtrlName: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(frmCtrlName && frmCtrlName.invalid && (frmCtrlName.dirty || frmCtrlName.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-ajw-city-form',
  templateUrl: './ajw-city-form.component.html',
  styleUrls: ['./ajw-city-form.component.scss']
})

export class AjwCityFormComponent implements OnInit {

  cityForm: FormGroup;
  city: City = new City();
  cityInfo: any[];
  state: State = new State();
  officeType: any[];
  officeByType: any[];

  constructor(private cityService: CityService,
    private fb: FormBuilder,
    private router: Router,
    private stateService: StateService,
    private globals: Globals,
    private _route: ActivatedRoute,
    private officeService: OfficeService,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.cityForm = fb.group({
      'id': '',
      'cityCode': [null, Validators.compose([Validators.maxLength(150), Validators.required, CustomValidators.nospaceValidator()])],
      'cityName': [null, Validators.compose([Validators.maxLength(150), Validators.required, CustomValidators.nospaceValidator()])],
      'stateName': [null, Validators.required],
      'officeType': [null, Validators.required],
      'officeCode': [null, Validators.required],
      'transType': [null, Validators.required]
    });
  }

  get f() {
    return this.cityForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'City Master';
    console.log(this._route.snapshot.queryParams.id);
    this.stateService.getStateDetails().then(res => {
      this.state = res;
    }, err => { throw err; })

    this.officeService.getOfficeTypes().subscribe(res => {
      this.officeType = res;
    }, err => { throw err; })

    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.cityService.getCityDetailById(id).then(res => {
        this.city = res;
        this.cityForm.patchValue({
          cityName: this.city.cityName,
          cityCode: this.city.cityCode,
          stateName: this.city.stateName,
          officeType: this.city.officeType,
          officeCode: this.city.officeCode,
          transType: this.city.transType,
          createdBy: this.city.createdBy,
          updatedBy: this.city.updatedBy
        });
        this.officeService.getOfficeDetailsByType(this.city.officeType).then(res => {
          this.officeByType = res;
        }, err => { throw err; })
      }, err => { throw err; });
    }
  }

  getOfficeByType() {
    let office = this.cityForm.value.officeType;
    this.officeService.getOfficeDetailsByType(office).then(res => {
      this.officeByType = res;
    }, err => { throw err; })

  }

  fetchAllRecords(): void {
    this.cityService.getCityDetails().then((res) => {
      this.cityInfo = res;
      this.city = res;
      console.log(res);
    }, err => { throw err; });
  }

  save(): void {
    Object.assign({}, this.city, this.cityForm.value);
    console.log(this.cityForm.value);
    this.city.cityName = this.cityForm.value.cityName;
    this.city.cityCode = this.cityForm.value.cityCode;
    this.city.stateName = this.cityForm.value.stateName;
    this.city.officeType = this.cityForm.value.officeType;
    this.city.officeCode = this.cityForm.value.officeCode;
    this.city.transType = this.cityForm.value.transType;
    this.city.createdBy = this.authService.userName;
    this.city.updatedBy = this.authService.userName;
    if (this.city.id !== undefined && this.city.id > 0) {
      this.cityService.updateCityDetails(this.city)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/AjwCityList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.cityService.addCityDetails(this.city)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/AjwCityList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
  }

  back() {
    if (this.cityForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/AjwCityList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/AjwCityList');
    }
  }

  reset() {
    this.ngOnInit();
  }

  stateSearch(term: string, item: any) { // ngSelect Search - city
    term = term.toLocaleLowerCase();
    return item.stateCode.toLocaleLowerCase().indexOf(term) > -1 || item.stateName.toLocaleLowerCase().indexOf(term) > -1;
  }

  officeSearch(term: string, item: any) { // ngSelect Search - city
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

}