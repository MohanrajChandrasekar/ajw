import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { debug } from 'util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
  public apiUrl = environment.apiUrl + '/barcode';

  constructor(private http: HttpClient) { }

  generateBarcode(cnNO): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/' + cnNO).pipe(tap());
  }

}
