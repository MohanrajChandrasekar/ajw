import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Pincode } from '../../../masters/pincode/pincode';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PincodeService {

  pincodeInfo: Pincode[];

  public apiUrl = environment.apiUrl+'/master/pincode';

  constructor(private http: HttpClient) { }

  getPincodeDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  
  getPincodeById(Id): any {
    return this.http.get<any>(this.apiUrl + '/' + Id).toPromise();
  }

  addPincodeDetail(pincodeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', pincodeInfo, httpOptions)
      .pipe(tap());
  }

  updatePincodeDetail(pincodeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", pincodeInfo, httpOptions)
      .pipe(tap());
  }

  deletePincodeDetail(pincodeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", pincodeInfo, httpOptions)
      .pipe(tap());
  }

  getPincodeDetailByPincode(pincodeInfo): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/byPincode", pincodeInfo, httpOptions).pipe(tap());
  }

  getPinListDetails(): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/pinList', httpOptions).pipe(tap());
  }

  getPincodeByCity(Info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/byCity', Info, httpOptions).pipe(tap());
  }
}
