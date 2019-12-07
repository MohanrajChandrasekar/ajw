import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleService } from '../../../services/Master/roleservice/role.service';
import { Router } from '@angular/router';
import { Role } from '../role';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})

export class RoleListComponent implements OnInit {
  @ViewChild('myTable') table: any;
  constructor(private roleService: RoleService,
    private xlsxService: XlsxService,
    private router: Router,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService,
    private globals: Globals) { }

  roleInfo: any = [];
  role: Role = new Role();
  temp = [];

  ngOnInit() {
    this.fetchAllRecords();
    this.globals.role = "Roles";
  }

  btnClick = function () {
    this.router.navigateByUrl('/RoleForm');
  };

  fetchAllRecords(): void {
    this.roleService.getRoles().then((res) => {
      this.roleInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; }
    );
  }

  edit(id): void {
    console.log(id);
    this.router.navigate(['/RoleForm'], { queryParams: { id: id } });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: Role[] = this.temp.filter(function (d) {
      return (d.roleName.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.roleDescription.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.roleInfo = temp1;
  }

  addRole() {
    this.router.navigateByUrl('RoleForm');
  }

  delete(id): void {
    var rolInfo = this.roleInfo.filter(cty => cty.id === id)
    if (rolInfo && rolInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.roleService.deleteRole(rolInfo[0]).subscribe(
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

  exportXlsx() {
    var data: any[] = [];
    var i =1;
    this.temp.forEach(element => {
      var val = {
        "":i,
        "Role Name": element.roleName,
        "Role Decription": element.roleDescription
      }
      data.push(val);
      i=i+1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role)
  }

}
