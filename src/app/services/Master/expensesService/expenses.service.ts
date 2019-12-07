import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  public apiUrl = environment.apiUrl + '/master/expenses';

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




}







