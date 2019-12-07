import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { ConsignmentTrackingService } from '../../../services/Transactions/consignmentTrackingService/consignment-tracking.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { pdfDocService } from '../../../services/Master/pdfDocService/pdfDoc.service';
import { BarcodeService } from '../../../services/sharedServices/barcodeService/barcode.service';
// import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-consignment-tracking',
  templateUrl: './consignment-tracking.component.html',
  styleUrls: ['./consignment-tracking.component.scss']
})

export class ConsignmentTrackingComponent implements OnInit {

  trackingList: any[];
  manifestList: any[];
  barcode: any[];
  trackingHeadingForm: FormGroup;

  public cnNO: any;
  public referenceNo: number;
  public consignorCode: string;
  public bookBranchCode: string;
  public bookBranchName: string;
  public consigneeName: string;
  public pincode: number;
  public destination: string;
  public invoiceNo: number;
  public docType: string;
  public pieces: number;
  public bookingDate: string;
  public bookingTime: string;
  public weight: number;
  public mfNo: number;
  public InvAmount: number;
  public codAmount: number;
  public toPayAmount: number;
  public mode: string;
  public magazineInvoiceNo: number;
  public magazineIssueNo: number;
  public magazineName: string;
  public consigneeAddress: string;
  public outgoingMFStatus: string;
  public vendorName: string;
  public consigneeCity: string;
  isbookingDetails: boolean = false;

  // Outpackage Varibales
  public outMFID: string;
  public outMFDate: string;
  public outMFTime: string;
  public outScannedBy: string;
  isOutPackaged: boolean = false;

  //Branch Inscanned Details
  isInscanned: boolean = false;
  public inScannedAt: string;

  //Is Vendor Delivery or (Postal, Express, same branch deliveries..)
  isVendorOrElse: boolean = false;

  //Delivery Vendor Scann Details
  outForDelivery: boolean = false;
  public deliveryMFID: string;
  public deliveryMFDate: string;
  public deliveryMFTime: string;
  public deliveryScannedBy: string;

  //POD Update Details
  podUpdated: boolean = false;
  public podDate: string;
  public podTime: string;
  public podReason: string;
  public isDelivered: string;

  // Manifest Details
  public manifestrunNo: number;
  public manifestairwayBillNo: number;
  public manifestbranchName: string;
  public manifestdeliveryCatogory: string;
  public manifestdepartureDate: Date;
  public manifestarrivalDate: Date;
  public manifestDate: Date;
  public manifestHawb: number;
  public manifestshipper: string;
  public manifestboxes: number;
  public manifestweightInKg: number;
  public manifestlandedBoxes: number;
  public manifestlandedWeightInKg: number;
  public manifestpickupDate: Date;
  isManifestDetails: boolean = false;
  // Delivery Details
  public delDate: Date;
  public delTime: string;
  public delStatus: string;
  public reason: string;
  isTracking: boolean = false;

  constructor(
    private globals: Globals,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private pdfService: pdfDocService,
    private barcodeService: BarcodeService,
    private consignmentTrackingService: ConsignmentTrackingService) {
    this.trackingHeadingForm = this.fb.group({
      'cnNO': [null],
      'complaintNumber': [null],
    });
  }

  ngOnInit() {
    this.globals.role = "Consignment Tracking";
  }

  updateValue(event) {
    let cnNO = event.target.value;
    if (cnNO.length == 11) {
      this.barcodeService.generateBarcode(cnNO).subscribe(res => {
        this.barcode = res;
      }, err => { throw err; })
      this.consignmentTrackingService.getConsignmentTrackingbyCnno(cnNO).subscribe(res => {
        this.trackingList = res;
        this.isbookingDetails = true;
        this.isManifestDetails = true;
        this.isTracking = true;
        this.trackingHeadingForm.patchValue({
          cnNO: null
        })
        let records = this.trackingList[0];
        if (!records) {
          this.trackingHeadingForm.patchValue({
            cnNO: cnNO
          })
          this.openSnackBar('CNNO Not Matched!', '2');
          this.isbookingDetails = false;
          this.isManifestDetails = false;
          this.isTracking = false;
        } else {
          if (this.trackingList[0].manifestrunNo == null) {
            this.isManifestDetails = false;
          }
          if (this.trackingList[0].delStatus == null) {
            this.isTracking = false;
          }
          this.cnNO = records.cnNO,
            this.referenceNo = records.refNo,
            this.bookBranchName = records.createdBranch,
            this.consigneeName = records.consigneeName,
            this.pincode = records.pincodeId,
            this.destination = records.destination,
            this.invoiceNo = records.invoiceNo,
            this.docType = records.docName,
            this.pieces = records.noOfPcs,
            this.bookingDate = records.bookingDate,
            this.bookingTime = records.bookingTime,
            this.weight = records.pcsWtKgs,
            this.InvAmount = records.estimatedAmount,
            this.mode = records.modeName,
            this.vendorName = records.postalCode,
            this.magazineInvoiceNo = records.invoiceNo,
            this.magazineIssueNo = records.issueNo,
            this.magazineName = records.magazineName,
            this.consigneeAddress = records.consigneeAddress,
            this.consigneeCity = records.consigneeCity,
            this.outgoingMFStatus = records.refOutAddStatus === '1' ? 'OUT FOR DELIVERY' : 'NOT OUT SCANNED',

            // Out Package Details
            this.isOutPackaged = records.refOutAddStatus === '1' ? true : false;
            this.outMFID = records.refOutMfID,
            this.outMFDate = records.refOutMFdate,
            this.outMFTime = records.refOutMFTime,
            this.outScannedBy = records.outScannedBy,

            //Branch Inscanned Details
            this.isInscanned = records.isInScanned,
            this.inScannedAt = records.inScannedAT,
            this.isVendorOrElse = records.isVendorDelivery === 1 ? true : false,

            //Branch Delivery Outscanned
            this.outForDelivery = records.refOutForDelivery;
            this.deliveryMFID = records.refAgntDelvMFID;
            this.deliveryMFDate = records.refAgntMFDate;
            this.deliveryMFTime = records.refAgntMFTime;
            this.deliveryScannedBy = records.deliveryScannedBy;

            //Proof Of Delivery (POD)
            this.podUpdated =  records.podStatus;
            this.podDate = records.podDelDate;
            this.podTime = records.podDelTime;
            this.podReason = records.podReason;
            this.isDelivered = records.podStatus;

            // manifest details
            // this.manifestrunNo = records.manifestrunNo,
            // this.manifestairwayBillNo = records.manifestairwayBillNo,
            // this.manifestbranchName = records.manifestbranchName,
            // this.manifestdeliveryCatogory = records.manifestdeliveryCatogory,
            // this.manifestdepartureDate = records.manifestdepartureDate,
            // this.manifestarrivalDate = records.manifestarrivalDate,
            // this.manifestDate = records.manifestDate,
            // this.manifestHawb = records.manifestHawb,
            // this.manifestshipper = records.manifestshipper,
            // this.manifestboxes = records.manifestboxes,
            // this.manifestweightInKg = records.manifestweightInKg,
            // this.manifestlandedBoxes = records.manifestlandedBoxes,
            // this.manifestlandedWeightInKg = records.manifestlandedWeightInKg,
            // this.manifestpickupDate = records.manifestpickupDate,
            // delivery Details
            this.delDate = records.delDate,
            this.delTime = records.delTime,
            this.delStatus = records.delStatus == '1' ? 'Delivered' : 'Non - Delivered',
            this.reason = records.reason
        }
      }, err => { throw err; })
    }
  }

  openSnackBar(message: string, action: string) {
    if (action == '2') {
      this.snackBar.open(message, "Warning!", {
        duration: 2000,
        panelClass: ['background-red']
      });
    }
  }

  getReport(): void {
    console.log(this.trackingList);
    if (this.trackingList && this.trackingList.length > 0) {
      this.pdfService.trackingReportPDF(this.trackingList).subscribe(response => {
        var file = new Blob([response.body], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(file);
        var objectUrl = URL.createObjectURL(file);
        var a = document.createElement("a");
        var id = this.trackingList[0].cnNO;
        a.href = objectUrl;
        a.download = 'Consignment Tracking - ' + id + '.pdf';
        a.click();
        window.URL.revokeObjectURL(objectUrl);
      }, error => {
          console.log(error);
        });
    }
  };

}
