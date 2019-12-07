import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-type' : 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class JobPlannerService {

  public apiURL = environment.apiUrl + '/transaction/income/jobplanner'; 
  
  constructor(private http: HttpClient) { }

  getIncomeDetailsByRunNo(secRunNo): any{
    return this.http.get<any>(this.apiURL+ '/' + secRunNo).toPromise();
  }

  getNotUsedRunList(secRunNo): any{
    return this.http.get<any>(this.apiURL+ '/runlist/' + secRunNo).toPromise();
  }

  getLandedWtByHAWN(secHawnNo): any{
    return this.http.get<any>(this.apiURL+ '/landedWts/' + secHawnNo).toPromise();
  }

  getBoxPcsByHAWN(secHawnNo): any{
    return this.http.get<any>(this.apiURL+ '/allboxPcs/' + secHawnNo).toPromise();
  }


}
         