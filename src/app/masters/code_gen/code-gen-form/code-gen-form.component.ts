import { Component, OnInit } from '@angular/core';
import { Code } from '../CodeGen';
import { CodeGenService } from '../../../services/Master/codeGenService/code-gen.service';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';
import { ModeService } from '../../../services/Master/modeService/mode.service';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { MatSnackBar } from '@angular/material';
import { CustomValidators } from '../../../shared/customValidators';

@Component({
  selector: 'app-code-gen-form',
  templateUrl: './code-gen-form.component.html',
  styleUrls: ['./code-gen-form.component.scss']
})

export class CodeGenFormComponent implements OnInit {

  codeGenForm: FormGroup;
  code: Code = new Code();
  codeGenInfo: any[];
  branchList: any[];
  modeList: any[];
  public start: number;

  constructor(private codeGenService: CodeGenService,
    private router: Router,
    private fb: FormBuilder,
    private globals: Globals,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private officeService: OfficeService,
    private modeService: ModeService,
    private openDialogBoxService: OpenDialogBoxService,
    private snackBar: MatSnackBar) {
    this.codeGenForm = fb.group({
      'id': '',
      'branchId': [null, Validators.required],
      'modeId': [null, Validators.required],
      'codeType': [null, Validators.required],
      'startNo': [null, Validators.compose([Validators.maxLength(11),Validators.minLength(11), Validators.required, CustomValidators.nospaceValidator()])],
      'endNo': [null, Validators.compose([Validators.maxLength(11),Validators.minLength(11), Validators.required, CustomValidators.nospaceValidator()])]
    });
  }

  get f() {
    return this.codeGenForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Code Generator Master';
    // Get pincode master details
    this.officeService.getOfficeDetails().then(res => {
      this.branchList = res;
      console.log(this.branchList);
    }, err => { throw err; })
    // Get mode master details
    this.modeService.getModeDetails().then(res => {
      this.modeList = res;
      console.log(this.modeList);
    }, err => { throw err; })
    // Edit by id
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.codeGenService.getCodeGenDetailById(id).then(res => {
        this.code = res;
        this.codeGenForm.patchValue({
          branchId: this.code.branchId,
          modeId: this.code.modeId,
          codeType: this.code.codeType,
          startNo: this.code.startNo,
          endNo: this.code.endNo,
          createdBy: this.code.createdBy,
          updatedBy: this.code.updatedBy
        });
      }, err => { throw err; });
    }
  }

  // Get all records
  fetchAllRecords(): void {
    this.codeGenService.getCodeGenDetails().then((res) => {
      this.codeGenInfo = res;
      this.code = res;
      console.log(res);
    }, err => { throw err; });
  }

  // Save the data
  onFormSubmit(): void {
    Object.assign({}, this.code, this.codeGenForm.value);
    this.code.branchId = this.codeGenForm.value.branchId;
    this.code.modeId = this.codeGenForm.value.modeId;
    this.code.codeType = this.codeGenForm.value.codeType;
    this.code.startNo = this.codeGenForm.value.startNo;
    this.code.endNo = this.codeGenForm.value.endNo;
    this.code.createdBy = this.authService.userName;
    this.code.updatedBy = this.authService.userName;
    if (this.code.id !== undefined && this.code.id > 0) {
      this.codeGenService.updateCodeGenDetails(this.code)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Edited Successfully", "");
          console.log(res);
          this.router.navigateByUrl('/CodeGenList');
        },
          err => {

            throw err;
          });
    }
    else {
      this.codeGenService.addCodeGenDetails(this.code).subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, 'err');
          } else if (res.statusBool == 1) {
             this.openDialogBoxService.openSnackBar(res.statusText, '');
             this.router.navigateByUrl('/CodeGenList');
          }
        }, err => { throw err; });
    }
  }

  back() {
    if (this.codeGenForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/CodeGenList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/CodeGenList');
    }
  }

  reset() {
    this.ngOnInit();
  }

  // Check starting number validation
  checkStartingNumber() {
    this.codeGenService.checkstart().subscribe(res => {
      this.start = res;
      console.log(res);
      if (this.codeGenForm.value.startNo <= this.start) {
        this.openDialogBoxService.openSnackBar("Starting Number must be greater than  " + this.start, ".");
        this.codeGenForm.patchValue({
          startNo: null,
        })
      }
    },
      err => {
        throw err;
      })
  }

  // Check ending number validation
  checkEndingNumber() {
    if (this.codeGenForm.value.endNo < this.codeGenForm.value.startNo) {
      this.openDialogBoxService.openSnackBar("Ending Number must be greater than Starting Number", ".");
      this.codeGenForm.patchValue({
        endNo: null
      })
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
