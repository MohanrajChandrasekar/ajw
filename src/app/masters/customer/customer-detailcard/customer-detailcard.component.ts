import { Component, OnInit,ViewChild, Inject} from '@angular/core';
import { Customer } from '../customer';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-detailcard',
  templateUrl: './customer-detailcard.component.html',
  styleUrls: ['./customer-detailcard.component.scss']
})
export class CustomerDetailcardComponent implements OnInit {

    @ViewChild('CustomerFormComponent') cardDetails: Number;
    customer: Customer = new Customer();
  
    constructor(@Inject(MAT_DIALOG_DATA) public data: Customer) { }
  
    ngOnInit() {
    }
  
    ngAfterViewInit() {
      this.customer = this.data;
    }
  }
  