import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
import { environment } from '../../../environments/environment';
import { Datewise, Branchwise, Chart3, DashboardDate } from '../../app-dashboard/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  dashboardDate: DashboardDate = new DashboardDate();
  datewise: Datewise = new Datewise();
  branchwise: Branchwise = new Branchwise();
  chart3: Chart3 = new Chart3();


  constructor(private http: HttpClient) { }


  public apiUrl = environment.apiUrl + '/dashboard';


  getDateWise(dashboardDate:any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/datewise', dashboardDate, httpOptions)
    .pipe(tap());
  }

  getBranchwise(dashboardDate: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/bydate', dashboardDate, httpOptions)
    .pipe(tap());
  }

  getChart3(dashboardDate: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/branchwise', dashboardDate, httpOptions)
    .pipe(tap());
  }

  getMawb(dashboardDate:any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/mawb', dashboardDate, httpOptions)
    .pipe(tap());
  }

  getOpeningClosingReport(dashboardDate:any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/openingClosingReport', dashboardDate, httpOptions)
    .pipe(tap());
  }

} 