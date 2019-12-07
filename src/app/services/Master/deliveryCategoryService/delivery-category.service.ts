import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeliveryCategory } from '../../../masters/deliveryCategory/deliveryCategory';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DeliveryCategoryService {

  deliveryCategoryInfo: DeliveryCategory[];

  public apiUrl = environment.apiUrl + '/master/deliveryCategory';


  constructor(private http: HttpClient) { }

  getDeliveryCategoryDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getDeliveryCategoryDetailsById(id): any {
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  addDeliveryCategoryDetails(deliveryCategoryInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', deliveryCategoryInfo, httpOptions)
      .pipe(
        tap());
  }

  updateDeliveryCategoryDetails(deliveryCategoryInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", deliveryCategoryInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  deleteDeliveryCategoryDetails(deliveryCategoryInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", deliveryCategoryInfo, httpOptions)
      .pipe(
        tap()
      );
  }
}
