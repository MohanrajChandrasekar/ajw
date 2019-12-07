import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from '../../../../environments/environment';



const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: 'root'
})

export class IncomeLoadService {
  public apiUrl = environment.apiUrl + '/transaction/income/manifest';
  constructor(private http: HttpClient) { }

  getIncomingDetails(): any{
    return this.http.get<any>(this.apiUrl).toPromise();
  }

  getIncomingBranchWise(userInfo: any):  Observable<any>{
    return this.http.post<any>(this.apiUrl + '/branch' , userInfo, httpOptions).pipe(
      tap()
    );
  }

  getBranchedIncomeRuns(branchID): any{
    return this.http.get<any>(this.apiUrl + '/runList/' + branchID, httpOptions).toPromise();
  }
  
  getIncomingList(id): any{
    console.log(id);
    return this.http.get<any>(this.apiUrl + '/' + id).toPromise();
  }

  getLoadByID(id): any{
    return this.http.get<any>(this.apiUrl + '/income/' + id).toPromise();
  }

  addLoadInfo(loadInfo: any): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/load', loadInfo, httpOptions)
    .pipe(tap());
  }

  //add new incoming init
  addIncomeMfst(loadInfo: any): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/insert', loadInfo, httpOptions)
    .pipe(tap());
  }

  // update new incoming manifest
  updateIncomeMfst(loadInfo: any): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/update', loadInfo, httpOptions)
    .pipe(tap());
  }

  //update income row load Details
  updateIncomeLoadRowbyID(loadInfo: any): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/editRowMfst', loadInfo, httpOptions)
    .pipe(tap());
  }

  //Delete income manifest details by ID
  deleteIncomeMfst(loadInfo): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/deleteMfst', loadInfo, httpOptions)
    .pipe(tap());
  }

  //Delete income manifest detail list by ID
  deleteIncomeMfstList(loadInfo): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/deleteMfstList', loadInfo, httpOptions)
    .pipe(tap());
  }

  deleteBoxByID(boxInfo): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/boxDelete', boxInfo, httpOptions)
    .pipe(tap());
  }

  //Get Box Details By Mfst ID
  getBoxDetailByMfstID(id): any{
    return this.http.get<any>(this.apiUrl + '/getBoxDetails/' + id).toPromise();
  }

  getBoxDetailByBoxID(id): any{
    return this.http.get<any>(this.apiUrl + '/getBoxDetailByBoxID/' + id).toPromise();
  }

  addBoxDetailByMfstID(boxInfo): any{
    return this.http.post<any>(this.apiUrl + '/boxInsert', boxInfo, httpOptions);
  }

  updateBoxDetailByMfstID(boxInfo): any{
    return this.http.post<any>(this.apiUrl + '/boxUpdate', boxInfo, httpOptions);
  }

  updateAllBoxDetailByMfstID(boxInfo): any{
    return this.http.post<any>(this.apiUrl + '/boxupdateAll', boxInfo, httpOptions);
  }

  // Is Run No Check
  isRunNo(runNo): any{
    return this.http.get<any>(this.apiUrl + '/isRunNo/' + runNo).toPromise();
  }

  // Is Hawn No Check
  isHawnNo(hawnNo): any{
    return this.http.get<any>(this.apiUrl + '/isHawnNo/' + hawnNo).toPromise();
  }

  // Update landed Pcs
  updateLandedPcs(loadList: any): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/landedPcs', loadList, httpOptions)
    .pipe(tap());
  }

  getDetailsByMawbNo(data): any{
    return this.http.post<any>(this.apiUrl + '/secMawbno', data, httpOptions).pipe(
      tap());
  }

  getReportDataByMawbNo(data): any{
    return this.http.post<any>(this.apiUrl + '/reportByMAWB', data, httpOptions).pipe(
      tap());
  }

  getGroupedDetailsByMawbNo(data): any{
    return this.http.post<any>(this.apiUrl + '/secMawbnoForGroupedReport', data, httpOptions).pipe(
      tap());
  }

  getWeightBreakupReportByMAWB(data): any{
    return this.http.post<any>(this.apiUrl + '/weightReport', data, httpOptions).pipe(
      tap());
  }

  // KGS 2 LBS
  kgs2Lbs(kgs: any){
        // let kgs = event.target.value;
        let lbs = 0;
        let unit = 2.20462;
        lbs = lbs + (unit * kgs);
        let str = lbs.toString();
        let got = 0;
        for (let i = 0; i < str.length; i++) {
          if (str.charAt(i) == '.') {
            got = i;
          }
      }
      got = got + 4;
      let res = str.substring(0, got);
      return res;
  }

  // LBS 2 KGS
  lbs2kgs(lbs: any){
      // let lbs = event.target.value;
      let kgs = 0;
      let unit = 0.453592;
      kgs = kgs + (unit * lbs);
      let str = kgs.toString();
      let got = 0;
      for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) == '.') {
          got = i;
        }
    }
    got = got + 4;
    let res = str.substring(0, got);
    return res;
  }

  checkMAWB(data): any{
    return this.http.post<any>(this.apiUrl + '/checkMAWB', data, httpOptions).pipe(tap());
  }

  getDeliveryCategoryByIncomeID(incomeId): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/getCategoryLost/' + incomeId).pipe(tap());
  }

  setClearAllCategoryByIncomeID(incomeId): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/deleteAllCategoryByIncomeId/' + incomeId).pipe(tap());
  }

  removeCategiryByIdAndIncomeID(obj): Observable<any>{
    return this.http.post<any>(this.apiUrl + '/deleteByCategoryIdAndIncomeId', obj, httpOptions).pipe(tap());
  }

  getDeliveryCategoryByRunNo(runNo): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/getDeliveryCategoryByRunNO/' + runNo).pipe(tap());
  }

  getStationArrivalReportByRunNo(runNo): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/getStationArrivalByRun/' + runNo).pipe(tap());
  }

}


