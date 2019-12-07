import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BookingDetailsService {

  public apiUrl = environment.apiUrl+'/transaction/booking';

  constructor(private http: HttpClient) { }

  addBookingDetails(bookingInfo): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insertbooking', bookingInfo, httpOptions)
      .pipe(tap());
  }

  addConsignmentDetails(details): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insertdetails', details, httpOptions)
      .pipe(tap());
  }

  deleteBookingInfo(info: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', info, httpOptions)
    .pipe(tap());
  }

  deleteBookingDetials(info: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/deleteDetails', info, httpOptions)
    .pipe(tap());
  }

  getBookedList(userInfo): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/booked', userInfo, httpOptions).pipe(
      tap());
  }

  getBookingInfoByID(id): any{
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  getBookingDetailsByID(id): any{
    return this.http.get<any>(this.apiUrl + '/details/' + id).toPromise();
  }

  getBookingDetailsByIDForReport(id): any{
    return this.http.get<any>(this.apiUrl + '/detailsForReport/' + id).toPromise();
  }

  getBookingDetailByDetailID(id): any{
    return this.http.get<any>(this.apiUrl + '/bydetail/' + id).toPromise();
  }

  updateBooking(booking: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/updatebooking', booking, httpOptions)
    .pipe(tap());
  }

  updateBookingDetails(details: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/updatedetails', details, httpOptions)
    .pipe(tap());
  }

  getPcsListByHawnNo(secHawnNo): any{
    return this.http.get<any>(this.apiUrl + '/peices/' + secHawnNo).toPromise();
  }

  ifPcsExistByID(id): any{
    return this.http.get<any>(this.apiUrl + '/pcsExist/' + id).toPromise();
  }
  
  getCountValidations(id): any{ 
    return this.http.get<any>(this.apiUrl + '/validation/' + id).toPromise();
  }

  getDetailsByDate(date: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/detailByDate', date, httpOptions)
    .pipe(tap());
  }

  isCnNO(cnNo): any{
    return this.http.get<any>(this.apiUrl + '/isCNNO/' + cnNo).toPromise();
  }

  checkCNNO(data:any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/checkCNNO', data, httpOptions)
    .pipe(tap());
  }

  getpod(loginId): any{
    return this.http.get<any>(this.apiUrl + '/loginId/' + loginId).toPromise();
  }

  getDomesticBookings(): any {
    return this.http.get<any>(this.apiUrl + '/domesticBookings').toPromise();
  }

  isDeliveryFailedCNNO(cnNO): any{
    return this.http.get<any>(this.apiUrl + '/isDeliveryFailedCNNO/' + cnNO).toPromise();
  }

  getPcsListSpclBookingByHawnNo(secHawnNo): any{
    return this.http.get<any>(this.apiUrl + '/specialPcsList/' + secHawnNo).toPromise();
  }

  getConsigneeByPostalID(pincodeId): any{
    return this.http.get<any>(this.apiUrl + '/consignee/' + pincodeId).toPromise();
  }

  getSpecialConsignees(): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getSpecialConsignees', httpOptions).pipe(tap());
  }

}
