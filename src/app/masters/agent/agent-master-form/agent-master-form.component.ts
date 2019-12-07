import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AgentMaster } from '../agent';
import { AgentService } from '../../../services/Master/agentService/agent.service';
import { CustomValidators } from '../../../shared/customValidators';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-agent-master-form',
  templateUrl: './agent-master-form.component.html',
  styleUrls: ['./agent-master-form.component.scss']
})
export class AgentMasterFormComponent implements OnInit {

  agentForm: FormGroup;
  agent: AgentMaster = new AgentMaster();
  agentInfo: any[];

  constructor(private agentService: AgentService,
    private globals: Globals,
    private router: Router,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.agentForm = fb.group({
      'id': '',
      'agentCode': [null, Validators.compose([CustomValidators.stringLength(0, 10), Validators.required, CustomValidators.nospaceValidator()])],
      'agentName': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator(), Validators.maxLength(150)])],
      'agentWebsite': [null],
    });
    console.log(this.agentForm);
  }

  get f() {
    //console.log(this.agentForm.controls);
    return this.agentForm.controls;
  }

  ngOnInit() {
    this.globals.role = 'Agent Master';
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.agentService.getAgentDetailById(id).then(res => {
        this.agent = res;
        this.agentForm.patchValue({
          agentName: this.agent.agentName,
          agentCode: this.agent.agentCode,
          agentWebsite: this.agent.agentWebsite,
          createdBy: this.agent.createdBy,
          updatedBy: this.agent.updatedBy
        });
      });
    }
  }

  fetchAllRecords(): void {
    this.agentService.getAgentDetails().then((res) => {
      this.agentInfo = res;
      this.agent = res;
      console.log(res);
    }, function (res) {
    });
  }

  onFormSubmit(agentForm): void {
    Object.assign({}, this.agent, this.agentForm.value);
    console.log(this.agentForm.value);
    this.agent.agentName = this.agentForm.value.agentName;
    this.agent.agentCode = this.agentForm.value.agentCode;
    this.agent.agentWebsite = this.agentForm.value.agentWebsite;
    this.agent.createdBy = this.authService.userName;
    this.agent.updatedBy = this.authService.userName;
    if (this.agent.id !== undefined && this.agent.id > 0) {
      this.agentService.updateAgentDetails(this.agent)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/agentMasterList');
            this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
    else {
      this.agentService.addAgentDetails(this.agent)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.router.navigateByUrl('/agentMasterList');
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
          }
        }, err => {
          this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
          throw err;
        });
    }
  }

  reset() {
    this.ngOnInit();
  }

  back() {
    if (this.agentForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/agentMasterList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/agentMasterList');
    }
  }

}
