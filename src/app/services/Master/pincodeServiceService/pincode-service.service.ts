import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PincodeService } from '../../../masters/pincodeService/pincodeService';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PincodeServiceService {

  pincodeServiceInfo: PincodeService[];

  public apiUrl = environment.apiUrl+'/master/pincode/service';

  constructor(private http: HttpClient) { }

  getPincodeServiceDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }

  getPincodeServiceById(Id): any {
    return this.http.get<any>(this.apiUrl + '/' + Id).toPromise();
  }

  getCityByPincode(pincode): any {
    return this.http.get<any>(this.apiUrl + '/city/' + pincode).toPromise();
  }

  getPincodeServiceByCity(ajwCity): any {
    return this.http.get<any>(this.apiUrl + '/pincodes/' + ajwCity).toPromise();
  }


  addPincodeServiceDetail(pincodeServiceInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', pincodeServiceInfo, httpOptions)
      .pipe(
        tap());
  }

  updatePincodeServiceDetail(pincodeServiceInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", pincodeServiceInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  deletePincodeServiceDetail(pincodeServiceInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", pincodeServiceInfo, httpOptions)
      .pipe(
        tap()
      );
  }
}
