import { Component, OnInit } from '@angular/core';
import { Role } from '../role';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators } from '../../../shared/customValidators';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../../services/Master/roleservice/role.service';
import { Globals, TextConstants } from '../../../global';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { AuthService } from '../../../login/auth.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})

export class RoleFormComponent implements OnInit {

  roleForm: FormGroup;
  roleInfo: any = [];
  role: Role = new Role();

  constructor(private roleService: RoleService,
    private fb: FormBuilder,
    private router: Router,
    private globals: Globals,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private openDialogBoxService: OpenDialogBoxService) {
    this.roleForm = this.fb.group({
      'id': '',
      'roleName': [null, Validators.compose([Validators.required, CustomValidators.nospaceValidator()])],
      'roleDescription': [null, Validators.compose([CustomValidators.nospaceValidator()])]
    });
  }

  ngOnInit() {
    this.globals.role = "Roles";
    console.log(this._route.snapshot.queryParams.id);
    if (this._route.snapshot.queryParams.id) {
      let id: number = this._route.snapshot.queryParams.id
      this.roleService.getRoleById(id).then(res => {
        this.role = res;
        this.roleForm.patchValue({
          roleName: this.role.roleName,
          roleDescription: this.role.roleDescription,
          createdBy: this.role.createdBy,
          updatedBy: this.role.updatedBy
        });
      }, err => { throw err; });
    }
  }

  fetchAllRecords(): void {
    this.roleService.getRoles().then((res) => {
      this.roleInfo = res;
      this.role = res;
      console.log(res);
    }, err => { throw err; });
  }

  get f() {
    return this.roleForm.controls;
  }

  save(): void {
    Object.assign({}, this.role, this.roleForm.value);
    console.log(this.roleForm.value);
    this.role.roleName = this.roleForm.value.roleName;
    this.role.roleDescription = this.roleForm.value.roleDescription;
    this.role.createdBy = this.authService.userName;
    this.role.updatedBy = this.authService.userName;
    if (this.role && this.role.id !== undefined && this.role.id > 0) {
      this.roleService.updateRole(this.role)
        .subscribe(res => {
          this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
          this.router.navigateByUrl('/RoleList');
        }, err => {

          throw err;
        });
    }
    else {

      this.roleService.addRole(this.role)
        .subscribe(res => {
          if (res.statusBool == -1) {
            this.openDialogBoxService.openSnackBar(res.statusText, "error");
          }
          else {
            this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
            this.router.navigateByUrl('/RoleList');
          }
        },
          err => {
            this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
            throw err;
          });
    }
  }

  back() {
    if (this.roleForm.dirty) {
      const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.router.navigateByUrl('/RoleList');
        }
      }, err => { throw err; });
    }
    else {
      this.router.navigateByUrl('/RoleList');
    }
  }

  reset() {
    this.ngOnInit();
  }



}

