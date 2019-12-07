import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Office } from '../../../masters/office/office';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'application/pdf'}),
};

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class pdfDocService {
  
  public apiUrl =environment.apiUrl + '/master/doc';

  constructor(private http: HttpClient) { }

  officeReportPDF(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/office', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }

  outgoingReportPDF(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/outgoing', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }

  agentReportPDF(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/agent', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }

  detailedBookingReportPDF(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/detailedBooking', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }

  trackingReportPDF(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/tracking', Info, {observe: 'response', responseType: 'blob' as 'json'});
    return res;
  }

  MawNo(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/MawNo', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }

  MawNoGroupedReport(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/MawNoGroupedReport', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }
  
  specialCustomerDetailedBookingReportPDF(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/specialCustomerDetailedBooking', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }

  vendorwise(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/vendorwise', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }

  coloaderwise(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/coloaderwise', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }

  weightBreakup(Info: any): Observable<any> {
    var res = this.http.post(this.apiUrl + '/weightBreakup', Info, {observe: 'response', responseType: 'blob' as 'json'});
    console.log(res);
    return res;
  }

  stationArrival(Info: any): Observable<any> {
    var res = this.http.post<any>(this.apiUrl + '/stationReportByRun', Info).pipe(tap());
    console.log(res);
    return res;
  }

}
