import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ExpensesService } from '../../../services/Master/expensesService/expenses.service';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';
import { Expense } from '../expense';
import { CustomValidators } from '../../../shared/customValidators';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.scss']
})
export class ExpensesFormComponent implements OnInit {

  expenseForm: FormGroup;
  expense: Expense = new Expense();
  expenseInfo: any[];
  temp: any[];

  constructor(private expenseService: ExpensesService,
    private globals: Globals,
    private fb: FormBuilder,
    private authService: AuthService,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.expenseForm = fb.group({
      'id': '',
      'expenseCategory': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'description': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])]
    });
  }

  get f() {
    return this.expenseForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Expense Category Master';
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.expenseService.getExpenseDetails().then((res) => {
      this.expenseInfo = res;
      this.temp = res;
    }, err => { throw err; });
  }

  onFormSubmit(): void {
    this.expense = Object.assign({}, this.expenseForm.value);
    this.expense.description = this.expenseForm.value.description;
    this.expense.expenseCategory = this.expenseForm.value.expenseCategory;
    this.expense.createdBy = this.authService.userName;
    this.expense.updatedBy = this.authService.userName;
    if (this.expense.id !== undefined && this.expense.id > 0) {
      this.expenseService.updateExpenseDetails(this.expense)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
            this.fetchAllRecords();
            this.expenseForm.reset();
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
    else {
      this.expenseService.addExpenseDetails(this.expense)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
            this.fetchAllRecords();
            this.expenseForm.reset();
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


  edit(id) {
    this.expenseService.getExpenseDetailById(id).then(res => {
      this.expense = res;
      this.expenseForm.patchValue({
        id: this.expense.id,
        description: this.expense.description,
        expenseCategory: this.expense.expenseCategory,
        createdBy: this.expense.createdBy,
        updatedBy: this.expense.updatedBy
      });
    }, err => { throw err; });
  }

  delete(id): void {
    var exInfo = this.expenseInfo.filter(ex => ex.id === id)
    if (exInfo && exInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          exInfo[0].updatedBy = this.authService.userName;
          this.expenseService.deleteExpenseDetail(exInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted successfully", "");
            },
            err => {
              throw err;
            });
        }
      },
        err => {
          throw err;
        });
    }
  }

  // back() {
  //   if (this.expenseForm.dirty) {
  //     const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
  //     dialogRef.afterClosed().subscribe(res => {
  //       if (res == true) {
  //         this.ngOnInit();
  //       }
  //     }, err => { throw err; });
  //   }
  // }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: Expense[] = this.temp.filter(function (d) {
      return (d.expenseCategory.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.description.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.expenseInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "": i,
        "Expense Category": element.expenseCategory,
        "Description": element.description
      }
      data.push(val);
      i = i + 1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

  back() {
    if (this.expenseForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.expenseForm.reset();
        }
      }, err => { throw err; });
    }
    else{
      this.expenseForm.reset();
    }
  }

}
