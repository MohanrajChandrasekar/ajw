import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Shipper } from '../shipper';
import { ShipperService } from '../../../services/Master/shipperService/shipper.service';
import { CustomValidators } from '../../../shared/customValidators';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-shipper-form',
  templateUrl: './shipper-form.component.html',
  styleUrls: ['./shipper-form.component.scss']
})

export class ShipperFormComponent implements OnInit {

  shipperForm: FormGroup;
  shipper: Shipper = new Shipper();
  shipperInfo: any[];

  constructor(private shipperService: ShipperService,
    private router: Router,
    private fb: FormBuilder,
    private globals: Globals,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.shipperForm = fb.group({
      'id': '',
      'shipperCode': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'shipperName': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
    });
    console.log(this.shipperForm);
  }

  get f() {
    return this.shipperForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Shipper Master';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.shipperService.getShipperDetailById(id).then(res => {
        this.shipper = res;
        this.shipperForm.patchValue({
          shipperName: this.shipper.shipperName,
          shipperCode: this.shipper.shipperCode,
          createdBy: this.shipper.createdBy,
          updatedBy: this.shipper.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.shipperService.getShipperDetails().then((res) => {
      this.shipperInfo = res;
      this.shipper = res;
      console.log(res);
    }, err => { throw err; });
  }

  onFormSubmit(): void {
    Object.assign({}, this.shipper, this.shipperForm.value);
    console.log(this.shipperForm.value);
    this.shipper.shipperName = this.shipperForm.value.shipperName;
    this.shipper.shipperCode = this.shipperForm.value.shipperCode;
    this.shipper.createdBy = this.authService.userName;
    this.shipper.updatedBy = this.authService.userName;

    if (this.shipper.id !== undefined && this.shipper.id > 0) {
      this.shipperService.updateShipperDetails(this.shipper)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/ShipperList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.shipperService.addShipperDetails(this.shipper)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/ShipperList');
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
    if (this.shipperForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/ShipperList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/ShipperList');
    }
  }


}