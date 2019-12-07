import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals } from '../../global';
import { FailedCnnoHandlingService } from '../../services/Transactions/failedCnnoHandlingService/failed-cnno-handling.service';
import { ConsignServiceService } from '../../services/Master/consignService/consign-service.service';
import { DtpBindFormatService } from '../../shared/dtp-bind-format.service';
import { Handling } from './handling';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentMagazineService } from '../../services/Master/documentMagazineService/document-magazine.service';
import { OpenDialogBoxService } from '../../services/sharedServices/openDialogBoxService/open-dialog-box.service';

export interface DialogData {
  id: string;
  cnNO: number;
}

@Component({
  selector: 'app-failed-consignment-handling',
  templateUrl: './failed-consignment-handling.component.html',
  styleUrls: ['./failed-consignment-handling.component.scss']
})
export class FailedConsignmentHandlingComponent implements OnInit {

  handlingForm: FormGroup;
  handlingList: any[];
  consigneeList: any[];
  consignorList: any[];
  handling: Handling = new Handling;
  consigneeAddress: any[];
  rebooking: any[];
  selected = [];
  temp: any[];
  userInfo: any;

  constructor(private globals: Globals,
    private fb: FormBuilder,
    public failedCnnoHandlingService: FailedCnnoHandlingService,
    private consignServiceService: ConsignServiceService,
    public dialog: MatDialog,
    private dtpBinder: DtpBindFormatService,
    public openDialogBoxService: OpenDialogBoxService
  ) {
    this.handlingForm = this.fb.group({
      'fromDate': [null],
      'toDate': [null],
      'consignorName': [null],
      'consigneeName': [null]
    });
  }

  ngOnInit() {
    this.globals.role = 'Failed Consignment';
    this.consignServiceService.getConsigneeDetail().then(res => {
      this.consigneeList = res;
    }, err => { throw err });

    this.consignServiceService.getConsignorDetails().then(res => {
      this.consignorList = res;
    }, err => { throw err });

    this.handlingForm.patchValue({
      fromDate: this.dtpBinder.jsonDate(new Date()),
      toDate: this.dtpBinder.jsonDate(new Date())
    });
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    const roles = this.userInfo.roleId.find(ele => {
      if (ele == '9') {
        return ele;
      } // HO RoleId is '9'..
    });
    this.userInfo.isHO = roles == '9' ? true : false;

    this.getFilteredData();
  }

  getFilteredData() {
    this.failedCnnoHandlingService.getFailedCnnoData(this.userInfo).subscribe(res => {
      this.handlingList = res;
      this.temp = res;
    }, err => { throw err; });
  }

  changeAddress(id, cnNO): void {
    const dialogRef = this.dialog.open(DialogOverviewExample, {
      width: '500px',
      height: '350px',
      data: { id: id, cnNO: cnNO }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getFilteredData();
    }, err => { throw err; });
  }

  updateValue() {
    this.failedCnnoHandlingService.updateRebooking(this.selected).subscribe(res => {
      this.rebooking = res;
      this.getFilteredData();
    }, err => { throw err });
    this.openDialogBoxService.openSnackBar("Updated in Booking", '');
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.selected.forEach((element, i) => {
      this.selected[i]['rebookingFlag'] = 1;
    });
  }

  updateFilter(event) {      // Filter Function
    const val = event.target.value.toLocaleLowerCase();
    const temp1: any[] = this.temp.filter(function (d) {
        return (d.cnNO.toLowerCase().indexOf(val) !== -1 || !val);
                // (d.name.toLowerCase().indexOf(val) !== -1 || !val) ||
                // (d.refOutMFdate.toString().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.handlingList = temp1;
  }

}

// <<<<<<<<<<<<<<<<<< --------------- Dialog Box TS File ------------------->>>>>>>>>>>>>>>>>>>>>
@Component({
  selector: 'changeAddress',
  templateUrl: 'changeAddress.html',
})
export class DialogOverviewExample {

  consignType: any[];
  magazineList: any[];
  docTypeList: any[];
  dialogForm: FormGroup;
  handling: Handling = new Handling();
  isDocument: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExample>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public failedCnnoHandlingService: FailedCnnoHandlingService,
    private consignServiceService: ConsignServiceService,
    public openDialogBoxService: OpenDialogBoxService,
    private documentService: DocumentMagazineService) {

    this.dialogForm = this.fb.group({
      'id': '',
      'name': [null, Validators.compose([Validators.required])],
      'city': [null, Validators.compose([Validators.required])],
      'address': [null, Validators.compose([Validators.required])],
      'type': [null, Validators.compose([Validators.required])],
      'magazine': [null],
      'contactNumber': [null, Validators.compose([Validators.required])],
      'zipCode': [null, Validators.compose([Validators.required])],
      'docID': [null]
    });
  }

  ngOnInit() {
    this.consignServiceService.getConsigneeConsignorDetailById(this.data.id).then(res => {
      console.log(res);
      this.handling = res;
      if (this.handling.docID == null || this.handling.docID != 2) {
        this.isDocument = false;
        this.dialogForm.patchValue({
          id: this.data.id,
          name: this.handling.name,
          city: this.handling.city,
          address: this.handling.address,
          contactNumber: this.handling.contactNumber,
          zipCode: this.handling.zipCode,
          type: this.handling.type,
          docID: this.handling.docID,
          magazine: null
        })
      }
      else {
        this.isDocument = true;
        this.dialogForm.patchValue({
          id: this.data.id,
          name: this.handling.name,
          city: this.handling.city,
          address: this.handling.address,
          magazine: this.handling.magazine,
          contactNumber: this.handling.contactNumber,
          zipCode: this.handling.zipCode,
          type: this.handling.type,
          docID: this.handling.docID
        });
      }

    }, err => { throw err });

    this.documentService.getDocumentDetails().then(res => {
      this.docTypeList = res;
    }, err => { throw err; });

    this.documentService.getMagazineDetails().then(res => {
      this.magazineList = res;
    }, err => { throw err; });

  }

  // Magazine Search
  magazineTypeSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  // Document Search
  documentTypeSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.type.toLocaleLowerCase().indexOf(term) > -1;
  }

  saveDetails(): void {
    this.handling.cnNO = this.data.cnNO;
    this.handling.name = this.dialogForm.value.name;
    this.handling.city = this.dialogForm.value.city;
    this.handling.address = this.dialogForm.value.address;
    this.handling.zipCode = this.dialogForm.value.zipCode;
    this.handling.contactNumber = this.dialogForm.value.contactNumber;
    this.handling.magazine = this.dialogForm.value.magazine;
    this.handling.docID = this.dialogForm.value.docID;
    this.failedCnnoHandlingService.updateAddress(this.handling).subscribe(res => {
    }, err => { throw err; });
    this.dialogRef.close();
    this.openDialogBoxService.openSnackBar('Address Updated', '');
  }

  back() {
    this.dialogRef.close();
  }

  docLoad() {
    if (this.dialogForm.value.docID == 2) {
      this.isDocument = true;
    }
    else {
      this.isDocument = false;
      this.dialogForm.patchValue({
        magazine: null
      })
    }
  }

}

