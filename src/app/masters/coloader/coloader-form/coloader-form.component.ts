import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Coloader } from '../coloader';
import { ColoaderService } from '../../../services/Master/coloaderService/coloader.service';
import { CustomValidators } from '../../../shared/customValidators';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { Office } from '../../office/office';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';
import { ModeService } from '../../../services/Master/modeService/mode.service';

@Component({
  selector: 'app-coloader-form',
  templateUrl: './coloader-form.component.html',
  styleUrls: ['./coloader-form.component.scss']
})

export class ColoaderFormComponent implements OnInit {

  coloaderForm: FormGroup;
  coloader: Coloader = new Coloader();
  office: Office = new Office();
  coloaderInfo: any[];
  officeType: any[];
  officeByType: any[];
  modeList: any[];

  constructor(private coloaderService: ColoaderService,
    private globals: Globals,
    private router: Router,
    private fb: FormBuilder,
    private officeService: OfficeService,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private modeService: ModeService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.coloaderForm = fb.group({
      'id': '',
      'coloaderCode': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'coloaderName': [null, Validators.compose([Validators.required])],
      'coloaderAdd1': [null, Validators.required],
      'coloaderAdd2': [null],
      'coloaderContact': [null],
      'coloaderPhone': [null],
      'coloaderRepOffType': [null, Validators.required],
      'coloaderRepOff': [null, Validators.required],
      'coloaderMode': [null],
    });
    console.log(this.coloaderForm);
  }

  get f() {
    return this.coloaderForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Coloader Master';
    console.log(this._route.snapshot.queryParams.id);



    this.modeService.getModeDetails().then(res => {
      this.modeList = res;
    }, err => { throw err; })

    this.officeService.getOfficeTypes().subscribe(res => {
      this.officeType = res;
    }, err => { throw err; })
    if (this._route.snapshot.queryParams.id) {

      let id: number = this._route.snapshot.queryParams.id
      this.coloaderService.getColoaderDetailById(id).then(res => {
        this.coloader = res;
        this.coloaderForm.patchValue({
          coloaderName: this.coloader.coloaderName,
          coloaderCode: this.coloader.coloaderCode,
          coloaderAdd1: this.coloader.coloaderAdd1,
          coloaderAdd2: this.coloader.coloaderAdd2,
          coloaderContact: this.coloader.coloaderContact,
          coloaderPhone: this.coloader.coloaderPhone,
          coloaderRepOff: this.coloader.coloaderRepOff,
          coloaderRepOffType: this.coloader.coloaderRepOffType,
          coloaderMode: this.coloader.coloaderMode,
          createdBy: this.coloader.createdBy,
          updatedBy: this.coloader.updatedBy
        });
        this.officeService.getOfficeDetailsByType(this.coloader.coloaderRepOffType).then(res => {
          this.officeByType = res;
        }, err => { throw err; })
      }, err => { throw err; });

    }
  }

  getOfficeByType() {
    let coloaderRepOffType = this.coloaderForm.value.coloaderRepOffType;
    this.officeService.getOfficeDetailsByType(coloaderRepOffType).then(res => {
      this.officeByType = res;
    }, err => { throw err; })

  }

  fetchAllRecords(): void {
    this.coloaderService.getColoaderDetails().then((res) => {
      this.coloaderInfo = res;
      this.coloader = res;
      console.log(res);
    }, err => { throw err; });
  }

  onFormSubmit(coloaderForm): void {
    Object.assign({}, this.coloader, this.coloaderForm.value);
    this.coloader.coloaderName = this.coloaderForm.value.coloaderName;
    this.coloader.coloaderCode = this.coloaderForm.value.coloaderCode;
    this.coloader.coloaderAdd1 = this.coloaderForm.value.coloaderAdd1;
    this.coloader.coloaderAdd2 = this.coloaderForm.value.coloaderAdd2;
    this.coloader.coloaderContact = this.coloaderForm.value.coloaderContact;
    this.coloader.coloaderPhone = this.coloaderForm.value.coloaderPhone;
    this.coloader.coloaderRepOff = this.coloaderForm.value.coloaderRepOff;
    this.coloader.coloaderRepOffType = this.coloaderForm.value.coloaderRepOffType;
    this.coloader.coloaderMode = this.coloaderForm.value.coloaderMode;
    this.coloader.createdBy = this.authService.userName;
    this.coloader.updatedBy = this.authService.userName;
    if (this.coloader.id !== undefined && this.coloader.id > 0) {
      this.coloaderService.updateColoaderDetails(this.coloader)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/ColoaderList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.coloaderService.addColoaderDetails(this.coloader)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/ColoaderList');
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
    if (this.coloaderForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/ColoaderList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/ColoaderList');
    }
  }

  modeSearch(term: string, item: any) { // ngSelect Search - mode
    term = term.toLocaleLowerCase();
    return item.modeCode.toLocaleLowerCase().indexOf(term) > -1 || item.modeName.toLocaleLowerCase().indexOf(term) > -1;
  }

  officeSearch(term: string, item: any) { // ngSelect Search - office
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

}
