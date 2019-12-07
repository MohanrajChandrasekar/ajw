import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Shipper} from '../../../masters/shipper/shipper';
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from '../../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: 'root'
})
export class ShipperService {
  public apiUrl = environment.apiUrl+'/master/shipper';

shipperInfo:Shipper[];

  constructor(private http: HttpClient) { }

  getShipperDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getShipperDetailById(id):any{
    return this.http.get<any>(this.apiUrl+ '/'+id).toPromise();
  }

  addShipperDetails(shipperInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', shipperInfo, httpOptions)
      .pipe(
        tap());
  }

  updateShipperDetails(shipperInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/update', shipperInfo, httpOptions)
      .pipe(
        tap());
  }
  deleteShipperDetail(shipperInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', shipperInfo, httpOptions)
      .pipe(
        tap());
  }

}
