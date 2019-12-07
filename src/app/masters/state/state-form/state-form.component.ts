import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '../../../shared/customValidators';
import { State } from '../state';
import { StateService } from '../../../services/Master/stateService/state.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-state-form',
  templateUrl: './state-form.component.html',
  styleUrls: ['./state-form.component.scss']
})

export class StateFormComponent implements OnInit {

  stateForm: FormGroup;
  stateInfo: any = [];
  state: State = new State();

  constructor(private stateService: StateService,
    private _route: ActivatedRoute,
    private globals: Globals,
    private router: Router,
    private openDialogBoxService: OpenDialogBoxService,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.stateForm = fb.group({
      'id': '',
      'stateCode': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'stateName': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
    });
  }

  ngOnInit() {
    this.globals.role = 'State Master';
    console.log(this._route.snapshot.queryParams.Id);
    if (this._route.snapshot.queryParams.Id) {
      let id: number = this._route.snapshot.queryParams.Id
      this.stateService.getStateById(id).then(res => {
        this.state = res;
        this.stateForm.patchValue({
          stateCode: this.state.stateCode,
          stateName: this.state.stateName,
          createdBy: this.state.createdBy,
          updatedBy: this.state.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.stateService.getStateDetails().then((res) => {
      this.stateInfo = res;
      this.state = res;
      console.log(res);
    }, err => { throw err; }
    );
  }

  get f() {
    return this.stateForm.controls;
  }

  save(): void {
    Object.assign({}, this.state, this.stateForm.value);
    this.state.stateCode = this.stateForm.value.stateCode;
    this.state.stateName = this.stateForm.value.stateName;
    this.state.createdBy = this.authService.userName;
    this.state.updatedBy = this.authService.userName;

    if (this.state.id !== undefined && this.state.id > 0) {
      this.stateService.updateStateDetail(this.state)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/stateList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.stateService.addStateDetail(this.state)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/stateList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
  }

  back() {
    if (this.stateForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/stateList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/stateList');
    }
  }

  reset() {
    this.ngOnInit();
  }

}



