import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Globals } from '../../../global';
import { AgentDeliveryService } from '../../../services/Transactions/agentDeliveryService/agent-delivery.service';

@Component({
  selector: 'app-pod-details-view',
  templateUrl: './pod-details-view.component.html',
  styleUrls: ['./pod-details-view.component.scss']
})
export class PodDetailsViewComponent implements OnInit {

  podViewForm: FormGroup;
  podDetails: any;
  temp: any;

  constructor(private fb: FormBuilder,
              private globals: Globals,
              private _route: ActivatedRoute,
              private agentDelvService: AgentDeliveryService) {
                this.podViewForm = this.fb.group({
                  seaecher: null
                });
              }

  ngOnInit() {
    this.globals.role = 'Pod Details View';
    if (this._route.snapshot.queryParams.podUploadRefID) {
      this.getFormData(this._route.snapshot.queryParams.podUploadRefID);
    }
  }

  getFormData(podUploadRefID) {
    const obj = { podUploadRefID: podUploadRefID };
    this.agentDelvService.getListOfPODsDetailedView(obj).subscribe(res => {
      if (res.status == 200) {
        this.podDetails = res.queryResults;
        this.temp = res.queryResults;
        console.log(this.podDetails);
      }
    });
  }

  updateFilter(event) {      // Filter Function
    const val = event.target.value.toLocaleLowerCase();
    let temp1: any[] = this.temp.filter(function (d) {
        return (d.cnNO.toLowerCase().indexOf(val) !== -1 || !val);// ||
      });
    this.podDetails = temp1;
  }

}
