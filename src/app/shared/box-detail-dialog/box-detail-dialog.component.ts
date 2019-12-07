import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IncomeLoadService } from '../../services/Transactions/incomeLoadService/income-load.service';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debug } from 'util';

@Component({
  selector: 'app-box-detail-dialog',
  templateUrl: './box-detail-dialog.component.html',
  styleUrls: ['./box-detail-dialog.component.scss'],
})
export class BoxDetailDialogComponent implements OnInit {

  boxForm: FormGroup;

  // @Input('formGroup') boxForm: FormGroup = new FormGroup({
  //   'boxNo' : new FormControl(''),
  //   'pieces' :  new FormControl(''),
  //   'weight' : new FormControl('')
  // });

  constructor(private dialogRef: MatDialogRef<BoxDetailDialogComponent>, 
              private mfstService: IncomeLoadService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data : Number) { 
                
              }
            
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  ngOnInit() {
    this.boxForm = this.fb.group({
      'id':[null, Validators.required],
      'boxPieces':[null, Validators.required],
      'pcsWT':[null, Validators.required]
    });
  }
  mfstID :Number;

  ngAfterViewInit(){
    console.log('viewed ID:');
    console.log(this.data);
    this.loadBoxDetails();
  }

  boxDetailList: any[];

  loadBoxDetails(){
    this.mfstID = +this.data;
    this.mfstService.getBoxDetailByMfstID(this.mfstID)
    .then( res => {
        console.log(res);
        this.boxDetailList = res;
    }, err => { throw err; });
  }

  // Edit Click
  editBox(id): void {
    // alert(id);
    // id.preventDefault();
    this.mfstService.getBoxDetailByBoxID(id)
    .then( res => {
      console.log(res);
      this.boxForm.patchValue({
        'id': res[0].mfstID,
        'boxPieces': res[0].boxPieces,
        'pcsWT': res[0].pcsWT
      });
      // this.boxForm.setValue({
      //   'boxNo': res.mfstID,
      //   'pieces': res.boxPieces,
      //   'weight': res.pcsWT
      // })
      // alert('hhh');   
    }, err => { throw err; });
    // return null;
  }

}
