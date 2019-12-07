import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../user';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/Master/usersService/users.service';
import { Globals } from '../../../global';
import { XlsxService } from '../../../services/sharedServices/xlsxService/xlsx.service';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { Role } from '../../role/role'
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild('myTable') table: any;
  constructor(private usersService: UsersService,
    private router: Router,
    private globals: Globals,
    private authService: AuthService,
    private xlsxService: XlsxService,
    private openDialogBoxService: OpenDialogBoxService) { }

  userInfo: any = [];
  user: User = new User();
  role: Role = new Role();
  temp = [];
  isLocked: boolean = false;

  ngOnInit() {
    this.globals.role = "Users";
    this.fetchAllRecords();
  }

  btnClick = function () {
    this.router.navigateByUrl('/userForm');
  };

  fetchAllRecords(): void {
    this.usersService.getUsers().then((res) => {
      this.userInfo = res;
      this.temp = res;
      console.log(res);
    }, err => { throw err; }
    );
  }

  edit(id): void {
    this.router.navigate(['/userForm'], { queryParams: { id: id } });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    let temp1: User[] = this.temp.filter(function (d) {
      return (d.userName.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.loginId.toLowerCase().indexOf(val) !== -1 || !val) ||
        (d.userEmail.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.userInfo = temp1;
  }

  delete(id): void {
    var useInfo = this.userInfo.filter(ur => ur.id === id)
    if (useInfo && useInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to delete?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.usersService.deleteUser(useInfo[0]).subscribe( res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Deleted successfully", "");
            }, err => { throw err; });
        }
      }, err => { throw err; });
    }
  }

  resetPassword(id): void {
    var useInfo = this.userInfo.filter(ur => ur.id === id)
    if (useInfo && useInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to reset password?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.usersService.resetPassword(useInfo[0]).subscribe(res => {
              this.fetchAllRecords();
              this.openDialogBoxService.openSnackBar("Password reseted successfully", "");
            },err => {throw err;});
        }
      },err => {throw err;});
    }
  }

  updateLock(id): void {
    var useInfo = this.userInfo.filter(ur => ur.id === id)
    if (useInfo && useInfo.length > 0) {
      const dialogRef = this.openDialogBoxService.openDialog("Are you sure want to update Lock?");
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          if (useInfo[0].isLocked == false) {
            useInfo[0].isLocked = true;
            this.usersService.updateUserLock(useInfo[0]).subscribe(res => {
                this.fetchAllRecords();
                this.openDialogBoxService.openSnackBar("Updated User Lock successfully", "");
              }, err => { throw err; });
          } else {
            useInfo[0].isLocked = false;
            this.usersService.updateUserLock(useInfo[0]).subscribe(res => {
                this.fetchAllRecords();
                this.openDialogBoxService.openSnackBar("Updated User Lock successfully", "");
              }, err => { throw err; });
          }
        }
      }, err => { throw err; });
    }
  }

  exportXlsx() {
    var data: any[] = [];
    var i = 1;
    this.temp.forEach(element => {
      var val = {
        "": i,
        "Login Id": element.loginId,
        "User Name": element.userName,
        "Email Address": element.userEmail,
        "Role": element.roles,
        "Branch Name": element.branchName,
        "Last Login": element.latestLoginTime,
        "Locked": element.isLocked,
      }
      data.push(val);
      i = i + 1;
    });
    this.xlsxService.saveAsExcelFile(data, this.globals.role);
  }



}


