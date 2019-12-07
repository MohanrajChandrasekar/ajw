import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({'Content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class FailedCnnoHandlingService {
  public apiUrl = environment.apiUrl + '/transaction/failedCnnoHandling';

  constructor(private http: HttpClient) { }

  getFailedCnnoData(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/' , info, httpOptions)
    .pipe(tap());
  }

  getAllData(): any {
    return this.http.get<any>(this.apiUrl + '/all').toPromise();
  }

  updateAddress(info: any): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/update', info, httpOptions)
    .pipe(tap());
  }

  updateRebooking(info:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + '/rebooking', info, httpOptions)
    .pipe(tap());
  }

  getRebookingList(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/getRebookingList', info, httpOptions).pipe(tap());
  }

  addRebooking(info:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + '/addRebooking', info, httpOptions)
    .pipe(tap());
  }

  getVendorRateByWt(info:any):Observable<any>{
    return this.http.post<any>(this.apiUrl + '/getVendorRate', info, httpOptions)
    .pipe(tap());
  }

  checkCNNOResendStatus(cnno): any{
    return this.http.get<any>(this.apiUrl + '/getCNNOResendStatus/' + cnno).toPromise();
  }
}
