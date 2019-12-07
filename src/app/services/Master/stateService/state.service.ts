import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { State } from '../../../masters/state/state';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StateService {

  stateInfo: State[];

  public apiUrl = environment.apiUrl+'/master/state';

  constructor(private http: HttpClient) { }

  getStateDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getStateById(Id): any {
    return this.http.get<any>(this.apiUrl + '/' + Id).toPromise();
  }

  addStateDetail(stateInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', stateInfo, httpOptions)
      .pipe(
        tap());
  }

  updateStateDetail(stateInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", stateInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  deleteStateDetail(stateInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", stateInfo, httpOptions)
      .pipe(
        tap()
      );
  }
}
