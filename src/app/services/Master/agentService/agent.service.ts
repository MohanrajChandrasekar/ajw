import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  public apiUrl = environment.apiUrl + '/master/agent';

  constructor(private http: HttpClient) { }

  getAgentDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getAgentDetailById(id): any {
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  addAgentDetails(agentInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/insert', agentInfo, httpOptions)
      .pipe(
        tap());
  }

  updateAgentDetails(agentInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/update', agentInfo, httpOptions)
      .pipe(
        tap());
  }
  deleteAgentDetail(agentInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delete', agentInfo, httpOptions)
      .pipe(
        tap());
  }

}








