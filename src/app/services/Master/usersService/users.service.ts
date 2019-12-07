import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../../../environments/environment';

import { User } from '../../../admin/user/user';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  userInfo: User[];

  public apiUrl = environment.apiUrl + '/master/user';
  public apiUrl2 = environment.apiUrl + '/usersRole';


  constructor(private http: HttpClient) { }

  getUsers(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getUserByLoginName(id): any {
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }
  updateUserDetail(userInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", userInfo, httpOptions)
      .pipe(
        tap()
      );
  }
  addUser(userInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', userInfo, httpOptions)
      .pipe(
        tap());
  }

  getUserById(id): any {
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  updateUserLock(userInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/updateLock", userInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  resetPassword(userInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/resetPassword", userInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  deleteUser(userInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", userInfo, httpOptions)
      .pipe(
        tap()
      );
  }


  userLogin(loginId: string, password: string): Observable<any> {
    // return this.http.post<any>(this.apiUrl + '/login',
    // {
    //   email: email,
    //   password: password
    // });

    let loginDetails = {
      loginId: loginId,
      password: password
    }

    return this.http.post(this.apiUrl + '/login', loginDetails)
      .map((res) => {
        // if (res.statusBool) {
        //   // return res.json();
        // } else {
        //   return "Error";
        // }
        return res;
      }).catch((err) => {
        return Observable.throw(err.error.message);
      });




  }
  //   resetPassword(resetPasswordData: any): Observable<any> {
  //     return this.http.post<any>(this.apiUrl + "/ResetPassword", resetPasswordData, httpOptions)
  //         .pipe(
  //             tap()
  //         );
  // }
  updatePassword(passwordData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/updatepassword", passwordData, httpOptions)
      .pipe(
        tap()
      );
  }



  getUserRole(loginId): any {
    return this.http.get<any>(this.apiUrl + '/byLoginId/' + loginId).toPromise();
  }

}