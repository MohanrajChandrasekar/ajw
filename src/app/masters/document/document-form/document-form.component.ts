import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Document } from '../document';
import { DocumentMagazineService } from '../../../services/Master/documentMagazineService/document-magazine.service';
import { CustomValidators } from '../../../shared/customValidators';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {
  documentForm: FormGroup;
  document: Document = new Document();
  documentInfo: any[];

  constructor(private documentMagazineService: DocumentMagazineService,
    private globals: Globals,
    private router: Router,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.documentForm = fb.group({
      'id': '',
      'code': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'description': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
    });
    console.log(this.documentForm);
  }

  get f() {
    return this.documentForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Document Master';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.documentMagazineService.getDocumentMagazineById(id).then(res => {
        this.document = res;
        this.documentForm.patchValue({
          description: this.document.description,
          code: this.document.code,
          createdBy: this.document.createdBy,
          updatedBy: this.document.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.documentMagazineService.getDocumentDetails().then((res) => {
      this.documentInfo = res;
      this.document = res;
      console.log(res);
    }, err => { throw err; });
  }

  onFormSubmit(): void {
    Object.assign({}, this.document, this.documentForm.value);
    console.log(this.documentForm.value);
    this.document.description = this.documentForm.value.description;
    this.document.code = this.documentForm.value.code;
    this.document.createdBy = this.authService.userName;
    this.document.updatedBy = this.authService.userName;
    if (this.document.id !== undefined && this.document.id > 0) {
      this.documentMagazineService.updateDocumentMagazineDetail(this.document)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/DocumentList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.documentMagazineService.addDocumentMagazineDetail(this.document)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/DocumentList');
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
    if (this.documentForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/DocumentList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/DocumentList');
    }
  }


}
