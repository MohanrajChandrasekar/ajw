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
export class ModeService {
  public apiUrl = environment.apiUrl + '/master/mode';

  constructor(private http: HttpClient) { }

  getModeDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getModeDetailById(id): any {
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  addModeDetails(modeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', modeInfo, httpOptions)
      .pipe(
        tap());
  }

  updateModeDetails(modeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/update', modeInfo, httpOptions)
      .pipe(
        tap());
  }
  deleteModeDetail(modeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', modeInfo, httpOptions)
      .pipe(
        tap());
  }



}







