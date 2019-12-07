import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { IncomeLoadService } from '../../../services/Transactions/incomeLoadService/income-load.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { boxLoad } from '../boxDetail';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { CustomValidators } from '../../../shared/customValidators';

@Component({
  selector: 'app-incoming-box',
  templateUrl: './incoming-box.component.html',
  styleUrls: ['./incoming-box.component.scss']
})
export class IncomingBoxComponent implements OnInit {

  boxForm: FormGroup;

  @Input() childMessage: Number;
  @Output() messageEvent = new EventEmitter<string>();

  constructor(private mfstService: IncomeLoadService,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {
    this.boxForm = this.fb.group({
      'boxPieces': [null, Validators.compose([Validators.required, Validators.maxLength(6)])],
      'pcsWT': [null, Validators.required],
      'id': [null]
    });
  }

  mfstID: Number;
  mfstIncmID: Number;
  boxInfo: boxLoad = new boxLoad()

  ngOnInit() {
    // let id: number = this._route.snapshot.queryParams.Id;
    this.mfstIncmID = this._route.snapshot.queryParams.Id;
    console.log(this.childMessage);
    this.mfstID = this.childMessage;

    console.log(this.mfstIncmID);
    console.log(this.mfstID);
    this.loadBoxDetails();
    console.log(this.childMessage);
  }

  get f() {
    return this.boxForm.controls;
  }

  boxDetailList: any[];
  msgRes: any = {
    'mfstID': Number,
    'mfstIncmID': Number
  };

  loadBoxDetails() {
    this.mfstService.getBoxDetailByMfstID(this.mfstID)
      .then(res => {
        console.log(res);
        this.boxDetailList = res;
      }, err => { throw err; });
  }

  editBox(id): void {
    this.mfstService.getBoxDetailByBoxID(id)
      .then(res => {
        console.log(res);
        this.boxInfo = res[0];
        console.log(this.boxInfo);
        this.boxForm.patchValue({
          'id': res[0].id,
          'boxPieces': res[0].boxPieces,
          'pcsWT': res[0].pcsWT
        });
      }, err => { throw err; });
  }

  // Save Box Info
  saveBoxInfo() {
    if (this.boxForm.value && this.boxForm.value.id == undefined) {
      this.boxInfo.mfstID = this.mfstID;
      if (this.mfstIncmID) {
        this.boxInfo.mfstIncmID = this.mfstIncmID;
        this.boxInfo.boxPieces = this.boxForm.value.boxPieces;
        this.boxInfo.pcsWT = this.boxForm.value.pcsWT;
        this.mfstService.addBoxDetailByMfstID(this.boxInfo)
          .subscribe(res => {
            this.loadBoxDetails();
            this.boxDetailList = [...this.boxDetailList];
            this.boxForm.reset();
            this.messageEvent.emit('1');
          }, err => { throw err; })
      } else {
        this.mfstService.getLoadByID(this.mfstID).then(res => {
          console.log(res);
          this.boxInfo.mfstIncmID = res.incomeID;
          this.boxInfo.boxPieces = this.boxForm.value.boxPieces;
          this.boxInfo.pcsWT = this.boxForm.value.pcsWT;
          this.mfstService.addBoxDetailByMfstID(this.boxInfo)
            .subscribe(res => {
              this.loadBoxDetails();
              this.boxDetailList = [...this.boxDetailList];
              this.boxForm.reset();
              this.messageEvent.emit('1');
            }, err => { throw err; })
        });
      }

    } else {
      // Call Update API - boxID
      this.boxInfo.mfstID = this.mfstID;
      if (this.mfstIncmID) {
        this.boxInfo.mfstIncmID = this.mfstIncmID;
      } else {

        // this.boxInfo.mfstIncmID = this.childMessage1;
      }
      this.boxInfo.id = this.boxForm.value.id;
      this.boxInfo.boxPieces = this.boxForm.value.boxPieces;
      this.boxInfo.pcsWT = this.boxForm.value.pcsWT;
      this.mfstService.updateBoxDetailByMfstID(this.boxInfo)
        .subscribe(res => {
          console.log(res);
          this.loadBoxDetails();
          this.boxDetailList = [...this.boxDetailList];
          this.boxForm.reset();

          this.msgRes = {
            'mfstID': this.mfstID,
            'mfstIncmID': this.mfstIncmID
          }
          this.messageEvent.emit(this.msgRes);
        }, err => { throw err; })
    }
  }

  // Back Button
  backTo() {
    this.router.navigateByUrl('/incomeLoad');
  }

  deleteBox(id) {
    var Info = this.boxDetailList.filter(incInf => incInf.id === id)
    if (Info && Info.length > 0) {
      const dialogRef = this.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.mfstService.deleteBoxByID(Info[0]).subscribe(
            res => {
              this.loadBoxDetails();
              this.boxDetailList = [...this.boxDetailList];
              this.openSnackBar("Deleted Box Detail successfully", "Success");
              this.messageEvent.emit('1');
            }, err => { throw err; });
        }
      }, err => { throw err; });
    }
  }

  // Delete Confirmation
  openDialog(title: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title
    };
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    return dialogRef;
  }

  // SnackBar Toaster
  openSnackBar(message: string, action: string) {
    if (action == "Success") {
      this.snackBar.open(message, '', { duration: 2000, panelClass: ['background-green'] });
    } else {
      this.snackBar.open(message, '', { duration: 2000, panelClass: ['background-red'] });
    }
  }

}
