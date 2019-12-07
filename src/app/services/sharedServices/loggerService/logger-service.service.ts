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
export class LoggerServiceService {

  public apiUrl = environment.apiUrl + '/log';

  constructor(private http: HttpClient) { }

  log(error: any, url: any): Observable<any> {
    const replace = {
      'error': error.message,
      'url': url
    };
    return this.http.post<any>(this.apiUrl + '/write', replace, httpOptions)
    .pipe(tap());
  }

  logOutLogger(user): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/logout', user, httpOptions).pipe(tap());
  }
}
