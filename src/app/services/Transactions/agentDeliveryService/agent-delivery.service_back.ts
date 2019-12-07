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
export class AgentDeliveryService {

  public apiUrl = environment.apiUrl+'/transaction/agent';

  constructor(private http: HttpClient) { }

  getBookedList(): any{
    return this.http.get<any>(this.apiUrl + '/booked').toPromise();
  }

  getBookedListByCNNO(cnNO): any{
    return this.http.get<any>(this.apiUrl + '/bycnno/' + cnNO).toPromise();
  }

  getAgentDelvryDetails(): any{
    return this.http.get<any>(this.apiUrl + '/agentDlvr').toPromise();
  }

  getAgentDelvryDetailsByMfID(mfId): any{
    return this.http.get<any>(this.apiUrl + '/detailsByMfId/' + mfId).toPromise();
  }

  getAgentDelvryListByMfID(mfId): any{
    return this.http.get<any>(this.apiUrl + '/agentListByMfId/' + mfId).toPromise();
  }

  getBookedAgentDelvrListByMfID(mfId): any{
    return this.http.get<any>(this.apiUrl + '/agentDevilerListByMfID/' + mfId).toPromise();
  }

  updateAgentDelivery(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/update', info, httpOptions).pipe(tap());
  }

  getAgentDeliveryListByDate(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/byDateRange', info, httpOptions).pipe(tap());
  }

  deleteByMfID(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/deleteByMfId', info, httpOptions).pipe(tap());
  }

  addPOD(PODInfo: any): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/addPOD', PODInfo, httpOptions)
    .pipe(tap());
  }

  getPODList(): any{
    return this.http.get<any>(this.apiUrl + '/podList').toPromise();
  }

  getPODbyCNNO(CNNO): any{
    return this.http.get<any>(this.apiUrl + '/getPODbyCNNO/' + CNNO).toPromise();
  }
  
}
