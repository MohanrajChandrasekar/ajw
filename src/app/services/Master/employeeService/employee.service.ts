import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Employee } from '../../../masters/employee/employee';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employeeInfo: Employee[];

  public apiUrl = environment.apiUrl + '/master/employee';


  constructor(private http: HttpClient) { }

  getEmployeeDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getEmployeeDetailsById(id): any {
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  addEmployeeDetails(employeeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', employeeInfo, httpOptions)
      .pipe(
        tap());
  }

  updateEmployeeDetails(employeeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", employeeInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  deleteEmployeeDetails(employeeInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", employeeInfo, httpOptions)
      .pipe(
        tap()
      );
  }
}
