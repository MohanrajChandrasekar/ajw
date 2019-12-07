import { Component, OnInit } from '@angular/core';
import { Globals } from '../../global';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentMagazineService } from '../../services/Master/documentMagazineService/document-magazine.service';
import { BookIssueService } from '../../services/Master/bookIssueService/book-issue.service';
import { ShipperService } from '../../services/Master/shipperService/shipper.service';
import { MisroutedServicesService } from '../../services/Transactions/misrouted/misrouted-services.service';
import { AuthService } from '../../login/auth.service';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { OpenDialogBoxService } from '../../services/sharedServices/openDialogBoxService/open-dialog-box.service';

@Component({
  selector: 'app-mis-routed',
  templateUrl: './mis-routed.component.html',
  styleUrls: ['./mis-routed.component.scss']
})
export class MisRoutedComponent implements OnInit {

  misRouteForm: FormGroup;
  docTypeList: any[];
  magazineList: any[];
  issueList: any[];
  shipperList: any[];
  shipments: any[];
  temp: any[];

  constructor(private globals: Globals,
              private fb: FormBuilder,
              private _route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private documentService: DocumentMagazineService,
              private bookIssueService: BookIssueService,
              private shipperService: ShipperService,
              private openDialogBoxService: OpenDialogBoxService,
              private misroutedService: MisroutedServicesService) { 
        this.misRouteForm = fb.group({
          'id': undefined,
          'customerName': [null, Validators.required],
          'custAddress': [null, Validators.required],
          'custCity': [null, Validators.required],
          'custState': [null, Validators.required],
          'custCountry': [null, Validators.required],
          'zipcode': [null, Validators.required],
          'pcsWtKgs': [null, Validators.required],
          'docType': [null, Validators.required],
          'magazineName': [null, Validators.required],
          'issueNo': [null, Validators.required],
          'shipperID': [null, Validators.required],
          'noOfPcs': [null, Validators.required],
          'bookingMF': '',
          'runNumber': '',
          'HAWBNo': '',
          'MAWBNo': ''
        })
      }

  ngOnInit() {
    this.globals.role = 'Misrouted Shipments';
    this.fetchLOVs();
    this.fetchFormData();
  }

  get f() {
    return this.misRouteForm.controls;
  }

  get userName(): string {
    var _user = this.authService.currentUser();
    if (_user != undefined && _user != null) {
      return this.authService.currentUser().userName;
    }
    return '';
  }

  fetchLOVs() {

    this.documentService.getDocumentDetails().then(res => {
      this.docTypeList = res;
    }, err => { throw err; });

    this.documentService.getMagazineDetails().then(res => {
      this.magazineList = res;
    }, err => { throw err; });

    this.bookIssueService.getBookIssueDetails().then(res => {
      this.issueList = res;
    }, err => { throw err; });

    this.shipperService.getShipperDetails().then(res => { // Shipper Selection Items
      this.shipperList = res;
    }, err => { throw err; });

  }

  fetchFormData() {
    if (this._route.snapshot.queryParams.bookingMF && this._route.snapshot.queryParams.HAWB && this._route.snapshot.queryParams.MAWB && this._route.snapshot.queryParams.run) {
      this.misRouteForm.patchValue({
        bookingMF: this._route.snapshot.queryParams.bookingMF,
        runNumber: this._route.snapshot.queryParams.run,
        HAWBNo: this._route.snapshot.queryParams.HAWB,
        MAWBNo: this._route.snapshot.queryParams.MAWB
      });
    }
    this.misroutedService.getMisroutedShipments().then( res => {
      this.shipments = res;
      this.temp = res;
    });
  }

  documentTypeSearch(term: string, item: any) { // Document Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  magazineTypeSearch(term: string, item: any) { // Magazine Search
    term = term.toLocaleLowerCase();
    return item.magazineCode.toLocaleLowerCase().indexOf(term) > -1 || item.magazineName.toLocaleLowerCase().indexOf(term) > -1;
  }

  issuSearch(term: string, item: any) { //Book Issue No Search,
    term = term.toLocaleLowerCase();
    return item.id.toLocaleLowerCase().indexOf(term) > -1 || item.issCode.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchShipper(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.shipperCode.toLocaleLowerCase().indexOf(term) > -1 || item.shipperName.toLocaleLowerCase().indexOf(term) > -1;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: any[] = this.temp.filter(function (d) {
      return  (d.customerName.toLowerCase().indexOf(val) !== -1 || !val) ||
              (d.custAddress.toLowerCase().indexOf(val) !== -1 || !val) ||
              (d.custCity.toLowerCase().indexOf(val) !== -1 || !val) ||
              (d.custCountry.toLowerCase().indexOf(val) !== -1 || !val) ||
              (d.custState.toLowerCase().indexOf(val) !== -1 || !val) ||
              (d.zipcode.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.shipments = temp1;
  }
  
  edit(id) {
    this.misroutedService.getMisroutedShipmentByID(id).then(res =>{
      this.misRouteForm.patchValue({
        id: id,
        customerName: res.customerName,
        custAddress: res.custAddress,
        custCity: res.custCity,
        custCountry: res.custCountry,
        custState: res.custState,
        zipcode: res.zipcode,
        docType: res.docType,
        issueNo: res.issueNo,
        magazineName: res.magazineName,
        pcsWtKgs: res.pcsWtKgs,
        noOfPcs: res.noOfPcs,
        shipperID: res.shipperID
      })
    })
  }
  
  delete(id): void {
    var shipment = this.shipments.filter(ex => ex.id === id)
    if (shipment && shipment.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.misroutedService.deleteMisroutedShipment(shipment[0]).subscribe(res => {
              this.fetchFormData();
              this.openDialogBoxService.openSnackBar("Deleted successfully", "");
            }, err => { throw err; });
        }
      }, err => { throw err; });
    }
  }

  save() {
    let obj = Object.assign({}, this.misRouteForm.value);
    obj.createdBy =  this.userName;
    obj.updatedBy =  this.userName;
    obj.id == "" ? undefined : obj.id;
    if(obj.id != undefined || obj.id != null){//Update
      this.misroutedService.updateMisroutedShipment(obj).subscribe(res => {
        this.openDialogBoxService.openSnackBar(res, "");
        this.misRouteForm.reset();
        this.fetchFormData();
      })
    } else {//Save
      this.misroutedService.addMisroutedShipment(obj).subscribe(res => {
        if(res.statusBool == 1){
          this.openDialogBoxService.openSnackBar(res.statusText, "");
          this.misRouteForm.reset();
          this.fetchFormData();
        }else{
          this.openDialogBoxService.openSnackBar(res.statusText, 'err');
        }
      })
    }    
  }
 
  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == "") {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-red'] });
    }
  }

}
