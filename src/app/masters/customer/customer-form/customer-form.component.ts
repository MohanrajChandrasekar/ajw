import { Component, OnInit } from '@angular/core';
import { Customer } from '../customer';
import { Office } from '../../office/office';
import { CustomerService } from '../../../services/Master/customerService/customer.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/customValidators';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { CityService } from '../../../services/Master/cityService/city.service';
import { City } from '../../ajw_city/City';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})

export class CustomerFormComponent implements OnInit {

  const: CustomValidators = new CustomValidators();
  customerForm: FormGroup;
  customerInfo: any = [];
  customer: Customer = new Customer();
  office: Office = new Office;
  city: City = new City;

  constructor(private customerService: CustomerService,
    private _route: ActivatedRoute,
    private router: Router,
    private openDialogBoxService: OpenDialogBoxService,
    private fb: FormBuilder,
    private officeService: OfficeService,
    private dtpBinder: DtpBindFormatService,
    private cityservice: CityService,
    private authService: AuthService,
    private globals: Globals) {

    this.customerForm = fb.group({
      'name': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'code': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'type': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'address1': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'address2': [null],
      'pin': [null, Validators.compose([Validators.required, Validators.maxLength(6)])],
      'city': [null, Validators.required],
      'phone': [null, Validators.required],
      'contact': [null],
      'email': [null, Validators.email],
      'fax': [null],
      'ent': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'contractNo': [null, Validators.required],
      'expiryDate': [null, Validators.required],
      'contractDate': [null, Validators.required],
      'renewalDate': [null, Validators.required],
    });
  }

  ngOnInit() {
    this.globals.role = 'Customer Master';
    console.log(this._route.snapshot.queryParams.id);
    this.officeService.getOfficeDetails().then(res => {
      this.office = res;
      console.log(res);
    }, err => { throw err; })
    this.cityservice.getCityDetails().then(res => {
      this.city = res;
      console.log(res);
    }, err => { throw err; })
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.customerService.getCustomerDetailsById(id).then(res => {
        this.customer = res;
        this.customerForm.patchValue({
          name: this.customer.name,
          code: this.customer.code,
          type: this.customer.type,
          address1: this.customer.address1,
          address2: this.customer.address2,
          pin: this.customer.pin,
          city: this.customer.city,
          phone: this.customer.phone,
          contact: this.customer.contact,
          email: this.customer.email,
          fax: this.customer.fax,
          ent: this.customer.ent,
          contractNo: this.customer.contractNo,
          expiryDate: this.dtpBinder.jsonDate(res.expiryDate),
          contractDate: this.dtpBinder.jsonDate(res.contractDate),
          renewalDate: this.dtpBinder.jsonDate(res.renewalDate),
          createdBy: this.customer.createdBy,
          updatedBy: this.customer.updatedBy
        });
      }, err => { throw err; });
    }
  }
  fetchAllRecords(): void {
    this.customerService.getCustomerDetails().then((res) => {
      this.customerInfo = res;
      this.customer = res;
      console.log(res);
    }, err => { throw err; });
  }

  save(): void {
    Object.assign({}, this.customer, this.customerForm.value);
    this.customer.name = this.customerForm.value.name;
    this.customer.code = this.customerForm.value.code;
    this.customer.type = this.customerForm.value.type;
    this.customer.address1 = this.customerForm.value.address1;
    this.customer.address2 = this.customerForm.value.address2;
    this.customer.pin = this.customerForm.value.pin;
    this.customer.city = this.customerForm.value.city;
    this.customer.phone = this.customerForm.value.phone;
    this.customer.contact = this.customerForm.value.contact;
    this.customer.email = this.customerForm.value.email;
    this.customer.fax = this.customerForm.value.fax;
    this.customer.ent = this.customerForm.value.ent;
    this.customer.contractNo = this.customerForm.value.contractNo;
    this.customer.expiryDate = this.dtpBinder.reConstructDate(this.customerForm.value.expiryDate);
    this.customer.contractDate = this.dtpBinder.reConstructDate(this.customerForm.value.contractDate);
    this.customer.renewalDate = this.dtpBinder.reConstructDate(this.customerForm.value.renewalDate);
    this.customer.createdBy = this.authService.userName;
    this.customer.updatedBy = this.authService.userName;
    if (this.customer.id !== undefined && this.customer.id > 0) {
      this.customerService.updateCustomerDetails(this.customer)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/customer_list');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
    else {
      this.customerService.addCustomerDetails(this.customer)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/customer_list');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });

    }
  }

  get f() {
    return this.customerForm.controls;
  }

  back() {
    if (this.customerForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/customer_list');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/customer_list');
    }
  }

  reset() {
    this.ngOnInit();
  }

}
