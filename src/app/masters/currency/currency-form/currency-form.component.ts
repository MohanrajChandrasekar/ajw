import { Component, OnInit } from '@angular/core';
import { CurrencyServiceService } from '../../../services/Master/currencyService/currency-service.service';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Currency } from '../currency';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-currency-form',
  templateUrl: './currency-form.component.html',
  styleUrls: ['./currency-form.component.scss']
})

export class CurrencyFormComponent implements OnInit {

  currencyForm: FormGroup;
  currencyInfo: any[];
  currency: Currency = new Currency();

  constructor(private currencyService: CurrencyServiceService,
    private router: Router,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private openDialogBoxService: OpenDialogBoxService,
    private authService: AuthService,
    private globals: Globals) {
    this.currencyForm = fb.group({
      'id': '',
      'dollarRupee': [null, Validators.compose([Validators.required])],
      'indianRupee': [null, Validators.compose([Validators.required])]
    });
  }

  get f() {
    return this.currencyForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Currency Master'
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id;
      this.currencyService.getCurrencyDetailByID(id).then(res => {
        console.log(res);
        this.currency = res;
        this.currencyForm.patchValue({
          dollarRupee: this.currency.dollarRupee,
          indianRupee: this.currency.indianRupee,
          createdBy: this.currency.createdBy,
          updatedBy: this.currency.updatedBy
        });
      }, err => { throw err; });
    }
  }

  onFormSubmit(): void {
    Object.assign({}, this.currency, this.currencyForm.value);
    console.log(this.currencyForm.value);
    this.currency.dollarRupee = this.currencyForm.value.dollarRupee;
    this.currency.indianRupee = this.currencyForm.value.indianRupee;
    this.currency.createdBy = this.authService.userName;
    this.currency.updatedBy = this.authService.userName;

    if (this.currency.id !== undefined && this.currency.id > 0) {
      this.currencyService.updateCurrencyDetails(this.currency)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/currencyList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
    else {
      this.currencyService.addCurrencyDetails(this.currency)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/currencyList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
  } 

  fetchAllRecords(): void {
    this.currencyService.getCurrencyDetails().then((res) => {
      this.currencyInfo = res;
      this.currency = res;
      console.log(res);
    }, err => { throw err; });
  }

  back() {
    if (this.currencyForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/currencyList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/currencyList');
    }
  }

  reset() {
    this.ngOnInit();
  }


}
