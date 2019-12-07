import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { City} from '../../../masters/ajw_city/City';
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CityService {
  public apiUrl = environment.apiUrl + '/master/city';


cityInfo: City[];


  constructor(private http: HttpClient) { }

  getCityDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  
  getCityDetailById(id):any{
    return this.http.get<any>(this.apiUrl+ '/'+id).toPromise();
  }

  addCityDetails(cityInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', cityInfo, httpOptions)
      .pipe(
        tap());
  }

  updateCityDetails(cityInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/update', cityInfo, httpOptions)
      .pipe(
        tap());
  }
  deleteCityDetail(cityInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', cityInfo, httpOptions)
      .pipe(
        tap());
  }


 
  }







