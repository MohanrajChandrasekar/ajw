import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  public apiUrl = environment.apiUrl + '/master/doc';
  private behave = new BehaviorSubject<Object>({});

  constructor(private http: HttpClient) { }

  getVendorReports(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/vendorBreakup', info, httpOptions)
      .pipe(tap());
  }

  getDeliveryBreakup(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/deliveryBreakup', info, httpOptions)
      .pipe(tap());
  }

  getDeliveryBreakupByRuns(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/vendorBreakupByRuns', info, httpOptions)
      .pipe(tap());
  }

  getStationArrivalPDFByRuns(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/stationReportByRun', info, httpOptions)
      .pipe(tap());
  }

  getBillExpenseReportByMAWB(info: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/expenseBillReport', info, httpOptions)
      .pipe(tap());
  }

  getBoxReportByHAWB(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getBoxReport', info, httpOptions).pipe(tap());
  }

  setBehaviorView(behave: Object) {
    this.behave.next(behave);
  }

  getBehaviorView(): Observable<any> {
    return this.behave.asObservable();
  }
}
