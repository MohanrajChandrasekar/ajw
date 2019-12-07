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

  getBookedListBycnno1(info): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/BYCNNO', info, httpOptions).pipe(tap());
  }

  getAgentDelvryDetails(userInfo): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/agentDlvr', userInfo, httpOptions).pipe(
      tap()
    );
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

  addPOD(PODInfo): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/addPOD', PODInfo, httpOptions)
    .pipe(tap());
  }

  getPODList(): any{
    return this.http.get<any>(this.apiUrl + '/podList').toPromise();
  }

  getPODbyCNNO(CNNO): any{
    return this.http.get<any>(this.apiUrl + '/getPODbyCNNO/' + CNNO).toPromise();
  }
  
  getVendorList(branchID): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/vendorsList', branchID, httpOptions)
    .pipe(tap());
  }

  getOutgoingPCKsList(branchID): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/outPackageMFList', branchID, httpOptions)
    .pipe(tap());
  }

  getDeliverables(branchId): any{
    return this.http.get<any>(this.apiUrl + '/agentDeliverablesBranch/' + branchId).toPromise();
  }

  getInscanByBranchAndOutMF(info): any{
    return this.http.post<any>(this.apiUrl + '/getInscanData' , info, httpOptions).pipe(tap());
  }

  updateInscannByCNNO(info): any{
    return this.http.post<any>(this.apiUrl + '/updateInscanned' , info, httpOptions).pipe(tap());
  }

  getScannedCNNOs(info): any{
    return this.http.post<any>(this.apiUrl + '/scannedCNNOs' , info, httpOptions).pipe(tap());
  }

  getInScannableByBranch(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/scannableConsignmentsByBranch' , info, httpOptions).pipe(tap());
  }

  getDeliverableConsignmentsByBranch(info): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/delierableConsignmentsByBranch' , info, httpOptions).pipe(tap());
  }

  getDeliveryMFID(): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getDelvMFID', httpOptions).pipe(tap());
  }

  getDeliverablesVendorsByBranchId(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getVendorsForDeliverables', obj, httpOptions).pipe(tap());
  }

  getDeliverableConsignmentsByBranchId(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getConsignmentsForDelivery', obj, httpOptions).pipe(tap());
  }

  getVendorChangedConsignments(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getChangedVendorConsignments', obj, httpOptions).pipe(tap());
  }

  changeVendor(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/changeVendorBeforeDelivery', obj, httpOptions).pipe(tap());
  }

  getVendorDistributionList(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getVendorDistributedList', obj, httpOptions).pipe(tap());
  }

  getDetailedDistributionByVendor(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getDistributedDetailsByVendor', obj, httpOptions).pipe(tap());
  }

  getListOfPODs(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/listOfPods', httpOptions).pipe(tap());
  }

  getListOfPODsDetailedView(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getPODsDetailedList', obj, httpOptions).pipe(tap());
  }

  isGoForDeliveryCNNO(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/isGoForDelivery', obj, httpOptions).pipe(tap());
  }

  getPODHistory(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getPODHistory', obj, httpOptions).pipe(tap());
  }

  getListOfNotUpdatedPODs(obj): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/getListOfNotUpdatedPODs', obj, httpOptions).pipe(tap());
  }
}
