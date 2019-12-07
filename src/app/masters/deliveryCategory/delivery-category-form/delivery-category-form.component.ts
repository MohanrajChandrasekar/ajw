import { Component, OnInit } from '@angular/core';
import { DeliveryCategory } from '../deliveryCategory';
import { DeliveryCategoryService } from '../../../services/Master/deliveryCategoryService/delivery-category.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/customValidators';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-delivery-category-form',
  templateUrl: './delivery-category-form.component.html',
  styleUrls: ['./delivery-category-form.component.scss']
})
export class DeliveryCategoryFormComponent implements OnInit {

  deliveryCategoryForm: FormGroup;
  deliveryCategoryInfo: any = [];
  deliveryCategory: DeliveryCategory = new DeliveryCategory();

  constructor(private deliveryCategoryService: DeliveryCategoryService,
    private _route: ActivatedRoute,
    private router: Router,
    private openDialogBoxService: OpenDialogBoxService,
    private fb: FormBuilder,
    private authService: AuthService,
    private globals: Globals) {
    this.deliveryCategoryForm = fb.group({
      'id': '',
      'description': [null, Validators.compose([CustomValidators.nospaceValidator()])],
      'code': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
    });
  }

  ngOnInit() {
    this.globals.role = 'Delivery Category Master';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.deliveryCategoryService.getDeliveryCategoryDetailsById(id).then(res => {
        this.deliveryCategory = res;
        this.deliveryCategoryForm.patchValue({
          description: this.deliveryCategory.description,
          code: this.deliveryCategory.code,
          createdBy: this.deliveryCategory.createdBy,
          updatedBy: this.deliveryCategory.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.deliveryCategoryService.getDeliveryCategoryDetails().then((res) => {
      this.deliveryCategoryInfo = res;
      this.deliveryCategory = res;
      console.log(res);
    }, err => { throw err; });
  }

  save(): void {
    Object.assign({}, this.deliveryCategory, this.deliveryCategoryForm.value);
    this.deliveryCategory.description = this.deliveryCategoryForm.value.description;
    this.deliveryCategory.code = this.deliveryCategoryForm.value.code;
    this.deliveryCategory.createdBy = this.authService.userName;
    this.deliveryCategory.updatedBy = this.authService.userName;

    if (this.deliveryCategory.id !== undefined && this.deliveryCategory.id > 0) {
      this.deliveryCategoryService.updateDeliveryCategoryDetails(this.deliveryCategory)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/deliveryCategoryList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.deliveryCategoryService.addDeliveryCategoryDetails(this.deliveryCategory)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/deliveryCategoryList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
  }

  get f() {
    return this.deliveryCategoryForm.controls;
  }

  back() {
    if (this.deliveryCategoryForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/deliveryCategoryList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/deliveryCategoryList');
    }
  }

  reset() {
    this.ngOnInit();
  }


}
