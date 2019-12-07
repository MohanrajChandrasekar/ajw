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
export class OutgoingPacketManifestService {

  public apiUrl = environment.apiUrl + '/transaction/outgoingPacketManifest';

  constructor(private http: HttpClient) { }

  getBookedListByCNNO(cnno): any {
    return this.http.get<any>(this.apiUrl + '/bycnnoForOutgoing/' + cnno).toPromise();
  }

  getBranchedOutPackages(branchID): any{
    return this.http.get<any>(this.apiUrl + '/branchedOutpackages/' + branchID).toPromise();
  }

  getOutPackingBranchWise(branchInfo): any{
    return this.http.post<any>(this.apiUrl + '/OutListBranchWise', branchInfo, httpOptions).pipe(tap());
  }

  getOutgoingPacketManifestDetails(userInfo): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/outgoingList', userInfo, httpOptions).pipe(
      tap()
    );
  }

  updateOutgoingPacketManifest(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/updateForOutgoing', info, httpOptions).pipe(tap());
  }

  getOutgoingPacketManifestByMfId(refOutMfID) {
    return this.http.get<any>(this.apiUrl + '/outgoingPacketManifestByMfId/' + refOutMfID).toPromise();
  }

  getOutgoingPacketManifestListByDate(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/byDateRange', info, httpOptions).pipe(tap());
  }

  deleteOutgoingList(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/deleteOutgoing", info, httpOptions)
      .pipe(
        tap()
      );
  }

  getPostalPackages(branchID): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/getpostalpackages/' + branchID).pipe(tap());
  }

  checkOutMFIDisExist(outMFID):  Observable<any>{
    return this.http.get<any>(this.apiUrl + '/isDuplicateOutMFID/' + outMFID).pipe(tap());
  }

  generateOutMFID():  Observable<any>{
    return this.http.get<any>(this.apiUrl + '/genOutMFID').pipe(tap());
  }

  checkForOutScanByCNNO(cnno): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/outscanCheckByCNNO/' + cnno).pipe(tap());
  }

  getOutPackedForScanning(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getInScannableOutPCK', info, httpOptions).pipe(tap());
  }

  getOutScannableConsignments(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getOutScannableByVendors', info, httpOptions).pipe(tap());
  }

  getOutPackedReportData(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getOutPackagedReportData', info, httpOptions).pipe(tap());
  }

  getOutPackedDetailedReport(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getOutPackagedDetailedReport', info, httpOptions).pipe(tap());
  }

}
