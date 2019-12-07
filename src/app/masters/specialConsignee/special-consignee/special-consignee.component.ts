import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/customValidators';
import { Router} from '@angular/router';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { SpecialConsigneeService } from '../../../services/Master/specialConsigneeService/specialConsignee.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import {SpecialConsignee}from '../specialConsignee';


@Component({
  selector: 'app-special-consignee',
  templateUrl: './special-consignee.component.html',
  styleUrls: ['./special-consignee.component.scss']
})
export class SpecialConsigneeComponent implements OnInit {
  

  specialConsigneeForm: FormGroup;
  specialConsignee: SpecialConsignee = new SpecialConsignee();
  specialConsigneeInfo: any[];
  temp: any[];
  currentUser: any;
  
  constructor(
    private specialService: SpecialConsigneeService,
    private fb: FormBuilder,
    private router: Router,
    private xlsxService: XlsxService,
    private globals: Globals,
    private openDialogBoxService: OpenDialogBoxService) {

    this.specialConsigneeForm = this.fb.group({
      'id': '',
      'consigneeName': [null, Validators.compose([Validators.required])],
      'consigneeAddress': [null, Validators.compose([Validators.required])],
      'pincode': [null, Validators.compose([Validators.required, CustomValidators.pincodePattern()])],
    });
  }

  get f() {
    return this.specialConsigneeForm.controls;
  }
  
  ngOnInit() {
    this.globals.role = 'SpecialConsignee Master';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currentUser);
    this.fetchAllRecords();
  }


  fetchAllRecords(): void {
    this.specialService.getSpecialConsigneeList().then((res) => {
      this.specialConsigneeInfo = res;
      this.temp = res;
    }, err => {throw err; });
  }  
  
  onFormSubmit(): void {
    this.specialConsignee= Object.assign({}, this.specialConsigneeForm.value);
    this.specialConsignee.createdBy = this.currentUser.userName;
    this.specialConsignee.updatedBy = this.currentUser.userName;
    console.log( this.specialConsignee);
    
    if (this.specialConsignee.id !== undefined && this.specialConsignee.id > 0) {
      this.specialService.updatespecialConsignee(this.specialConsignee)
        .subscribe(res => {
          if (res.statusBool == 200) {
            this.openDialogBoxService.openSnackBar(res.message, "");
            this.fetchAllRecords();
            this.specialConsigneeForm.reset();
          }
        }, err => {
          this.openDialogBoxService.openSnackBar("Error While Saving!", "error");
          throw err;
        });
    }
    else {
      this.specialService.insertspecialConsignee(this.specialConsignee)
        .subscribe(res => {
          if (res.statusBool == 200) {
            this.openDialogBoxService.openSnackBar(res.message, "");
            this.fetchAllRecords();
            this.specialConsigneeForm.reset();
          }
        }, err => {
          this.openDialogBoxService.openSnackBar("Error While Saving!", "error");
          throw err;
        });
    }
  }
  
  reset() {
    this.ngOnInit();
  }


  edit(id) {
    this.specialService.getSpecialConsigneeById(id).then(res => {
      this.specialConsignee = res;
      this.specialConsigneeForm.patchValue({
        id: this.specialConsignee.id,
        consigneeName: this.specialConsignee.consigneeName,
        consigneeAddress: this.specialConsignee.consigneeAddress,
        pincode: this.specialConsignee.pincode,
        createdBy: this.specialConsignee.createdBy,
        updatedBy: this.specialConsignee.updatedBy
      });
    },
    err => { 
        throw err;
      });
  }
  
  delete(id): void {
    var specialConsigneeInfo = this.specialConsigneeInfo.filter(specialConsignee => specialConsignee.id == id)
    if (specialConsigneeInfo && specialConsigneeInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          specialConsigneeInfo[0].updatedBy = this.currentUser.userName;
          this.specialService.deletespecialConsignee(specialConsigneeInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("deleted successfully", "");
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
    let temp1: SpecialConsignee[] = this.temp.filter(function (d) {
      return (d.consigneeName.toLowerCase().indexOf(val) !== -1 || !val) ||
             (d.consigneeAddress.toLowerCase().indexOf(val) !== -1 || !val) ||
             (d.pincode.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.specialConsigneeInfo = temp1;
  }   
  
  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Consignee Name": element.consigneeName,
        "Consignee Address": element.consigneeAddress,
        "Pincode": element.pincode
      }
      data.push(val);
      i = i + 1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }    
  
  back() {
    if (this.specialConsigneeForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.specialConsigneeForm.reset();
        }
      }, err => { throw err; });
    }
    else{
      this.specialConsigneeForm.reset();
    }
  }          

}  
