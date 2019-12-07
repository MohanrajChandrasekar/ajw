import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PincodeRateMaster } from '../../../masters/pincodeRateMaster/pincodeRateMaster';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PincodeRateMasterService {

  pincodeRateMasterInfo: PincodeRateMaster[];

  public apiUrl = environment.apiUrl + '/master/pincode/ratemaster';

  constructor(private http: HttpClient) { }

  getPincodeRateMasterDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }

  getRateMasterCode(): any {
    return this.http.get<any>(this.apiUrl + '/postal/code').toPromise();
  }

  getPincodeRateMasterById(Id): any {
    return this.http.get<any>(this.apiUrl + '/' + Id).toPromise();
  }

  getRateByPincode(pincodeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/pinRate", pincodeInfo, httpOptions).pipe(tap());
  }

  addPincodeRateMasterDetail(pincodeRateMasterInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', pincodeRateMasterInfo, httpOptions).pipe(tap());
  }

  updatePincodeRateMasterDetail(pincodeRateMasterInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", pincodeRateMasterInfo, httpOptions).pipe(tap());
  }

  deletePincodeRateMasterDetail(pincodeRateMasterInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", pincodeRateMasterInfo, httpOptions).pipe(tap());
  }

  getRateMasterPostalBD(postalType): any {
    return this.http.get<any>(this.apiUrl + '/BDRatesPostal/'+ postalType).toPromise();
  }

  getPostalsByRateTypes(rateType): any {
    return this.http.get<any>(this.apiUrl + '/byRateType/' + rateType).toPromise();
  }

  getPostalVendorAndRate(Info: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/getpostalRates", Info, httpOptions).pipe(tap());
  }

}
