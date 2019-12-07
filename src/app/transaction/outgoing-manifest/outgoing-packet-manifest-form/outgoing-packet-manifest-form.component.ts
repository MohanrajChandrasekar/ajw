import { Component, OnInit, ElementRef, Inject, ViewChild, } from '@angular/core';
import { OutgoingPacketManifest } from '../outgoingPacketManifest';
import { Globals } from '../../../global';
import { CityService } from '../../../services/Master/cityService/city.service';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { DocumentMagazineService } from '../../../services/Master/documentMagazineService/document-magazine.service';
import { OutgoingPacketManifestService } from '../../../services/Transactions/OutgoingPacketManifestService/outgoing-packet-manifest.service';
import { ModeService } from '../../../services/Master/modeService/mode.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { bookingInfo } from '../../booking/bookingInfo/bookingInfo';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { pdfDocService } from '../../../services/Master/pdfDocService/pdfDoc.service';
import { BarcodeService } from '../../../services/sharedServices/barcodeService/barcode.service';
import { ColoaderService } from '../../../services/Master/coloaderService/coloader.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { ColoaderRateService } from '../../../services/Master/coloaderRateService/coloader-rate.service';
import { _ } from 'underscore';
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { ConsignmentTrackingComponent } from '../../tracking/consignment-tracking/consignment-tracking.component';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';
import { JobPlannerService } from '../../../services/Transactions/jobPlannerService/job-planner.service';

@Component({
  selector: 'app-outgoing-packet-manifest-form',
  templateUrl: './outgoing-packet-manifest-form.component.html',
  styleUrls: ['./outgoing-packet-manifest-form.component.scss']
})
export class OutgoingPacketManifestFormComponent implements OnInit {

  @ViewChild('refOutMfID') nameField1: ElementRef;

  outgoingPacketManifest: OutgoingPacketManifest = new OutgoingPacketManifest;
  outgoingForm: FormGroup;
  bookedList: any[];
  outPackedList = [];
  officeBranchList: any[];
  cityList: any[];
  modeList: any[];
  bookingInfo: bookingInfo = new bookingInfo;
  temp: any[];
  barcode: any[];
  coloaders: any[];
  officeTypes: any[];
  balanceCount: number;
  addedCount: number;
  userInfo: any;
  secRunno: any;
  ifEdit: Boolean = false;
  officeBranch: string;
  constColoaders: any[];
  scanMethod: any[];
  isVendorScan: Boolean = false;
  runNoList: any[];
  // hawnNoList: any[];
  // secRunNo: any[];


  constructor(
    private globals: Globals,
    private incomeService: IncomeLoadService,
    private officeService: OfficeService,
    private cityService: CityService,
    private pdfService: pdfDocService,
    private jobPlanService: JobPlannerService,
    private documentMagazineService: DocumentMagazineService,
    private outgoingPacketManifestService: OutgoingPacketManifestService,
    private modeService: ModeService,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService,
    private barcodeService: BarcodeService,
    private coloaderService: ColoaderService,
    private coloaderRateService: ColoaderRateService,
    public dialog: MatDialog
  ) {
    this.outgoingForm = this.fb.group({
      'id': '',
      'cnNO': [null],
      'refOutDestOffcId': [null],
      'refOutDestOffcId1': [null],
      'refOutMfID': [null, Validators.compose([Validators.required])],
      'refOutMfID1': [null],
      'refOutMFdate': [null],
      'refOutMFdate1': [null],
      'refOutMFTime': [null],
      'refOutMFTime1': [null],
      'refOutRemarks': [null],
      'refOutColoaderID': [null, Validators.compose([Validators.required])],
      'refOutColoaderRate': [null],
      'refOutColoaderRate1': [null],
      'secRunno': [null],
      'secMawbno': [null],
      'secHAWB': [null],
      'secLandedWtKGs': [null],
      'scannedMethod': [null]
    });
  }

  ngOnInit() {
    this.globals.role = '';
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    const roles = this.userInfo.roleId.find(element => {
      if (element == '9') { return element; } // HO RoleId is '9'..
    });
    this.userInfo.isHO = roles == '9' ? true : false;
    this.scanMethod = [{'id': '1', 'name': 'Vendor Scanning'}, {'id': '2', 'name': 'Destination Branch Scanning'}];
    this.fetchAllRecords();
  }

  get f() {
    return this.outgoingForm.controls;
  }

  getScannMethod() {
    const method = this.outgoingForm.value.scannedMethod;
    this.bookedList = [];
    this.outPackedList = [];
    if (method == 1) {
      this.isVendorScan = true;
      this.getScannables();
    } else {
      this.isVendorScan = false;
    }
  }

  fetchAllRecords() {
    this.officeBranches();
    if (this._route.snapshot.queryParams.refOutMfID) {
      const refOutMfID = this._route.snapshot.queryParams.refOutMfID;
      this.outgoingPacketManifestService.getOutgoingPacketManifestByMfId(refOutMfID).then(res => {
        const records = res[0];
        this.outgoingForm.patchValue({
          refOutRemarks: records.refOutRemarks,
          refOutMfID: records.refOutMfID,
          refOutMfID1: records.refOutMfID,
          refOutDestOffcId: records.refOutDestOffcType,
          refOutDestOffcId1: records.refOutDestOffcType,
          refOutColoaderRate: records.refOutColoaderRate,
          refOutColoaderRate1: records.refOutColoaderRate,
        });
        this.bookedList = [...res];
        this.getBranchPackages();
        this.outgoingForm.patchValue({
          refOutColoaderID: records.refOutColoaderID,
          refOutColoaderRate: records.refOutColoaderRate,
          refOutColoaderRate1: records.refOutColoaderRate
        });
      }, err => { throw err; });
      this.ifEdit = true;
    } else { // auto gen - outMF ID
      this.outgoingPacketManifestService.generateOutMFID().subscribe(res => {
        if (res.statusBool == 200) {
          let refoutMFID;
          if (this.userInfo.id.length > 3) {
            refoutMFID = '2' + this.userInfo.id.slice(-2) + '' + res.data[0].outMFID;
          } else {
            refoutMFID = this.userInfo.id + '' + res.data[0].outMFID;
          }
          this.outgoingForm.patchValue({
            refOutMfID: refoutMFID,
            refOutMfID1: refoutMFID
          });
        }
      });
    }

    this.officeService.getOfficeTypes().subscribe( res => {
      this.officeTypes = res;
    }, err => { throw err; });

    this.cityService.getCityDetails().then(res => {
      this.cityList = res;
    }, err => { throw err; });

    this.modeService.getModeDetails().then(res => {
      this.modeList = res;
    }, err => { throw err; });

    this.coloaderService.getColoaderDetails().then(res => {
      this.constColoaders = res;
    }, err => { throw err; });

    const d = new Date();
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    const yyyy = d.getFullYear();
    const HH = d.getHours();
    const MM = d.getMinutes();
    const SS = d.getSeconds();
    const date = dd + '/' + mm + '/' + yyyy;
    const time = HH + ':' + MM + ':' + SS;
    this.outgoingForm.patchValue({ refOutMFdate1: date, refOutMFTime1: time });

    this.incomeService.getIncomingBranchWise(this.userInfo).subscribe( res => {
      this.runNoList = res;
    });
  }

  officeBranches() {
    this.officeService.getOfficeDetails().then(res => {
      this.officeBranchList = res;
      const maxId = _.max(this.officeBranchList, function(ele){
        return parseInt(ele.id, 10);
      });
      const id = this.outgoingForm.value.refOutDestOffcId;
      const obj = this.officeBranchList.find(function(element) {
        if (element.id == id) { return element.name; }
      });
      this.officeBranch = obj.name;
    }, err => { throw err; });
  }

  officeSearch(term: string, item: any) {  // office Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  coloaderSearch(term: string, item: any) {  // co-loader Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 ||
            item.name.toLocaleLowerCase().indexOf(term) > -1 ;
  }

  customSearchBranch(term: string, item: any) { // Branch Custom Search
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  runNOSearchBranch(term: string, item: any) { // Branch Custom Search
    term = term.toLocaleLowerCase();
    return item.secRunno.toLocaleLowerCase().indexOf(term) > -1 || item.secMawbno.toLocaleLowerCase().indexOf(term) > -1;
  }

  updateValue(event) {
    const cnNO = event.target.value;
    if (cnNO.length == 11) {
      if (this.outPackedList.length) {
        if (this.outPackedList.length > 39) {
          this.openSnackBar('Package Overfull!', '2');
          return;
        }
        const check = _.countBy(this.outPackedList, function(ele) {
          return ele.cnNO == cnNO;
        });
        if (check.true) {
          this.openSnackBar('Already Added!', '2');
          this.outgoingForm.patchValue({cnNO: ''});
          return;
        }
      }
      // this.outgoingPacketManifestService.checkForOutScanByCNNO(cnNO).subscribe(res => {
      //   if (res.statusBool == 200) {
      //     if (res.flag) {
      //       const data = res.mainResult[0];
      //       if (parseInt(data.refOutAddStatus, 10)) {
      //         this.openSnackBar('Outscanned Consignment!', '2');
      //         return;
      //       } else {
      //         const check1 = _.countBy(this.bookedList, function(ele) {
      //           return ele.cnNO == cnNO;
      //         });
      //         if (!check1.true) {
      //           this.openSnackBar('Not Related Consignment!', '2');
      //           this.outgoingForm.patchValue({cnNO: ''});
      //           return;
      //         }
      //         this.addIntoList(cnNO);
      //         this.openSnackBar('Added Successfully!', '1');
      //       }
      //     } else {
      //         this.openSnackBar(res.message, '2');
      //         return;
      //     }
      //   }
      // });
      const check1 = _.countBy(this.bookedList, function(ele) {
        return ele.cnNO == cnNO;
      });
      if (!check1.true) {
        this.openSnackBar('Consignment not in the displayed list, Kindly use track option.', '2');
        this.outgoingForm.patchValue({cnNO: ''});
        return;
      }
      const result = _.find(this.bookedList, (ele) => {
        return ele.cnNO == cnNO;
      });
      result['refOutAddStatus'] = 1;
      result['refOutColoaderRate'] = (this.outgoingForm.value.refOutColoaderRate * result['pcsWtKgs']).toFixed(2);
      if (result.refOutAddStatus == 1) {
        this.addedCount = this.addedCount + 1;
      }
      this.outPackedList.push(result);
      this.outPackedList = [...this.outPackedList];
      this.openSnackBar('Added Successfully!', '1');
      this.outgoingForm.patchValue({cnNO: ''});
    }
  }

  getClear() {
    this.outgoingForm.get('scannedMethod').reset();
    this.outgoingForm.get('refOutDestOffcId').reset();
  }

  addIntoList(cnNO) {
    this.bookedList.forEach((element, i) => { // If Save only..
      if (element.cnNO == cnNO) {
        this.bookedList[i]['refOutAddStatus'] = 1;
        this.bookedList[i]['refOutColoaderRate'] = this.outgoingForm.value.refOutColoaderRate *  this.bookedList[i]['pcsWtKgs'];
        this.outPackedList.push(this.bookedList[i]);
        this.outPackedList = [...this.outPackedList];
      }
      if (element.refOutAddStatus == 1) {
        this.addedCount = this.addedCount + 1;
      }
      this.bookedList = [...this.bookedList];
    });
  }

  openSnackBar(message: string, action: string) { // SnackBar Toaster
    if (action == '1') {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-green'] });
    } else if (action == '2') {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    } else {
      this.snackBar.open(message, '',
      { duration: 2000, verticalPosition: 'top', horizontalPosition : 'center', panelClass: ['background-red'] });
    }
  }

  getScannables() {
    const obj = Object.assign({}, this.userInfo, this.outgoingForm.value);
    console.log(obj);
    this.outgoingPacketManifestService.getOutScannableConsignments(obj).subscribe(res => {
      if (res.status == 200) {
        this.bookedList = res.queryResults;
      }
    });

    this.coloaderRateService.getColoadersForOutscan().subscribe( res => {
      if (res.status == 200) {
        this.coloaders = res.result;
      }
    });
  }


  save() { // Save Function
    this.outgoingPacketManifest = Object.assign({}, this.outgoingForm.value);
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.isVendorScan) {
      for (let i in this.outPackedList) {    // Assigned to array of Objects ..
        this.outPackedList[i]['refOutMfID'] = this.outgoingPacketManifest.refOutMfID;
        this.outPackedList[i]['refOutDestOffcId'] = this.outPackedList[i]['branchId'];
        this.outPackedList[i]['refOutDestOffcId1'] = this.outPackedList[i]['branchId'];
        this.outPackedList[i]['refOutRemarks'] = this.outgoingPacketManifest.refOutRemarks;
        this.outPackedList[i]['refOutColoaderID'] = this.outgoingPacketManifest.refOutColoaderID;
        // this.outPackedList[i]['refOutColoaderRate'] = this.outgoingPacketManifest.refOutColoaderRate;
        this.outPackedList[i]['createdBy'] = currentUser.userName;
        this.outPackedList[i]['vendorScan'] = true;
      }
    } else {
      for (let i in this.outPackedList) {    // Assigned to array of Objects ..
        this.outPackedList[i]['refOutMfID'] = this.outgoingPacketManifest.refOutMfID;
        this.outPackedList[i]['refOutDestOffcId'] = this.outgoingPacketManifest.refOutDestOffcId;
        this.outPackedList[i]['refOutDestOffcId1'] = this.outgoingPacketManifest.refOutDestOffcId;
        this.outPackedList[i]['refOutRemarks'] = this.outgoingPacketManifest.refOutRemarks;
        this.outPackedList[i]['refOutColoaderID'] = this.outgoingPacketManifest.refOutColoaderID;
        // this.outPackedList[i]['refOutColoaderRate'] = this.outgoingPacketManifest.refOutColoaderRate;
        this.outPackedList[i]['createdBy'] = currentUser.userName;
        this.outPackedList[i]['vendorScan'] = false;
      }
    }
    
    this.outgoingPacketManifestService.updateOutgoingPacketManifest(this.outPackedList).subscribe(res => {
      this.openSnackBar("Updated Successfully!", "1");
      this.router.navigateByUrl('/outgoingPacketManifestList');
    }, err => { throw err; });
  }

  getReport(): void { //Report 
        if (this.bookedList && this.bookedList.length > 0) {
      this.pdfService.outgoingReportPDF(this.bookedList).subscribe(response => {
        var file = new Blob([response.body], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(file);
        var objectUrl = URL.createObjectURL(file);
        var a = document.createElement("a");
        var id = this.bookedList[0].refOutMfID;
        a.href = objectUrl;
        a.download = 'Outgoing Packet Manifest - ' + id + '.pdf';
        a.click();
        window.URL.revokeObjectURL(objectUrl);
      },err => {
          console.log(err);
          throw err;
      });
    }
    else{
      this.openSnackBar('No records found','.');
    }
  };

  delete(row) {
    const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          let result = _.without(this.outPackedList, _.findWhere(this.outPackedList, (ele) => { return ele.cnNO == row.cnNO }));
          this.outPackedList = [...result];
          this.openDialogBoxService.openSnackBar("Deleted  successfully", "");
        }
      }, err => { throw err; });
  }

  totalPckWt: any;
  getBranchPackages() { //Get list of out packages 
    let obj = [];
    this.totalPckWt = 0;
    obj[0] = {
        'secRunno': this.outgoingForm.value.secRunno,
        'branchId': this.outgoingForm.value.refOutDestOffcId, 
        'createdBranchId': this.userInfo.branchId, 
        'createdBy': this.userInfo.userName
      }; 
    let branchObj = _.find(this.officeBranchList, (ele) => {
      return ele.id == obj[0].branchId;
    });
    if(branchObj.name == 'POSTAL') {
        this.outgoingPacketManifestService.getPostalPackages(obj[0].createdBranchId).subscribe(res=>{
          if(res.statusBool == 200) {
            if(!this._route.snapshot.queryParams.refOutMfID) {
              this.bookedList = res.data;
              this.outPackedList = [];
            }
            this.bookedList.forEach((element, i) => {
              if (element.refOutAddStatus == undefined) {
                this.bookedList[i]['refOutAddStatus'] = 0;
              }
              // this.totalPckWt = this.totalPckWt + element.pcsWtKgs;
            });
            this.getColoders(branchObj.name);
          }
        });
    } else {
      this.outgoingPacketManifestService.getOutPackingBranchWise(obj[0]).subscribe(res => {
        if ( res.status == 200 ) {
          if (!this._route.snapshot.queryParams.refOutMfID) {
            this.bookedList = res.data;
            this.outPackedList = [];
          }
          this.bookedList.forEach((element, i) => {
            if (element.refOutAddStatus == undefined) {
              this.bookedList[i]['refOutAddStatus'] = 0;
            }
            // this.totalPckWt = this.totalPckWt + element.pcsWtKgs;
          });
          this.getColoders(branchObj.name);
        }
      }, err => { throw err; });
    }
  }

  back() {
    if (this.outgoingForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel(" You may lost the data? ");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/outgoingPacketManifestList');
        }
      }, err => { throw err; });
    } else {
      this.router.navigateByUrl('/outgoingPacketManifestList');
    }
  }

  getColoaderRate() {
    var val = this.outgoingForm.value.refOutColoaderID;
    for (const i of this.coloaders) {
      if (val == i.id) {
        this.outgoingForm.patchValue({
          refOutColoaderRate1: (i.rate).toFixed(2),
          refOutColoaderRate: (i.rate).toFixed(2)
        });
        return;
      }
    }
  }

  getColoders(isBranch) {
    if (isBranch == 'POSTAL') {
      var findResult = _.find(this.constColoaders, function(element) {
        return element.coloaderName == isBranch;
      });
      findResult.name = findResult.coloaderName;
      findResult.code = findResult.coloaderCode;
      findResult.rate = 0; 
      this.coloaders = [...findResult];
    } else {
      let obj = {
          originBranchID: this.userInfo.branchId,
          destinationBranchID: this.outgoingForm.value.refOutDestOffcId
      }
      var findResult = _.find(this.officeBranchList, function(element) {
        return element.id == obj.destinationBranchID;
      });
      findResult.originBranch = this.userInfo.branchName;
      this.coloaderRateService.getColoadersByBranches(findResult).subscribe(res => {
        if (res.status == 200) {
          this.coloaders = res.data;
        }
      }, err => { throw err; });
    }
  }

  isOutMFID() {
    let outMFID = this.outgoingForm.value.refOutMfID;
    if(outMFID.length == 8){
      this.outgoingPacketManifestService.checkOutMFIDisExist(outMFID).subscribe(res => {
        if(res.statusBool == 200){
          if(res.data.isExists){
            this.openSnackBar("Manifest Id already assigned!", "Error");
            this.nameField1.nativeElement.focus();
          }
        }
      });
    }
  }

  exportXlsx() {
    var data: any[] = [];
    this.bookedList.forEach(element => {
      var val = {
        "Consignment Number": element.cnNO,
        "Pieces": element.noOfPcs,
        "Weight(Kgs)": element.pcsWtKgs,
        "Pincode": element.pincodeId,
        "Amount": element.noOfPcs,
        "Consignee Name": element.consigneeName,
        "Consignee Address": element.consigneeAddress
      }
      data.push(val);
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }

  openTrackDialog(): void { // Open tracking as dialog box
      const dialogRef = this.dialog.open(ConsignmentTrackingComponent, {
        width: '750px',
        height: '550px'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      }, err => { throw err; });
  }

}
