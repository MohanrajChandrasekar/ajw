import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/Master/customerService/customer.service';
import { Customer } from '../customer';
import { Router } from '@angular/router';
import { CustomerDetailcardComponent } from '../customer-detailcard/customer-detailcard.component';
import { Globals } from '../../../global';
import { MatDialog } from '@angular/material';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})

export class CustomerListComponent implements OnInit {

  constructor(private customerService: CustomerService,
    private router: Router,
    private globals: Globals,
    private dialog: MatDialog,
    private xlsxService: XlsxService,
    private authService:AuthService,
    private openDialogBoxService: OpenDialogBoxService) { }

  customerInfo: any = [];
  customer: Customer = new Customer();
  temp = [];

  ngOnInit() {
    this.globals.role = "Customer Master";
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/customer_form');
  };

  fetchAllRecords(): void {
    this.customerService.getCustomerDetails().then((res) => {
      this.customerInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  edit(id): void {
    this.router.navigate(['/customer_form'], { queryParams: { id: id } });
  }

  delete(id): void {
    var custInfo = this.customerInfo.filter(cust => cust.id === id)
    if (custInfo && custInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          custInfo[0].updatedBy = this.authService.userName;
          this.customerService.deleteCustomerDetails(custInfo[0]).subscribe(
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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: Customer[] = this.temp.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.code.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.type.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.address1.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.address2.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.city.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.contact.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.email.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.fax.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.ent.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.contractNo.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.expiryDate.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.renewalDate.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.pin.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.phone.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.contractDate.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.customerInfo = temp1;
  }

  cardDetails: string;
  openCardDetails(id): void {
    var custInfoArray = this.customerInfo.filter(cust => cust.id === id);
    if (custInfoArray && custInfoArray.length > 0) {
      var custInfo = custInfoArray[0];
      const dialogRef = this.dialog.open(CustomerDetailcardComponent, {
        width: '400px',
        height: '450px',
        data: custInfo
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
    var i=1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Customer Type": element.type,
        "Customer Code": element.code,
        "Customer Name": element.name,
        "Enterprise Name": element.ent,
        "Address 1": element.address1,
        "Address 2": element.address2,
        "City": element.city,
        "Pincode": element.pin,
        "Phone Number": element.phone,
        "Fax Number": element.fax,
        "Email Id": element.email,
        "Contact Person": element.contact,
        "Contract Number": element.contractNo,
        "Contract Date": element.contractDate,
        "Last Renewal Date": element.renewalDate,
        "Expiry Date": element.expiryDate
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role)
  }

}


