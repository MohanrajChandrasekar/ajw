import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Zone} from '../../../masters/zone/zone';
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  public apiUrl = environment.apiUrl+'/master/zone';

zoneInfo: Zone[];


  constructor(private http: HttpClient) { }

  getZoneDetails(): any {
    
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getZoneDetailById(id):any{
    return this.http.get<any>(this.apiUrl+ '/'+id).toPromise();
  }

  addZoneDetails(zoneInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', zoneInfo, httpOptions)
      .pipe(
        tap());
  }

  updateZoneDetails(zoneInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/update', zoneInfo, httpOptions)
      .pipe(
        tap());
  }
  deleteZoneDetail(zoneInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete',zoneInfo, httpOptions)
      .pipe(
        tap());
  }


 
  }







