import { Component, OnInit } from '@angular/core';
import { Globals, TextConstants } from '../../../global';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { UsersService } from '../../../services/Master/usersService/users.service';
import { RoleService } from '../../../services/Master/roleservice/role.service';
import { CustomValidators } from '../../../shared/customValidators';
import { OpenDialogBoxService } from '../../../services/sharedServices/openDialogBoxService/open-dialog-box.service';
import { NgOption } from '@ng-select/ng-select';
import { AuthService } from '../../../login/auth.service';
import { OfficeService } from '../../../services/Master/officeService/office.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(frmCtrlName: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(frmCtrlName && frmCtrlName.invalid && (frmCtrlName.dirty || frmCtrlName.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {

    userForm: FormGroup;
    //passwordForm: FormGroup;
    userInfo: any = [];
    user: User = new User();
    assignedRoles: any = [];
    userRoleInfo: any = [];
    roles: NgOption[];
    office: any[];

    constructor(private usersService: UsersService,
        private rolesService: RoleService,
        private officeService: OfficeService,
        private _route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private globals: Globals,
        private openDialogBoxService: OpenDialogBoxService) {
        this.userForm = fb.group({
            'id': '',
            'userName': [null, Validators.compose([Validators.required, Validators.maxLength(150), CustomValidators.nospaceValidator()])],
            'loginId': [null, Validators.compose([Validators.required, Validators.maxLength(150), CustomValidators.nospaceValidator()])],
            'userEmail': [null, Validators.compose([Validators.required, Validators.email])],
            'selectedRoles': [null, Validators.required],
            'branchId': [null, Validators.required]
        });
    }

    ngOnInit() {
        this.globals.role = "Users";
        console.log(this._route.snapshot.queryParams.id);
        this.rolesService.getRoles().then(res => {
            this.roles = res;
        }, err => { throw err; })
        this.officeService.getOfficeDetails().then(res => {
            this.office = res;
        }, err => { throw err; })
        if (this._route.snapshot.queryParams.id) {
            let id: number = this._route.snapshot.queryParams.id
            this.usersService.getUserById(id).then(res => {
                this.user = res;

                this.fetchUserRole(this.user.loginId).then(res => {
                    this.assignedRoles = res;
                    let sRoles = [];
                    this.assignedRoles.forEach(element => {
                        sRoles.push(element.id);
                    });
                    this.user.selectedRoles = sRoles;
                    this.userForm.patchValue({
                        loginId: this.user.loginId,
                        userName: this.user.userName,
                        userEmail: this.user.userEmail,
                        branchId: this.user.branchId,
                        selectedRoles: this.user.selectedRoles,
                        createdBy: this.user.createdBy,
                        updatedBy: this.user.updatedBy
                    });
                }, err => { throw err; });
            }, err => { throw err; });
        }
    }

    fetchAllRecords(): void {
        this.usersService.getUsers().then((res) => {
            this.userInfo = res;
            this.user = res;
            console.log(res);
        }, err => { throw err; });
    }

    get f() {
        return this.userForm.controls;
    }

    save(): void {
        Object.assign({}, this.user, this.userForm.value);
        console.log(this.userForm.value);
        this.user.loginId = this.userForm.value.loginId;
        this.user.userName = this.userForm.value.userName;
        this.user.branchId = this.userForm.value.branchId;
        this.user.userEmail = this.userForm.value.userEmail;
        this.user.createdBy = this.authService.userName;
        this.user.updatedBy = this.authService.userName;
        this.user.selectedRoles = this.userForm.value.selectedRoles;
        if (this.user && this.user.id !== undefined && this.user.id > 0) {
            this.usersService.updateUserDetail(this.user)
                .subscribe(res => {
                    this.openDialogBoxService.openSnackBar(TextConstants.editSuccess, "");
                    this.router.navigateByUrl('/userList');
                }, err => {
                    this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
                    throw err;
                });
        }
        else {

            this.usersService.addUser(this.user)
                .subscribe(res => {
                    if (res.statusBool == -1) {
                        this.openDialogBoxService.openSnackBar(res.statusText, "error");
                    }
                    else {
                        this.openDialogBoxService.openSnackBar(TextConstants.saveSuccess, "");
                        this.router.navigateByUrl('/userList');
                    }
                }, err => {
                    this.openDialogBoxService.openSnackBar(TextConstants.errorHandle, "error");
                    throw err;
                });
        }
    }

    back() {
        if (this.userForm.dirty) {
            const dialogRef = this.openDialogBoxService.openDialogCancel("You may lost the data?");
            dialogRef.afterClosed().subscribe(res => {
                if (res == true) {
                    this.router.navigateByUrl('/userList');
                }
            }, err => { throw err; });
        }
        else {
            this.router.navigateByUrl('/userList');
        }
    }

    reset() {
        this.ngOnInit();
    }

    fetchUserRole(loginId) {
        return this.usersService.getUserRole(loginId)
    }


}



