import { Component, OnInit,ViewChild, Inject } from '@angular/core';
import { Employee } from '../employee';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-detail-card',
  templateUrl: './employee-detail-card.component.html',
  styleUrls: ['./employee-detail-card.component.scss']
})
export class EmployeeDetailCardComponent implements OnInit {


  @ViewChild('EmployeeFormComponent') cardDetails: Number;
  employee: Employee = new Employee();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Employee) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.employee = this.data;
  }
}
