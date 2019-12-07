import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Company } from '../../../masters/company/company';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ConsignServiceService {

  public apiUrl = environment.apiUrl+'/master/consignorConsignee';

  constructor(private http: HttpClient) { }

  getConsignorDetails(): any {
    return this.http.get<any>(this.apiUrl + '/consignor').toPromise();
  }

  getConsigneeDetails(Info): any {
    return this.http.post<any>(this.apiUrl + '/consignee', Info, httpOptions).pipe(tap());
  }

  getConsignorsByMagzAndDoc(Info): any {
    return this.http.post<any>(this.apiUrl + '/getConsignor', Info, httpOptions).pipe(tap());
  }

  addConsignDetails(consignInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', consignInfo, httpOptions)
      .pipe(tap());
  }

  getListOfConsigneeDetails(): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/getConsignee', httpOptions).pipe(tap());
  }

  getConsigneeDetail(): any {
    return this.http.get<any>(this.apiUrl + '/consignee').toPromise();
  }

  getConsigneeConsignorDetailById(id):any{
    return this.http.get<any>(this.apiUrl+'/'+id).toPromise();
  }

}
