import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: 'root'
})
export class MisroutedServicesService {

  public apiUrl = environment.apiUrl+'/transaction/misrouted';
  constructor(private http: HttpClient) { }

  getMisroutedShipments(): any{
    return this.http.get<any>(this.apiUrl).toPromise();
  }

  getMisroutedShipmentByID(id): any{
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  addMisroutedShipment(shipment: any):  Observable<any>{
    return this.http.post<any>(this.apiUrl + '/insert' , shipment, httpOptions)
    .pipe(tap());
  }

  updateMisroutedShipment(shipment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/edit', shipment, httpOptions)
    .pipe(tap());
  }

  deleteMisroutedShipment(shipment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', shipment, httpOptions)
    .pipe(tap());
  }

  reportMisroutedShipment(shipment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/report', shipment, httpOptions)
    .pipe(tap());
  }
}
