import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public apiUrl = environment.apiUrl+'/user';

  constructor(private http: HttpClient) { }

  userRoles(userName): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/rolesByUser', userName, httpOptions).pipe(tap());
  }

}
