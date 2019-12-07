import { Injectable } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Coloader} from '../../../masters/coloader/coloader';
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColoaderService {
  public apiUrl = environment.apiUrl + '/master/coloader';

  coloaderInfo: Coloader[];
  
  
    constructor(private http: HttpClient) { }
  
    getColoaderDetails(): any {
      return this.http.get<any>(this.apiUrl).toPromise();
    }
    getColoaderDetailById(id):any{
      return this.http.get<any>(this.apiUrl+ '/'+id).toPromise();
    }
  
    addColoaderDetails(coloaderInfo: any): Observable<any> {
      return this.http.post<any>(this.apiUrl + '/insert', coloaderInfo, httpOptions)
        .pipe(
          tap());
    }
  
    updateColoaderDetails(coloaderInfo: any): Observable<any> {
      return this.http.post<any>(this.apiUrl + '/update', coloaderInfo, httpOptions)
        .pipe(
          tap());
    }
    deleteColoaderDetail(coloaderInfo: any): Observable<any> {
      return this.http.post<any>(this.apiUrl + '/delete', coloaderInfo, httpOptions)
        .pipe(
          tap());
    }
  
    getColoaderRateByID(id):any{
      return this.http.get<any>(this.apiUrl+ '/getRate/' + id).toPromise();
    }
    
}
  
  