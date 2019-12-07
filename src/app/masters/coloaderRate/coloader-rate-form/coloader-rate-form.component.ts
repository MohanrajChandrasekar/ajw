import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '../../../shared/customValidators';
import { ColoaderRate } from '../coloaderRate';
import { ColoaderRateService } from '../../../services/Master/coloaderRateService/coloader-rate.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { AuthService } from '../../../login/auth.service';
import { ColoaderService } from '../../../services/Master/coloaderService/coloader.service';
import { ModeService } from '../../../services/Master/modeService/mode.service';
import { CityService } from '../../../services/Master/cityService/city.service';

@Component({
  selector: 'app-coloader-rate-form',
  templateUrl: './coloader-rate-form.component.html',
  styleUrls: ['./coloader-rate-form.component.scss']
  // providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})

export class ColoaderRateFormComponent implements OnInit {

  const: CustomValidators = new CustomValidators();
  coloaderRateForm: FormGroup;
  coloaderRateInfo: any = [];
  listOfColoaders: any[];
  listOfModes: any[];
  listOfStates: any[];
  coloaderRate: ColoaderRate = new ColoaderRate();

  constructor(private coloaderRateService: ColoaderRateService,
    private _route: ActivatedRoute,
    private router: Router,
    private openDialogBoxService: OpenDialogBoxService,
    private dtpBinder: DtpBindFormatService,
    private fb: FormBuilder,
    private authService: AuthService,
    private globals: Globals,
    private modeService: ModeService,
    private coloaderService: ColoaderService,
    private cityService: CityService) {

    this.coloaderRateForm = fb.group({
      'id':'',
      'coloaderID': [null, Validators.required],
      'modeID': [null, Validators.required],
      'originID': [null, Validators.required],
      'destinationID': [null, Validators.required],
      'ratePerKG': [null, Validators.compose([Validators.required, CustomValidators.numberPattern()])],
    });
  }

  ngOnInit() {
    this.globals.role = 'Coloader Rate';
    console.log(this._route.snapshot.queryParams.Id);
    if (this._route.snapshot.queryParams.Id) {
      let id: number = this._route.snapshot.queryParams.Id
      this.coloaderRateService.getColoaderRateById(id).then(res => {
        this.coloaderRate = res;
        this.coloaderRateForm.patchValue({
          id: res.id,
          coloaderID: res.coloaderID,
          modeID: res.modeID,
          originID: res.originID,
          destinationID: res.destinationID,
          ratePerKG: res.ratePerKG
        });
      }, err => { throw err; });
    }
    this.fetchAllRecords();
  }

  get f() {
    return this.coloaderRateForm.controls;
  }

  fetchAllRecords(): void {
    this.coloaderRateService.getColoaderRateDetails().subscribe((res) => {
      this.coloaderRateInfo = res;
      this.coloaderRate = res;
    }, err => { throw err; });
    this.modeService.getModeDetails().then(res => {
      this.listOfModes = res;
    }, err => { throw err; });
    this.coloaderService.getColoaderDetails().then(res => {
      this.listOfColoaders = res;
    })
    this.cityService.getCityDetails().then(res => {
      this.listOfStates = res;
      console.log(res);
    })
  }

  obtained() {
    var source = this.coloaderRateForm.value.originID === undefined ? "" : this.coloaderRateForm.value.originID;
    var dest = this.coloaderRateForm.value.destinationID === undefined ? "" : this.coloaderRateForm.value.destinationID;;
    if(source == dest){
      this.openDialogBoxService.openSnackBar("Origin and destination can't be same!","error");
      this.coloaderRateForm.get('destinationID').reset();
    }
  }

  citySearch(term: string, item: any) { // ngSelect Search - city
    term = term.toLocaleLowerCase();
    return item.cityCode.toLocaleLowerCase().indexOf(term) > -1 || item.cityName.toLocaleLowerCase().indexOf(term) > -1;
  }

  modeSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.modeCode.toLocaleLowerCase().indexOf(term) > -1 || item.modeName.toLocaleLowerCase().indexOf(term) > -1;
  }

  coloaderSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.coloaderCode.toLocaleLowerCase().indexOf(term) > -1 || item.coloaderName.toLocaleLowerCase().indexOf(term) > -1;
  }

  save(): void {
    var obj = Object.assign({}, this.coloaderRateForm.value);
    obj.createdBy = this.userName;
    obj.updatedBy = this.userName;
    if (obj.id !== undefined &&obj.id > 0) {
      this.coloaderRateService.updateColoaderRateDetail(obj)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Edited Successfully", "");
          this.router.navigateByUrl('/coloaderRateList');
        }, err => { throw err; });
    }
    else {
      this.coloaderRateService.addColoaderRateDetail(obj)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Saved Successfully", "");
          this.router.navigateByUrl('/coloaderRateList');
        }, err => { throw err; });
    }
  }

  back() {
    if (this.coloaderRateForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/coloaderRateList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/coloaderRateList');
    }
  }

  reset() {
    this.ngOnInit();
  }

  get userName(): string {
    var _user = this.authService.currentUser();
    if (_user != undefined && _user != null) {
      return this.authService.currentUser().userName;
    }
    return '';
  }

}



