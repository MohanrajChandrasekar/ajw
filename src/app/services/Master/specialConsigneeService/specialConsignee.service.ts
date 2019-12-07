import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from '../../../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
};


@Injectable({
    providedIn: 'root'
})
export class SpecialConsigneeService {
    public apiUrl = environment.apiUrl + '/master/specialConsignee';

    specialConsigneeInfo: any = [];

    constructor(private http: HttpClient) { }

    getSpecialConsigneeList(): any {
        return this.http.get<any>(this.apiUrl + '/').toPromise();
    }

    getSpecialConsigneeById(id): any {
        return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
    }

    insertspecialConsignee(specialConsigneeInfo: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + '/Insert', specialConsigneeInfo, httpOptions).pipe(tap());
    }

    updatespecialConsignee(specialConsigneeInfo: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + '/update', specialConsigneeInfo, httpOptions).pipe(tap());
    }
    
    deletespecialConsignee(specialConsigneeInfo: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + '/delete', specialConsigneeInfo, httpOptions).pipe(tap());
    }

}
    
    
              



