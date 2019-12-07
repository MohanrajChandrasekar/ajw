import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpRequest, HttpEventType, HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { Role } from '../../../admin/role/role';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  roleInfo: any[];

  public apiUrl = environment.apiUrl+'/master/roles';


  constructor(private http: HttpClient) { }

  getRoles(): any{
    return this.http.get<any>(this.apiUrl).toPromise();
  }

  getRoleById(id) : any{
      return this.http.get<any>(this.apiUrl+ '/' + id).toPromise();
  }

  addRole(roleInfo: any): Observable<any> {
      return this.http.post<any>(this.apiUrl + '/insert', roleInfo, httpOptions)
          .pipe(
              tap());
  }

  updateRole(roleInfo: any): Observable<any> {
      return this.http.post<any>(this.apiUrl + "/Update", roleInfo, httpOptions)
          .pipe(
              tap()
          );
  }

  deleteRole(roleInfo: any): Observable<any> {
      return this.http.post<any>(this.apiUrl + "/Delete", roleInfo, httpOptions)
          .pipe(
              tap()
          );
  }
}
