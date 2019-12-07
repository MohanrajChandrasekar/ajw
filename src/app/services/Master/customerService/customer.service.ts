import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Customer } from '../../../masters/customer/customer';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerInfo: Customer[];

  public apiUrl = environment.apiUrl + '/master/customer';


  constructor(private http: HttpClient) { }

  getCustomerDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }

  getCustomerDetailsByType(type): any {
    return this.http.get<any>(this.apiUrl + '/list/' + type).toPromise();
  }

  getCustomerTypes(): any {
    return this.http.post<any>(this.apiUrl + '/types', httpOptions).pipe(tap());
  }

  getCustomerDetailsById(Id): any {
    return this.http.get<any>(this.apiUrl + '/' + Id).toPromise();
  }

  addCustomerDetails(customerInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/create', customerInfo, httpOptions)
      .pipe(
        tap());
  }

  updateCustomerDetails(customerInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", customerInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  deleteCustomerDetails(customerInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/remove", customerInfo, httpOptions)
      .pipe(
        tap()
      );
  }
}
