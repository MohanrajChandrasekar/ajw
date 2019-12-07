import { Component, OnInit } from '@angular/core';
import { RouterState, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { Globals } from '../global';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    errorMessage: string;

    loginForm: FormGroup

    submitted: boolean = false;

    constructor(private authService: AuthService,
        private fb: FormBuilder, private globals: Globals,
        private router: Router) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            loginId: new FormControl('', Validators.required),
            password: new FormControl('', Validators.compose([
                Validators.required,
            ]))
        });
        
           
       // this.authService.isLoggedIn()===true;
        this.router.navigate(['/AppDashboard']);
        
    }

    // cancel(): void {
    //     this.router.navigate(['']);
    // }

    get f() { return this.loginForm.controls; }

    login(): void {
        this.submitted = true;
        try {
            let loginForm = this.loginForm.value;
            if (loginForm && this.loginForm.valid && loginForm.loginId && loginForm.password) {
                
                const loginId = loginForm.loginId;
                const password = loginForm.password;
                
                this.authService.login(loginId, password)
                    .subscribe((response) => {
                        let user = response;
                        this.globals.loginID = loginId;
                        if (user) {
                            // localStorage.setItem('currentUser', JSON.stringify(user));
                            // if (this.authService.redirectUrl) {
                            //     this.router.navigateByUrl(this.authService.redirectUrl);
                            // } else {
                                this.router.navigate(['/AppDashboard']);
                                
                            //}
                        }
                    }, err => {
                        
                        this.errorMessage = err.error.message;
                    });
            } else {
                this.errorMessage = 'Please enter a user name and password.';
            }
        }
        catch (err) {
        }
    }

}
