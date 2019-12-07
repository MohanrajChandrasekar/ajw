import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { BookingDetailsService } from '../../../services/Transactions/bookingDetailsService/booking-details.service';
import { Router } from '@angular/router';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { List } from './list';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {

  bookingList: any[];
  temp: any[];
  listForm: FormGroup;
  currentUser: any;
  list: List = new List();
 
  constructor(private globals: Globals,
              private dtpService: DtpBindFormatService,
              private router: Router,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private bookingService: BookingDetailsService, 
              private xlsxService: XlsxService) {
      console.log('Inside the constructor()');
    this.listForm = this.fb.group({
      'frmDate' : [null],
      'toDate' : [null]
    });
  }

  ngOnInit() {
    console.log('Inside the ngOnInt()');
    this.globals.role = 'Booked Details';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let roles = this.currentUser.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    this.currentUser.isHO = roles == '9' ? true : false;
    this.fetchAllRecords();
  }

  fetchAllRecords() {
    this.bookingService.getBookedList(this.currentUser).subscribe( res => {
      let obj = []; 
      if(res){
        res.forEach(element => {
          if(element.isSpecialCustomer == false){ obj.push(element);}
        });
       }
      console.log(obj);
      this.bookingList = obj; 
      this.temp = obj;
    }, err => { throw err; });
  }

  // Add New
  btnClick(){
    this.router.navigateByUrl('/detailedBooking');
  }

  // Delete By ID
  delete(id): void {
    var Info = this.bookingList.filter(incInf => incInf.id === id)
      if (Info && Info.length > 0) {
        const dialogRef = this.openDialog("Are you sure want to delete?");
          dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
              this.bookingService.deleteBookingInfo(Info[0]).subscribe(
                res => {``
                  this.fetchAllRecords();
                  this.openSnackBar("Deleted successfully", "");
                }, err => {throw err;});
            }
      }, err => { throw err; });
    }
  }

  // Edit Click
  edit(id): void{
    this.router.navigate(['/detailedBooking'],{queryParams: {Id :id}});
  };

  // Edit Details
  editDetails(id): void{
    this.router.navigate(['/booking'],{queryParams: {Id :id}});
  }

  updateFilter(event) { // Filter Function
    const val = event.target.value.toLowerCase();
    let temp1: any[] = this.temp.filter(function (d) {
        return (d.secMawbno.toLowerCase().indexOf(val) !== -1 || !val);// ||
              // (d.secHAWB.toLowerCase().indexOf(val) !== -1 || !val) ||
              // (d.secRunno.toLowerCase().indexOf(val) !== -1 || !val) ||
              // (d.secDelDesc.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.bookingList = temp1;
  }

  // Export to xlsl
  exportXlsx() {
    var data: any[] = [];
    this.temp.forEach(element => {
      var val = {
        "Booking Id": element.id,
        "Booking Branch": element.officeName,
        "Customer Name": element.custName,
        "Delivery Category": element.secDelDesc,
        "Postal Type": element.postalCode,
        "Booking Type": element.bookingType,
        "Booking MF": element.bookingMF,
        "Reference MF": element.refMF,
        "MF Date & Tiime": element.mfDate
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

  // SnackBar Toaster
  openSnackBar(message: string, action: string) {
    if (action == "") {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition:'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }

  // Delete Confirmation
  openDialog(title: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {  title: title  };
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  // Date Wise Filter
  dateRange(){
    this.currentUser.frmDate = this.dtpService.convert(this.dtpService.reConstructDate(this.listForm.value.frmDate));
    this.currentUser.toDate = this.dtpService.convert(this.dtpService.reConstructDate(this.listForm.value.toDate));
    this.currentUser.isSpecialBookings = false;
      if(this.currentUser.frmDate && this.currentUser.toDate){
        this.bookingService.getDetailsByDate(this.currentUser).subscribe( res => {
          this.bookingList = res; 
          this.temp = res;
        }, err => {throw err;});
      }
  }

}
