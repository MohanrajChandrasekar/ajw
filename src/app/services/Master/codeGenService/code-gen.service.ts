import { Injectable } from '@angular/core';
import { Code } from '../../../masters/code_gen/CodeGen';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodeGenService {
  public apiUrl = environment.apiUrl + '/master/code_gen';

  codeGenInfo: Code[];


  constructor(private http: HttpClient) { }
  getCodeGenDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getCodeGenDetailById(id): any {
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  addCodeGenDetails(codeGenInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', codeGenInfo, httpOptions)
      .pipe(
        tap());
  }

  updateCodeGenDetails(codeGenInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/update', codeGenInfo, httpOptions)
      .pipe(
        tap());
  }
  deleteCodeGenDetail(codeGenInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', codeGenInfo, httpOptions)
      .pipe(
        tap());
  }

  getLastNumber(codeGenInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/lastNumber', codeGenInfo, httpOptions)
      .pipe(
        tap());
  }

  checkstart(): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/checkstart', httpOptions)
    .pipe(tap());
  }

}
