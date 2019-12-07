import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { EmployeeService } from '../../../services/Master/employeeService/employee.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/customValidators';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../../global';
import { Office } from '../../office/office';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
  // providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})

export class EmployeeFormComponent implements OnInit {

  const: CustomValidators = new CustomValidators();
  employeeForm: FormGroup;
  employeeInfo: any = [];
  employee: Employee = new Employee();
  office: Office = new Office();

  constructor(private employeeService: EmployeeService,
    private _route: ActivatedRoute,
    private globals: Globals,
    private router: Router,
    private openDialogBoxService: OpenDialogBoxService,
    private fb: FormBuilder,
    private officeService: OfficeService,
    private authService: AuthService,
    private dtpBinder: DtpBindFormatService) {
    this.employeeForm = fb.group({
      'id':'',
      'empName': [null, Validators.compose([Validators.required, Validators.maxLength(150), CustomValidators.nospaceValidator()])],
      'empCode': [null, Validators.compose([Validators.required, Validators.maxLength(150), CustomValidators.nospaceValidator()])],
      'empAddress1': [null, Validators.compose([Validators.required, Validators.maxLength(150), CustomValidators.nospaceValidator()])],
      'empAddress2': [null, Validators.compose([Validators.maxLength(150), CustomValidators.nospaceValidator()])],
      'empPhone': [null, Validators.compose([Validators.required, CustomValidators.phoneNumberPattern()])],
      'empEmail': [null, Validators.compose([Validators.required, Validators.email])],
      'empGender': [null, Validators.compose([Validators.required, Validators.maxLength(150), CustomValidators.nospaceValidator()])],
      'empBloodGrp': [null, Validators.compose([Validators.required, Validators.maxLength(150), CustomValidators.nospaceValidator()])],
      'empDOB': [null, Validators.compose([Validators.required])],
      'empDOJ': [null, Validators.compose([Validators.required])],
      'empDEPT': [null, Validators.compose([Validators.required, Validators.maxLength(150), CustomValidators.nospaceValidator()])],
      'empDSG': [null, Validators.compose([Validators.required, Validators.maxLength(150), CustomValidators.nospaceValidator()])],
      'empStatus': [null, Validators.required],
      'empDOR': [null],
      'empRepOffice': [null, Validators.compose([Validators.maxLength(150), CustomValidators.nospaceValidator()])],
      'empRepOfficeType': [null, Validators.compose([Validators.maxLength(150), CustomValidators.nospaceValidator()])],
    });
  }

  ngOnInit() {
    this.officeService.getOfficeDetails().then(res => {
      this.office = res;
    }, err => { throw err; })

    this.globals.role = 'Employee';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.employeeService.getEmployeeDetailsById(id).then(res => {
        this.employee = res;
        console.log(res);
        console.log(moment(res.empDOB).toDate());
        this.employeeForm.patchValue({
          empName: this.employee.empName,
          empCode: this.employee.empCode,
          empAddress1: this.employee.empAddress1,
          empAddress2: this.employee.empAddress2,
          empPhone: this.employee.empPhone,
          empEmail: this.employee.empEmail,
          empGender: this.employee.empGender,
          empBloodGrp: this.employee.empBloodGrp,
          empDOB: this.dtpBinder.jsonDate(res.empDOB),
          empDOJ: this.dtpBinder.jsonDate(res.empDOJ),
          empDEPT: this.employee.empDEPT,
          empDSG: this.employee.empDSG,
          empStatus: this.employee.empStatus,
          empDOR: this.dtpBinder.jsonDate(res.empDOR),
          empRepOffice: this.employee.empRepOffice,
          empRepOfficeType: this.employee.empRepOfficeType,
          createdBy: this.employee.createdBy,
          updatedBy: this.employee.updatedBy
        });
      }, err => { throw err; });
    }
    else {
      this.employee.empDOJ = moment().toDate();
      this.employee.empDOB = moment().toDate();
      this.employee.empDOR = moment().toDate();
    }
  }

  fetchAllRecords(): void {
    this.employeeService.getEmployeeDetails().then((res) => {
      this.employeeInfo = res;
      this.employee = res;
      console.log(res);
    }, err => { throw err; });
  }

  save(): void {
    Object.assign({}, this.employee, this.employeeForm.value);
    this.employee.empName = this.employeeForm.value.empName;
    this.employee.empCode = this.employeeForm.value.empCode;
    this.employee.empAddress1 = this.employeeForm.value.empAddress1;
    this.employee.empAddress2 = this.employeeForm.value.empAddress2;
    this.employee.empPhone = this.employeeForm.value.empPhone;
    this.employee.empEmail = this.employeeForm.value.empEmail;
    this.employee.empGender = this.employeeForm.value.empGender;
    this.employee.empBloodGrp = this.employeeForm.value.empBloodGrp;
    this.employee.empDOB = this.dtpBinder.reConstructDate(this.employeeForm.value.empDOB);
    console.log(this.employee.empDOB);
    this.employee.empDOJ = this.dtpBinder.reConstructDate(this.employeeForm.value.empDOJ);
    console.log(this.employee.empDOJ);
    this.employee.empDEPT = this.employeeForm.value.empDEPT;
    this.employee.empDSG = this.employeeForm.value.empDSG;
    this.employee.empStatus = this.employeeForm.value.empStatus;
    this.employee.empDOR = this.dtpBinder.reConstructDate(this.employeeForm.value.empDOR);
    this.employee.empRepOffice = this.employeeForm.value.empRepOffice;
    this.employee.empRepOfficeType = this.employeeForm.value.empRepOfficeType;
    this.employee.createdBy = this.userName;
    this.employee.updatedBy = this.userName;
    if (this.employee.id !== undefined && this.employee.id > 0) {
      this.employeeService.updateEmployeeDetails(this.employee)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Edited Successfully", "");
          this.router.navigateByUrl('/employeeList');
          this.fetchAllRecords();
        },
          err => {

            throw err;
          });
    }
    else {
      this.employeeService.addEmployeeDetails(this.employee)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar("Saved Successfully", "");
          this.router.navigateByUrl('/employeeList');
          this.fetchAllRecords();
        },
          err => {

            throw err;
          });
    }
  }

  get f() {
    return this.employeeForm.controls;
  }

  back(id) {
    this.router.navigate(['/employeeList'], { queryParams: { id: id } });
  }

  reset() {
    this.ngOnInit();
  }
  get userName(): string {
    var _user = this.authService.currentUser();
    if (_user != undefined && _user != null) {
      return this.authService.currentUser().userName;
    }
    return '';
  }
}
