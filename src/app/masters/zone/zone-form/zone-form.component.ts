import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Zone } from '../zone';
import { ZoneService } from '../../../services/Master/zoneService/zone.service';
import { CustomValidators } from '../../../shared/customValidators';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-zone-form',
  templateUrl: './zone-form.component.html',
  styleUrls: ['./zone-form.component.scss']
})

export class ZoneFormComponent implements OnInit {

  zoneForm: FormGroup;
  zone: Zone = new Zone();
  zoneInfo: any[];

  constructor(private zoneService: ZoneService,
    private fb: FormBuilder,
    private router: Router,
    private globals: Globals,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.zoneForm = fb.group({
      'id':'',
      'zoneCode': [null, Validators.compose([CustomValidators.stringLength(0, 10), Validators.required, CustomValidators.nospaceValidator()])],
      'zoneName': [null, Validators.compose([CustomValidators.stringLength(3, 10), Validators.required, CustomValidators.nospaceValidator()])],
      'zoneIncharge': [null, Validators.compose([CustomValidators.stringLength(3, 10), CustomValidators.nospaceValidator()])],
    });
  }

  get f() {
    return this.zoneForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Zone';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.zoneService.getZoneDetailById(id).then(res => {
        this.zone = res;
        this.zoneForm.patchValue({
          zoneCode: this.zone.zoneCode,
          zoneName: this.zone.zoneName,
          zoneIncharge: this.zone.zoneIncharge,
          createdBy: this.zone.createdBy,
          updatedBy: this.zone.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.zoneService.getZoneDetails().then((res) => {
      this.zoneInfo = res;
      this.zone = res;
      console.log(res);
    }, err => { throw err; });
  }

  onFormSubmit(zoneForm): void {
    Object.assign({}, this.zone, this.zoneForm.value);
    console.log(this.zoneForm.value);
    this.zone.zoneName = this.zoneForm.value.zoneName;
    this.zone.zoneIncharge = this.zoneForm.value.zoneIncharge;
    this.zone.zoneCode = this.zoneForm.value.zoneCode;
    this.zone.createdBy = this.userName;
    this.zone.updatedBy = this.userName;

    if (this.zone.id !== undefined && this.zone.id > 0) {
      this.zoneService.updateZoneDetails(this.zone)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Edited Successfully", "");
          console.log(res);
          this.router.navigateByUrl('/ZoneList');
          this.fetchAllRecords();
        },
          err => {

            throw err;
          });
    }
    else {
      this.zoneService.addZoneDetails(this.zone)
        .subscribe(res => {

          this.openDialogBoxService.openSnackBar("Saved Successfully", "");
          this.router.navigateByUrl('/ZoneList');
          this.fetchAllRecords();
        },
          err => {

            throw err;
          });
    }
  }

  reset() {
    this.ngOnInit();
  }

  back(id) {
    this.router.navigate(['/ZoneList'], { queryParams: { id: id } });
  }

  get userName(): string {
    var _user = this.authService.currentUser();
    if (_user != undefined && _user != null) {
      return this.authService.currentUser().userName;
    }
    return '';
  }

}


