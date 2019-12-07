import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';
import { _ } from 'underscore';
import { CustomValidators } from '../../../shared/customValidators';
import { DtpBindFormatService } from '../../../shared/dtp-bind-format.service';
import { MatSnackBar, MatDialogConfig } from '@angular/material';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';


@Component({
  selector: 'app-pod-list',
  templateUrl: './pod-list.component.html',
  styleUrls: ['./pod-list.component.scss']
})
export class PodListComponent implements OnInit {

  podFormSingle: FormGroup;
  currentUser: any;
  singlePODList: any[];
  temp: any[];
  arrayobj = [];
  
  constructor(private globals: Globals,
              private router: Router,
              private snackBar: MatSnackBar,
              private agentService: AgentDeliveryService,
              private _route: ActivatedRoute,
              private dtpFormatService: DtpBindFormatService,
              private openDialogBoxService: OpenDialogBoxService,
              private fb: FormBuilder) {
              this.podFormSingle = this.fb.group({
                'cnNO' : [null],
                'delCode': [null],
                'delDate': [null],
                'delTime': [null,Validators.compose([Validators.maxLength(4),Validators.minLength(4), Validators.required, CustomValidators.nospaceValidator()])],
                'delStatus': [null],
                'reason': [null],
                'delSign': [null],
                'postalCode' : [null],
                'bookedDate' : [null],
                'vendorpickedDate' : [null]
              });
  }

  ngOnInit() {
    this.globals.role = 'Single POD Update';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let roles = this.currentUser.roleId.find(element => {
      if(element == '9') return element; //HO RoleId is '9'..
    });
    this.currentUser.isHO = roles == '9' ? true : false;
    console.log(this.currentUser);
    this.fetchFormData();
  }

  fetchFormData() {
    this.agentService.getListOfNotUpdatedPODs(this.currentUser).subscribe( res => {
      console.log(res);
      if (res.status == 200) {
        this.singlePODList = res.queryResults;
        this.temp = res.queryResults;
      }
    });
  }

  onSelect(event, row) { // On Checkbox Ticked & Unticked..
    
    const obj = Object.assign({}, this.podFormSingle.value);
    obj.createdBy = this.currentUser.userName;
    const dtFRM = this.dtpFormatService.dateISO(obj.delDate);

    if (this.arrayobj.length < 5) {
      if (event.checked) {
        this.arrayobj.push({
         'cnNo': row.cnNO,
         'createdBy': obj.createdBy,
         'delCode': obj.delCode,
         'delDate': this.dtpFormatService.convert(dtFRM),
         'delTime': obj.delTime,
         'delStatus': obj.delStatus,
         'reason': obj.reason,
         'delSign': obj.delSign,
        });
      } else {
        this.arrayobj = _.reject(this.arrayobj, (ele) => { 
          return ele.cnNo == row.cnNO;
        });
      }
    } else {
      this.openSnackBar('Only five consignment allowed in this method','');
    }
     
  }
 save() { //Save function
    this.agentService.addPOD(this.arrayobj).subscribe( res => {
      if (res.status == 200) {
        this.openSnackBar(res.msg , 'Success');
        this.router.navigateByUrl('/podManifest');
      }
    });
  }

updateFilter(event){  //Filter function
  const val = event.target.value.toLocaleLowerCase();
  let temp1: any[] = this.temp.filter(function (d) {
    return (d.cnNO.toLowerCase().indexOf(val) !== -1 || !val);
  });
   this.singlePODList = temp1;
}

back() { //Cancel function
  if (this.podFormSingle.dirty) {
    const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.podFormSingle.reset();
      }
    }, err => { throw err; });
  }
  else{
    this.podFormSingle.reset();
  }
} 

openSnackBar(message, action) {
  if (action == 'Success') {
    this.snackBar.open(message, '',{ duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-green'] });
  } else {
    this.snackBar.open(message, '',{ duration: 2000, verticalPosition: 'top', horizontalPosition: 'center', panelClass: ['background-red'] });
  } 
}
        
   
}
