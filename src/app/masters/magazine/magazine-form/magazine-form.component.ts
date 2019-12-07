import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Magazine } from '../magazine';
import { DocumentMagazineService } from '../../../services/Master/documentMagazineService/document-magazine.service';
import { CustomValidators } from '../../../shared/customValidators';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-magazine-form',
  templateUrl: './magazine-form.component.html',
  styleUrls: ['./magazine-form.component.scss']
})
export class MagazineFormComponent implements OnInit {

  magazineForm: FormGroup;
  magazine: Magazine = new Magazine();
  magazineInfo: any[];

  constructor(private documentMagazineService: DocumentMagazineService,
    private globals: Globals,
    private router: Router,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.magazineForm = fb.group({
      'id': '',
      'magazineCode': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'magazineName': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
    });
    console.log(this.magazineForm);
  }

  get f() {
    return this.magazineForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Magazine Master';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.documentMagazineService.getMagazineById(id).then(res => {
        this.magazine = res;
        this.magazineForm.patchValue({
          magazineName: this.magazine.magazineName,
          magazineCode: this.magazine.magazineCode,
          createdBy: this.magazine.createdBy,
          updatedBy: this.magazine.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.documentMagazineService.getMagazineDetails().then((res) => {
      this.magazineInfo = res;
      this.magazine = res;
      console.log(res);
    }, err => { throw err; });
  }

  onFormSubmit(): void {
    Object.assign({}, this.magazine, this.magazineForm.value);
    console.log(this.magazineForm.value);
    this.magazine.magazineName = this.magazineForm.value.magazineName;
    this.magazine.magazineCode = this.magazineForm.value.magazineCode;
    this.magazine.createdBy = this.authService.userName;
    this.magazine.updatedBy = this.authService.userName;
    if (this.magazine.id !== undefined && this.magazine.id > 0) {
      this.documentMagazineService.updateMagazineDetail(this.magazine)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/MagazineList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.documentMagazineService.addMagazineDetail(this.magazine)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/MagazineList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
  }

  reset() {
    this.ngOnInit();
  }

  back() {
    if (this.magazineForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/MagazineList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/MagazineList');
    }
  }


}

