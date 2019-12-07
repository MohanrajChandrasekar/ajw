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
export class CompanyService {

  companyInfo: Company[];

  public apiUrl = environment.apiUrl+'/master/company';

  constructor(private http: HttpClient) { }

  getCompanyDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getCompanyById(Id): any {
    return this.http.get<any>(this.apiUrl + '/' + Id).toPromise();
  }

  addCompanyDetail(companyInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', companyInfo, httpOptions)
      .pipe(
        tap());
  }

  updateCompanyDetail(companyInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", companyInfo, httpOptions)
      .pipe( 
        tap()
      );
  }

  deleteCompanyDetail(companyInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", companyInfo, httpOptions)
      .pipe(
        tap()
      );
  }
}
