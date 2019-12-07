import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BookIssue } from '../../../masters/book-issue/bookIssue';
import { environment } from '../../../../environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BookIssueService {

  public apiUrl = environment.apiUrl + '/master/book_issue';

  constructor(private http: HttpClient) { }

  getBookIssueDetails(): any {
    return this.http.get<any>(this.apiUrl).toPromise();
  }
  getBookIssueDetailById(Id): any {
    return this.http.get<any>(this.apiUrl + '/' + Id).toPromise();
  }

  getBookIssueDetailByMagazine(magazine): any {
    return this.http.get<any>(this.apiUrl + '/magazine/' + magazine).toPromise();
  }

  addBookIssueDetail(bookIssueInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/Insert', bookIssueInfo, httpOptions)
      .pipe(
        tap());
  }

  updateBookIssueDetail(bookIssueInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/update", bookIssueInfo, httpOptions)
      .pipe(
        tap()
      );
  }

  deleteBookIssueDetail(bookIssueInfo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/delete", bookIssueInfo, httpOptions)
      .pipe(
        tap()
      );
  }
}
