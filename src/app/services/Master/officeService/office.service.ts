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
export class OfficeService {
  public apiUrl = environment.apiUrl + '/master/office';

  officeInfo: any = [];


  constructor(private http: HttpClient) { }

  getOfficeDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }

  getOfficeTypes(): any {
    return this.http.post<any>(this.apiUrl + '/type', httpOptions).pipe(tap());
  }

  getOfficeDetailsByType(type): any {
    return this.http.get<any>(this.apiUrl + '/types/' + type, httpOptions).toPromise();
  }

  getOfficeDetailById(id): any {
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  addOfficeDetails(officeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/Insert', officeInfo, httpOptions)
      .pipe(
        tap());
  }

  updateOfficeDetails(officeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/update', officeInfo, httpOptions)
      .pipe(
        tap());
  }
  deleteOfficeDetail(officeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', officeInfo, httpOptions)
      .pipe(
        tap());
  }






}
