import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Email} from '../../../masters/email/email';
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  public apiUrl = environment.apiUrl + '/master/email';

  emailInfo:Email[];

  constructor(private http: HttpClient) { }

  getEmailDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getEmailDetailById(id):any{
    return this.http.get<any>(this.apiUrl+ '/'+id).toPromise();
  }

  addEmailDetails(emailInfo: any): Observable<any> {
    // console.log(this.emailInfo);
    return this.http.post<any>(this.apiUrl + '/insert', emailInfo, httpOptions)
      .pipe(
        tap());
  }

  updateEmailDetails(emailInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/update', emailInfo, httpOptions)
      .pipe(
        tap());
  }
  deleteEmailDetail(emailInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', emailInfo, httpOptions)
      .pipe(
        tap());
  }


}
