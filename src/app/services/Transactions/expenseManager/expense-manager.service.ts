import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ExpenseManagerService {

  public apiUrl = environment.apiUrl + '/transaction/expenses';

  constructor(private http: HttpClient) { }

  getExpenseDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }

  getExpenseDetailById(id): any {
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  addExpenseDetails(enpenseInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', enpenseInfo, httpOptions)
      .pipe(
        tap());
  }

  updateExpenseDetails(enpenseInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/update', enpenseInfo, httpOptions)
      .pipe(
        tap());
  }
  deleteExpenseDetail(enpenseInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', enpenseInfo, httpOptions)
      .pipe(
        tap());
  }

  checkMawbno(id): any {
    return this.http.get<any>(this.apiUrl + '/check/' + id).toPromise();
  }

  vendorwise(enpenseInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/vendorwise', enpenseInfo, httpOptions)
      .pipe(
        tap());
  }

  coloaderwise(enpenseInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/coloaderwise', enpenseInfo, httpOptions)
      .pipe(
        tap());
  }

  getManifestWtByMAWB(mawbNo): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/manifestWeight/' + mawbNo).pipe(tap());
  }

  getExpenseBillReportByMAWB(mawbNo): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/expenseBillReport/' + mawbNo).pipe(tap());
  }
}







