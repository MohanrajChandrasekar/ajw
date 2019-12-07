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
export class DocumentMagazineService {
  public apiUrl = environment.apiUrl + '/master';


  constructor(private http: HttpClient) { }

  getDocumentDetails(): any {
    return this.http.get<any>(this.apiUrl + '/document/document').toPromise();
  }

  getDocumentMagazineById(id): any {
    return this.http.get<any>(this.apiUrl + '/document/' + id).toPromise();
  }

  addDocumentMagazineDetail(info: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/document/insert', info, httpOptions)
      .pipe(
        tap());
  }

  updateDocumentMagazineDetail(info: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/document/update', info, httpOptions)
      .pipe(
        tap());
  }
  deleteDocumentMagazineDetail(info: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/document/delete', info, httpOptions)
      .pipe(
        tap());
  }

  getMagazineDetails(): any {
    return this.http.get<any>(this.apiUrl + '/magazine/magazine').toPromise();
  }

  getMagazineById(id): any {
    return this.http.get<any>(this.apiUrl + '/magazine/' + id).toPromise();
  }

  addMagazineDetail(info: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/magazine/insert', info, httpOptions)
      .pipe(
        tap());
  }

  updateMagazineDetail(info: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/magazine/update', info, httpOptions)
      .pipe(
        tap());
  }
  deleteMagazineDetail(info: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/magazine/delete', info, httpOptions)
      .pipe(
        tap());
  }



}







