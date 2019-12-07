import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
import { environment } from '../../../../environments/environment';
import { Currency } from '../../../masters/currency/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyServiceService {
  
  public apiUrl = environment.apiUrl+ '/master/currency';
  
  constructor(private http: HttpClient) { }

  currencyInfo: Currency[];

  getCurrencyDetails(): any{
    return this.http.get<any>(this.apiUrl).toPromise();
  }

  getCurrencyDetailByID(id): any{
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  updateCurrencyDetails(currencyInfo: any):Observable<any>{
    return this.http.post<any>(this.apiUrl + '/update', currencyInfo, httpOptions).pipe(tap());
  }

  addCurrencyDetails(currencyInfo: any):Observable<any>{
    return this.http.post<any>(this.apiUrl + '/insert', currencyInfo, httpOptions).pipe(tap());
  }

  removeCurrencyDetails(currencyInfo: any):Observable<any>{
    return this.http.post<any>(this.apiUrl + '/delete', currencyInfo, httpOptions).pipe(tap());
  }

}
