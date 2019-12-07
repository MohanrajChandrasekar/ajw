import { Component, OnInit } from '@angular/core';
import { AgentMaster } from '../agent';
import { Router } from '@angular/router';
import { AgentService } from '../../../services/Master/agentService/agent.service';
import { Globals } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-agent-master-list',
  templateUrl: './agent-master-list.component.html',
  styleUrls: ['./agent-master-list.component.scss']
})
export class AgentMasterListComponent implements OnInit {

  temp = [];
  agent: AgentMaster = new AgentMaster();
  agentInfo: any[];

  constructor(private agentService: AgentService,
    private router: Router,
    private authService: AuthService,
    private globals: Globals,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) { }

  ngOnInit() {
    this.globals.role = "Agent Master";
    this.fetchAllRecords();
  }

  fetchAllRecords(): void {
    this.agentService.getAgentDetails().then((res) => {
      this.agentInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; });
  }

  btnClick = function () {
    this.router.navigateByUrl('/agentMasterForm');
  };

  save(): void {
    if (this.agent.id !== undefined && this.agent.id > 0) {
      this.agentService.updateAgentDetails(this.agent)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
    else {
      this.agentService.addAgentDetails(this.agent)
        .subscribe(res => {
          this.fetchAllRecords();
        },
        err => {
          throw err;
        });
    }
  }

  edit(id): void {
    this.router.navigate(['/agentMasterForm'], { queryParams: { id: id } });
  };

  delete(id): void {
    var agInfo = this.agentInfo.filter(agnt => agnt.id === id)
    if (agInfo && agInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          agInfo[0].updatedBy = this.authService.userName;
          this.agentService.deleteAgentDetail(agInfo[0]).subscribe(
            res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted successfully", "");
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
    let temp1: AgentMaster[] = this.temp.filter(function (d) {
      return (d.agentCode.toLowerCase().indexOf(val) !== -1 || !val) ||
       (d.agentWebsite.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.agentName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.agentInfo = temp1;
  }

  exportXlsx() {
    var data: any[] = [];
    var i =1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Agent Code": element.agentCode,
        "Agent Name": element.agentName,
        "Agent Website": element.agentWebsite,
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }
}
