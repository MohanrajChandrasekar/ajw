import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../admin/user/user';
import { NavService } from '../services/navListService/nav.service';
import { LoggerServiceService } from '../services/sharedServices/loggerService/logger-service.service';

const apiUrl = environment.apiUrl;
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const httpFormOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    _currentUser: User;
    redirectUrl: string;
    _userNavlist: any[] = [];

    constructor(private http: HttpClient,
                private navService: NavService,
                private loggerService: LoggerServiceService) { }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('currentUser');
    }

    userNavlist(): any[] {
        if (this._userNavlist && this._userNavlist.length > 0) {
            return this._userNavlist;
        } else {
            if (localStorage.getItem('navList')) {
                const json = JSON.parse(localStorage.getItem('navList'));
                this._userNavlist = json;
            }
        }
        return this._userNavlist;
    }

    currentUser(): User {
        if (this._currentUser) {
            return this._currentUser;
        } else {
            if (localStorage.getItem('currentUser')) {
                const json = JSON.parse(localStorage.getItem('currentUser'));
                this._currentUser = <User>json;
            }
        }
        return this._currentUser;
    }
    login(userName: string, password: string): Observable<User> {
        const body = 'loginId=' + userName + '&password=' + encodeURIComponent(password);
        const loginAPIUrl = environment.loginAPIURL;
        return this.http.post<User>(loginAPIUrl, body, httpFormOptions).pipe(
            tap(data => {
                this._currentUser = data;
                this.navService.getNavigationListByLoginId(this._currentUser.userName).then(res => {
                    this._userNavlist = res;
                    localStorage.setItem('navList', JSON.stringify(this._userNavlist));
                }, err => { throw err; } );

                localStorage.setItem('currentUser', JSON.stringify(this._currentUser));
            })
        );
    }

    getToken(): string {
        const user = this.currentUser();
        if (user) {
            return user.token;
        } else {
            return '';
        }
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('navList');
        this.loggerService.logOutLogger(this._currentUser).subscribe( res => {
            console.log(res);
        });
    }

    get userName(): string {
        const _user = this.currentUser();
        if (_user != undefined && _user != null) {
            return this.currentUser().userName;
        }
        return '';
    }

    get branchId(): number {
        const _user = this.currentUser();
        if (_user != undefined && _user != null) {
            return this.currentUser().branchId;
        }
        return 0;
    }

    get roleId(): any {
        const _user = this.currentUser();
        if (_user != undefined && _user != null) {
            return this.currentUser().roleId;
        }
        return 0;
    }

}
