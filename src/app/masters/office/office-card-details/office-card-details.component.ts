import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { OfficeService } from '../../../services/Master/officeService/office.service';
import { Office } from '../office';
import {OfficeListComponent} from '../../office/office-list/office-list.component';

@Component({
  selector: 'app-office-card-details',
  templateUrl: './office-card-details.component.html',
  styleUrls: ['./office-card-details.component.scss']
})
export class OfficeCardDetailsComponent implements OnInit {

  @ViewChild('OfficeListComponent') cardDetails: Number;


  office: Office = new Office();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Office, private officeService: OfficeService ) { 

  }

  ngOnInit() {
  
  }


  ngAfterViewInit(){
 
    this.office = this.data;
  }

}
