import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from "rxjs";
import { tap, retry } from 'rxjs/operators'
import { id } from '@swimlane/ngx-datatable/release/utils';
import { debug } from 'util';

const httpOptions = {
  headers: new HttpHeaders({'Content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class SpecialBookingsService {

  public apiUrl = environment.apiUrl + '/transaction/specialbooking';

  constructor(private http: HttpClient) { }
 
  getSpecialBookingInfo(id): any{
    return this.http.get<any>(this.apiUrl + '/' + id, httpOptions).toPromise();
  }
  
  getCNNObyID(id): any{
    return this.http.get<any>(this.apiUrl + '/cnno/' + id, httpOptions).toPromise();
  }

  getSpecialBookingDetails(id): any{
    return this.http.get<any>(this.apiUrl + '/specialDetails/' + id, httpOptions).toPromise();
  }

  getSpecialBookHawnList(secRunno): any{
    return this.http.get<any>(this.apiUrl + '/hawnList/' + secRunno, httpOptions).toPromise();
  }

  getSpecialBookedDetailByDetailID(id): any{
    return this.http.get<any>(this.apiUrl + '/detailsByID/' + id, httpOptions).toPromise();
  }

  addSpecialBookings(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/insert', info, httpOptions)
      .pipe(tap());
  }

  addSpecialDetailedBook(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/detailInsert', info, httpOptions)
    .pipe(tap());
  }

  updateSpecialBookDetails(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/edit', info, httpOptions)
    .pipe(tap());
  }

  deleteSpecialDetailedBooking(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/delete', info, httpOptions)
    .pipe(tap());
  }

  deleteSpecialBookingInfo(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/infoDelete', info, httpOptions)
    .pipe(tap());
  }

  isCnNO(cnNo): any{
    return this.http.get<any>(this.apiUrl + '/isCNNO/' + cnNo).toPromise();
  }

  isSpecialookingMF_bookedCNNO(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/isSpecialBookedMForCNNO', data, httpOptions)
    .pipe(tap());
  }

}
