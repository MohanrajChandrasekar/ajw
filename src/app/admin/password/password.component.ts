import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoleService } from '../../services/Master/roleservice/role.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CustomValidators } from '../../shared/customValidators';
import { UsersService } from '../../services/Master/usersService/users.service';
import { User } from '../user/user';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  passwordChangeForm: FormGroup;
  loginId: string;
  submitted: boolean = false;
  user:User=new User();
  userInfo: any = [];
  id:number;
 
  constructor(private usersService: UsersService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PasswordComponent>,
    @Inject(MAT_DIALOG_DATA) data, private snackBar: MatSnackBar) {
    this.loginId = data.loginId;
  }


  ngOnInit() {
    this.passwordChangeForm = this.fb.group({
      'oldPassword': [null, Validators.compose([Validators.required])],
      'newPassword': [null, Validators.compose([Validators.required, CustomValidators.passwordValidator])],
      'confirmPassword': [null, Validators.compose([Validators.required, CustomValidators.passwordValidator])]
    }, { validator: CustomValidators.passwordMatcher });

  }


  get f() {
    return this.passwordChangeForm.controls;
  }
  closeDialog() {
    this.dialogRef.close();
  }



  changePassword() {
    this.submitted = true;
    let loginId: string = this.loginId;
    console.log(loginId);
   // console.log(id);
    let oldPassword: string = this.passwordChangeForm.value.oldPassword;
    let newPassword: string = this.passwordChangeForm.value.newPassword;
    var passwordData = {
      loginId: loginId,
      oldPassword: oldPassword,
      newPassword: newPassword

    }
    console.log(passwordData);
    this.usersService.updatePassword(passwordData)
      .subscribe(res => {
        if (res == false) {
          this.openSnackBar("Old Password does not match", "")
          this.dialogRef.close();
        }
        else {
          this.openSnackBar("Password changed sucessfully", "")
          this.dialogRef.close();
        }
      },
      err => {
        throw err;
      });
  }

  openSnackBar(message: string, action: string) {
    if (action == "") {
      this.snackBar.open(message, action, {
        duration: 2000,
        panelClass: ['background-green']
      });
    } else {
      this.snackBar.open(message, action, {
        duration: 2000,
        panelClass: ['background-red']
      });
    }
  }

}

