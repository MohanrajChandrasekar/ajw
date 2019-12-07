import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingDetailsService } from '../../../services/Transactions/bookingDetailsService/booking-details.service';
import { MatDialog } from '@angular/material';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { SpecialBookingsService } from '../../../services/Transactions/specialCustomers/special-bookings.service';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';

@Component({
  selector: 'app-spl-cust-list',
  templateUrl: './spl-cust-list.component.html',
  styleUrls: ['./spl-cust-list.component.scss']
})
export class SplCustListComponent implements OnInit {

  specialListForm: FormGroup;
  bookingList: any[];
  temp: any[];
  currentUser: any;

  constructor(private globals: Globals,
              private router: Router,
              private dtpService: DtpBindFormatService,
              private bookingService: BookingDetailsService,
              private fb: FormBuilder,
              private spclBookingService :SpecialBookingsService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog ) {
                this.specialListForm = this.fb.group({
                  'frmDate': [null],
                  'toDate': [null]
                }); 
               }

  ngOnInit() {
    this.globals.role = 'Customers List';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let roles = this.currentUser.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    this.currentUser.isHO = roles == '9' ? true : false;
    this.fetchAllRecords();
  }

  btnClick() {
    this.router.navigateByUrl('/specialCustomerForm');
  }

  edit(id): void{ // Edit Click
    this.router.navigate(['/specialCustomerForm'],{queryParams: {Id :id}});
  };

  editDetails(id): void{ // Edit Detailed Bookings
    this.router.navigate(['/specialCustomerBooking'],{queryParams: {Id :id}});
  }

  fetchAllRecords() {
    this.bookingService.getBookedList(this.currentUser).subscribe( res => {
      let obj = []; 
      if(res){
        res.forEach(element => {
          if(element.isSpecialCustomer == true){ obj.push(element);}
        });
       }
      this.bookingList = obj; 
      this.temp = obj;
    }, err => { throw err; });
  }

  delete(id): void {
    var Info = this.bookingList.filter(incInf => incInf.id === id)
    if (Info && Info.length > 0) {
      const dialogRef = this.openDialogDlte("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.spclBookingService.deleteSpecialBookingInfo(Info[0]).subscribe( res => {
            this.fetchAllRecords();
            this.openSnackBar('Deleted Successfully!','Success');
            }, err => { throw err; });
        }
      }, err => { throw err; });
    }
  }

  openDialogDlte(title: string) {   // Delete Confirmation
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {title: title};
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "Success") {
      this.snackBar.open(message, '', {duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green']});
    } else {
        this.snackBar.open(message, '', {duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red']});
    }
  }

  dateRange(){ // Date Wise Filter
    this.currentUser.frmDate = this.dtpService.convert(this.dtpService.reConstructDate(this.specialListForm.value.frmDate));
    this.currentUser.toDate = this.dtpService.convert(this.dtpService.reConstructDate(this.specialListForm.value.toDate));
    this.currentUser.isSpecialBookings = true;
      if(this.currentUser.frmDate && this.currentUser.toDate){
        this.bookingService.getDetailsByDate(this.currentUser).subscribe( res => {
          this.bookingList = res; 
          this.temp = res;
        }, err => {throw err;});
      }
  }

}
