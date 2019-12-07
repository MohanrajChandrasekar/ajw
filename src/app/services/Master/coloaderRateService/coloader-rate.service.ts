import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ColoaderRate } from '../../../masters/coloaderRate/coloaderRate';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ColoaderRateService {

  coloaderRateInfo: ColoaderRate[];

  public apiUrl = environment.apiUrl + '/master/coloaderRate';

  constructor(private http: HttpClient) { }

  getColoaderRateDetails(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(tap());
  }
  
  getColoaderRateById(Id): any {
    return this.http.get<any>(this.apiUrl + '/' + Id).toPromise();
  }

  addColoaderRateDetail(coloaderRateInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', coloaderRateInfo, httpOptions)
      .pipe(
        tap());
  }

  updateColoaderRateDetail(coloaderRateInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", coloaderRateInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  deleteColoaderRateDetail(coloaderRateInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", coloaderRateInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  getColoadersByBranches(branches: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/rateByBranche', branches, httpOptions)
  }

  getColoadersForOutscan(): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/coloaders', httpOptions)
  }
   
}
