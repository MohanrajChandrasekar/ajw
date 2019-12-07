import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Mode } from '../mode';
import { ModeService } from '../../../services/Master/modeService/mode.service';
import { CustomValidators } from '../../../shared/customValidators';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-mode-form',
  templateUrl: './mode-form.component.html',
  styleUrls: ['./mode-form.component.scss']
})

export class ModeFormComponent implements OnInit {

  modeForm: FormGroup;
  mode: Mode = new Mode();
  modeInfo: any[];

  constructor(private modeService: ModeService,
    private globals: Globals,
    private router: Router,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.modeForm = fb.group({
      'id': '',
      'modeCode': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'modeName': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
    });
    console.log(this.modeForm);
  }

  get f() {
    return this.modeForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Mode Master';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.modeService.getModeDetailById(id).then(res => {
        this.mode = res;
        this.modeForm.patchValue({
          modeName: this.mode.modeName,
          modeCode: this.mode.modeCode,
          createdBy: this.mode.createdBy,
          updatedBy: this.mode.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.modeService.getModeDetails().then((res) => {
      this.modeInfo = res;
      this.mode = res;
      console.log(res);
    }, err => { throw err; });
  }

  onFormSubmit(modeForm): void {
    Object.assign({}, this.mode, this.modeForm.value);
    console.log(this.modeForm.value);
    this.mode.modeName = this.modeForm.value.modeName;
    this.mode.modeCode = this.modeForm.value.modeCode;
    this.mode.createdBy = this.authService.userName;
    this.mode.updatedBy = this.authService.userName;
    if (this.mode.id !== undefined && this.mode.id > 0) {
      this.modeService.updateModeDetails(this.mode)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/ModeList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.modeService.addModeDetails(this.mode)
        .subscribe(res => {

          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/ModeList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
  }

  reset() {
    this.ngOnInit();
  }

  back() {
    if (this.modeForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/ModeList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/ModeList');
    }
  }

}