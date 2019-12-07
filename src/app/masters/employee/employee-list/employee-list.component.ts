import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/Master/employeeService/employee.service';
import { Employee } from '../employee';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDetailCardComponent } from '../employee-detail-card/employee-detail-card.component';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  temp = [];
  employeeInfo: any = [];
  employee: Employee = new Employee();

  constructor(private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog,
    private openDialogBoxService: OpenDialogBoxService,
    private xlsxService: XlsxService,
    private globals: Globals) { }

  ngOnInit() {
    this.globals.role = "Employee";
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/employeeForm');
  };

  fetchAllRecords(): void {
    this.employeeService.getEmployeeDetails().then((res) => {
      this.employeeInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  edit(id): void {
    this.router.navigate(['/employeeForm'], { queryParams: { id: id } });
  }

  delete(id): void {
    var empInfo = this.employeeInfo.filter(emp => emp.id === id)
    if (empInfo && empInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.employeeService.deleteEmployeeDetails(empInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted employee successfully", "");
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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: Employee[] = this.temp.filter(function (d) {
      return (d.empName.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empCode.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empAddress1.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empAddress2.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empPhone.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empEmail.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empGender.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empBloodGrp.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empDOB.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empDOJ.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empDEPT.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empDSG.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empStatus.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empDOR.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empRepOfficeType.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.empRepOffice.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.employeeInfo = temp1;
  }

  cardDetails: string;
  openCardDetails(id): void {
    var empInfoArray = this.employeeInfo.filter(emp => emp.id === id);
    if (empInfoArray && empInfoArray.length > 0) {
      var empInfo = empInfoArray[0];
      const dialogRef = this.dialog.open(EmployeeDetailCardComponent, {
        width: '400px',
        height: '350px',
        data: empInfo
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      },
      err => {
        throw err;
      });
    }
  }

  exportXlsx() {
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Employee Code": element.empCode,
        "Employee Name": element.empName,
        "Address 1": element.empAddress1,
        "Address 2": element.empAddress2,
        "Phone Number": element.empPhone,
        "Email Id": element.empEmail,
        "Gender": element.empGender,
        "Blood Group": element.empBloodGrp,
        "Date of Birth": element.empDOB,
        "Date of Joining": element.empDOJ,
        "Department": element.empDEPT,
        "Designation": element.empDSG,
        "Status": element.empStatus,
        "Date of Resigning": element.empDOR,
        "Reporting Office Type": element.empRepOfficeType,
        "Reporting Office": element.empRepOffice
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

}

