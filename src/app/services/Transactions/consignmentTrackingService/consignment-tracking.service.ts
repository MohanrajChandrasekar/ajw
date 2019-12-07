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
export class ConsignmentTrackingService {
  public apiUrl = environment.apiUrl + '/transaction/tracking';

  constructor(private http: HttpClient) { }

  getConsignmentTrackingbyCnno(cnno): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/' + cnno).pipe(tap());
  }

  trackByDates(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getTrackedList', info, httpOptions).pipe(tap());
  }

  trackProductionByUsers(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getUserProduction', info, httpOptions).pipe(tap());
  }

  coloaderReports(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getColoaderReport', info, httpOptions).pipe(tap());
  }

  postalTariff(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getPostalTariff', info, httpOptions).pipe(tap());
  }

  getColoaderBreakup(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getColoaderByID', info, httpOptions).pipe(tap());
  }

}